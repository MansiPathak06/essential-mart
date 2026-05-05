/**
 * ESSENTIAL MART BACKEND - FULL PRODUCTION READY SERVER
 * Developer: Karishma Singh
 * Last Updated: 2026-04-19
 * Total Lines: ~520
 */

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const helmet = require('helmet');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. MIDDLEWARE SETUP
// ==========================================
app.use(helmet());
app.use(cors({
    origin: '*', 
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ==========================================
// 2. DATABASE CONNECTION
// ==========================================
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('connect', () => console.log('✅ PostgreSQL Database Connected'));
pool.on('error', (err) => {
    console.error('❌ Unexpected Database Error', err);
    process.exit(-1);
});

// ==========================================
// 3. HELPER FUNCTIONS
// ==========================================
const formatProduct = (row) => {
    if (!row) return null;

    let parsedImages = [];
    try {
        if (typeof row.images === 'string') {
            parsedImages = JSON.parse(row.images);
        } else if (Array.isArray(row.images)) {
            parsedImages = row.images;
        }
    } catch (e) {
        console.warn(`Image parse error for product ${row.id}`);
        parsedImages = [];
    }

    const oPrice = parseFloat(row.original_price) || 0;
    const dPrice = parseFloat(row.discounted_price) || 0;

    return {
        id: row.id,
        name: row.name || 'Unnamed Product',
        category: (row.category || '').toLowerCase(),
        sub_category: row.sub_category || 'general',
        original_price: oPrice,
        discounted_price: dPrice,
        price: dPrice > 0 ? dPrice : oPrice,
        images: parsedImages,
        image_url: parsedImages[0] || '/placeholder.jpg',
        discount: oPrice > 0 ? Math.round(((oPrice - dPrice) / oPrice) * 100) : 0,
        in_stock: row.in_stock ?? true,
        fabric: row.fabric || 'Premium Fabric',
        rating: parseFloat(row.rating) || 4.5,
        short_description: row.short_description || '',
        full_description: row.full_description || '',
        created_at: row.created_at
    };
};

const slugify = (text) => {
    return text ? text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '') : 'general';
};

// ====================== AUTH ROUTES ======================

// SIGNUP
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: "Email and password required" });

    try {
        // Check if user already exists
        const exists = await pool.query(
            "SELECT id FROM users WHERE email = $1", [email]
        );
        if (exists.rows.length > 0)
            return res.status(400).json({ error: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const role = email === 'admin@essential.com' ? 'admin' : 'user';

        const result = await pool.query(
            `INSERT INTO users (email, password, role, created_at)
             VALUES ($1, $2, $3, NOW()) RETURNING id, email, role`,
            [email, hashedPassword, role]
        );

        res.status(201).json({ 
            message: "Account created successfully",
            user: result.rows[0]
        });

    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).json({ error: "Signup failed" });
    }
});

// LOGIN
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: "Email and password required" });

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1", [email]
        );

        if (result.rows.length === 0)
            return res.status(401).json({ error: "Invalid email or password" });

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
            return res.status(401).json({ error: "Invalid email or password" });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'essential_mart_secret',
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user.id, email: user.email, role: user.role }
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ error: "Login failed" });
    }
});

// ==========================================
// 4. API ROUTES
// ==========================================

app.get('/', (req, res) => {
    res.send('🌟 Essential Mart Backend is Running!');
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'UP', database: 'Connected', time: new Date() });
});

// ====================== PRODUCTS ======================
app.get('/api/products', async (req, res) => {
    try {
        const { category } = req.query;
        let queryText = "SELECT * FROM products WHERE 1=1";
        let values = [];

        if (category && category !== 'all') {
            values.push(category.toLowerCase());
            queryText += ` AND LOWER(category) = $${values.length}`;
        }

        queryText += " ORDER BY id DESC";

        const result = await pool.query(queryText, values);
        const formatted = result.rows.map(formatProduct);

        console.log(`🔍 Found ${formatted.length} products`);
        res.json(formatted);
    } catch (err) {
        console.error("❌ GET /api/products Error:", err);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.get('/api/product-detail/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM products WHERE id = $1", [parseInt(id)]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
        res.json(formatProduct(result.rows[0]));
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});


// ====================== ADD TO CART (FINAL SAFE VERSION) ======================
app.post('/api/cart', async (req, res) => {
    const { product_name, price = 0 } = req.body;

    try {
        const result = await pool.query(`
            INSERT INTO orders 
            (user_name, total_amount, items_count, status, created_at)
            VALUES ($1, $2, $3, 'pending', NOW())
            RETURNING *
        `, [
            product_name || 'Unknown Product', 
            parseFloat(price), 
            1
        ]);

        console.log(`✅ Cart Added: ${product_name}`);
        res.status(201).json({ 
            success: true, 
            message: "Product added to cart successfully!" 
        });
    } catch (err) {
        console.error("Cart Error:", err.message);
        res.status(500).json({ error: "Failed to add to cart" });
    }
});
// ====================== ADMIN ROUTES ======================
app.get('/api/orders', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM orders ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/products', async (req, res) => {
    const { name, category, subcategory, originalPrice, discountedPrice, images, shortDescription, fullDescription, inStock } = req.body;

    if (!name || !originalPrice) {
        return res.status(400).json({ error: "Product name and price are required" });
    }

    try {
        const finalSub = slugify(subcategory || 'general');

        const queryText = `
            INSERT INTO products 
            (name, category, sub_category, original_price, discounted_price, images, short_description, full_description, in_stock)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
        `;

        const values = [
            name,
            (category || 'women').toLowerCase(),
            finalSub,
            parseFloat(originalPrice),
            parseFloat(discountedPrice) || parseFloat(originalPrice),
            JSON.stringify(images || []),
            shortDescription || '',
            fullDescription || shortDescription || '',
            inStock ?? true
        ];

        const result = await pool.query(queryText, values);
        res.status(201).json(formatProduct(result.rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add product" });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING id", [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
        res.json({ success: true, message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

// ==========================================
// 404 HANDLER
// ==========================================
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// ==========================================
// SERVER START
// ==========================================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    ==================================================
    🌟 ESSENTIAL MART BACKEND IS NOW LIVE 🌟
    --------------------------------------------------
    📡 Port: ${PORT}
    🔗 URL: http://localhost:${PORT}
    ✅ Ready for Frontend Connection
    ==================================================
    `);
});