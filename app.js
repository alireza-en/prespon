
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// تنظیمات سرور
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// نمایش فایل‌های سایت
app.use(express.static(path.join(__dirname, 'public')));

// محصولات فروشگاه
const products = [
    {
        id: 1,
        name: 'هدفون بی‌سیم',
        price: 2450000,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
        category: 'digital'
    },
    {
        id: 2,
        name: 'ساعت هوشمند',
        price: 3200000,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
        category: 'digital'
    },
    {
        id: 3,
        name: 'دوربین دیجیتال',
        price: 12500000,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
        category: 'digital'
    },
    {
        id: 4,
        name: 'اسپیکر رومیزی',
        price: 1850000,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80',
        category: 'accessory'
    },
    {
        id: 5,
        name: 'صفحه‌کلید کامپیوتر',
        price: 1450000,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
        category: 'accessory'
    },
    {
        id: 6,
        name: 'ماوس بی‌سیم',
        price: 850000,
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80',
        category: 'accessory'
    },
    {
        id: 7,
        name: 'چراغ رومیزی',
        price: 1150000,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
        category: 'home'
    },
    {
        id: 8,
        name: 'کوله‌پشتی',
        price: 1950000,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
        category: 'home'
    },
    {
        id: 9,
        name: 'قهوه‌ساز',
        price: 2750000,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
        category: 'home'
    }
];

// بررسی سلامت سرور
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'سرور Prespon فعال است.'
    });
});

// دریافت فهرست محصولات
app.get('/api/products', (req, res) => {
    const search = String(req.query.q || '').trim().toLowerCase();

    const result = products.filter(product =>
        product.name.toLowerCase().includes(search)
    );

    res.json(result);
});

// دریافت پیام فرم تماس
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (
        typeof name !== 'string' ||
        typeof email !== 'string' ||
        typeof message !== 'string' ||
        !name.trim() ||
        !email.trim() ||
        !message.trim()
    ) {
        return res.status(400).json({
            message: 'لطفاً تمام فیلدها را تکمیل کنید.'
        });
    }

    // فعلاً پیام در کنسول ثبت می‌شود؛
    // بعداً ذخیره در SQL Server را اضافه می‌کنیم.
    console.log('پیام جدید:', {
        name: name.trim(),
        email: email.trim(),
        message: message.trim()
    });

    res.status(201).json({
        message: 'پیام شما دریافت شد.'
    });
});

// نمایش صفحه اصلی برای مسیرهای غیر API
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// اجرای سرور
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Prespon running at http://localhost:${PORT}`);
});

