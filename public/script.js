
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilters = document.getElementById('categoryFilters');

const cartButton = document.getElementById('cartButton');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');

const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

let products = [];
let cart = [];
let activeCategory = 'all';
let searchText = '';

const money = number =>
    new Intl.NumberFormat('fa-IR').format(number) + ' تومان';

const categories = {
    digital: 'دیجیتال',
    accessory: 'لوازم جانبی',
    home: 'خانه و زندگی'
};

// دریافت محصولات از سرور
async function loadProducts() {
    productGrid.innerHTML = '<p>در حال دریافت محصولات...</p>';

    try {
        const response = await fetch('/api/products');

        if (!response.ok) {
            throw new Error('دریافت محصولات ناموفق بود.');
        }

        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error(error);
        productGrid.innerHTML =
            '<p class="empty-products">دریافت محصولات ناموفق بود. سرور را بررسی کن.</p>';
    }
}

// نمایش محصولات
function renderProducts() {
    const filtered = products.filter(product => {
        const matchesCategory =
            activeCategory === 'all' ||
            product.category === activeCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchText.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        productGrid.innerHTML =
            '<p class="empty-products">محصولی پیدا نشد.</p>';
        return;
    }

    productGrid.innerHTML = filtered.map(product => `
        <article class="product-card">
            <div class="product-image">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='https://placehold.co/600x450?text=Prespon'"
                >

                <span class="product-badge">پیشنهاد ویژه</span>

                <button
                    class="favorite-button"
                    data-favorite="${product.id}"
                    aria-label="افزودن به علاقه‌مندی‌ها"
                >♡</button>
            </div>

            <div class="product-info">
                <span class="product-category">
                    ${categories[product.category] || 'محصول'}
                </span>

                <h3>${product.name}</h3>

                <div class="product-bottom">
                    <span class="product-price">
                        ${money(Number(product.price))}
                    </span>

                    <button
                        class="add-to-cart"
                        data-add="${product.id}"
                    >
                        افزودن به سبد
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

// جست‌وجوی محصولات
searchInput.addEventListener('input', event => {
    searchText = event.target.value.trim();
    renderProducts();
});

// فیلتر دسته‌بندی
categoryFilters.addEventListener('click', event => {
    const button = event.target.closest('[data-category]');

    if (!button) return;

    activeCategory = button.dataset.category;

    categoryFilters.querySelectorAll('.filter-button').forEach(item => {
        item.classList.toggle('active', item === button);
    });

    renderProducts();
});

// افزودن محصول یا علاقه‌مندی
productGrid.addEventListener('click', event => {
    const addButton = event.target.closest('[data-add]');

    if (addButton) {
        addToCart(addButton.dataset.add);
        return;
    }

    const favoriteButton = event.target.closest('[data-favorite]');

    if (favoriteButton) {
        favoriteButton.classList.toggle('active');

        favoriteButton.textContent =
            favoriteButton.classList.contains('active') ? '♥' : '♡';
    }
});

// افزودن محصول به سبد
function addToCart(id) {
    const product = products.find(item => String(item.id) === String(id));

    if (!product) return;

    const existing = cart.find(item => String(item.id) === String(id));

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
    openCart();
}

// تغییر تعداد و حذف محصول
cartItems.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');

    if (!button) return;

    const id = button.dataset.id;
    const item = cart.find(product => String(product.id) === String(id));

    if (!item) return;

    switch (button.dataset.action) {
        case 'increase':
            item.quantity++;
            break;

        case 'decrease':
            item.quantity--;

            if (item.quantity <= 0) {
                cart = cart.filter(product =>
                    String(product.id) !== String(id)
                );
            }
            break;

        case 'remove':
            cart = cart.filter(product =>
                String(product.id) !== String(id)
            );
            break;
    }

    renderCart();
});

// نمایش سبد خرید
function renderCart() {
    const totalCount = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const totalPrice = cart.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    );

    cartCount.textContent = new Intl.NumberFormat('fa-IR')
        .format(totalCount);

    cartTotal.textContent = money(totalPrice);

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="cart-empty">سبد خرید شما خالی است.</p>';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img
                src="${item.image}"
                alt="${item.name}"
                onerror="this.onerror=null;this.src='https://placehold.co/150x150?text=Product'"
            >

            <div>
                <h4>${item.name}</h4>
                <p>${money(Number(item.price) * item.quantity)}</p>

                <div class="cart-item-actions">
                    <button
                        data-action="increase"
                        data-id="${item.id}"
                        aria-label="افزایش تعداد"
                    >+</button>

                    <span>${new Intl.NumberFormat('fa-IR')
                        .format(item.quantity)}</span>

                    <button
                        data-action="decrease"
                        data-id="${item.id}"
                        aria-label="کاهش تعداد"
                    >−</button>

                    <button
                        class="remove-item"
                        data-action="remove"
                        data-id="${item.id}"
                    >حذف</button>
                </div>
            </div>
        </div>
    `).join('');
}

// باز و بسته کردن سبد خرید
function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cart-open');
}

function hideCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cart-open');
}

cartButton.addEventListener('click', openCart);
closeCart.addEventListener('click', hideCart);
cartOverlay.addEventListener('click', hideCart);

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        hideCart();
    }
});

// منوی موبایل
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');

    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute(
        'aria-label',
        isOpen ? 'بستن منو' : 'باز کردن منو'
    );
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

// فرم تماس
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');

contactForm.addEventListener('submit', async event => {
    event.preventDefault();

    const submitButton = contactForm.querySelector(
        'button[type="submit"]'
    );

    submitButton.disabled = true;
    contactStatus.textContent = 'در حال ارسال پیام...';

    try {
        const formData = new FormData(contactForm);

        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'ارسال پیام ناموفق بود.');
        }

        contactStatus.textContent = 'پیام شما با موفقیت ارسال شد.';
        contactForm.reset();
    } catch (error) {
        contactStatus.textContent =
            error.message || 'ارتباط با سرور برقرار نشد.';
    } finally {
        submitButton.disabled = false;
    }
});

// فعلاً پرداخت واقعی پیاده‌سازی نشده است.
document.getElementById('checkoutButton').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('سبد خرید شما خالی است.');
        return;
    }

    alert('سبد خرید آماده است؛ اتصال درگاه پرداخت را بعداً اضافه می‌کنیم.');
});

// شروع برنامه
renderCart();
loadProducts();
