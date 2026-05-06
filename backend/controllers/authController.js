const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: 'Email and password required' });

    try {
        const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (exists.rows.length > 0)
            return res.status(400).json({ error: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const adminEmails = ['admin@essential.com', 'admin@ecommerce.com', 'admin@gmail.com'];
        const role = adminEmails.includes(email.toLowerCase()) ? 'admin' : 'user';

        const result = await pool.query(
            `INSERT INTO users (name, email, password, role, created_at)
             VALUES ($1, $2, $3, $4, NOW()) RETURNING id, email, role`,
            [name || '', email, hashedPassword, role]
        );

        const user = result.rows[0];

        // ✅ Token generate karo — same as login
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'essential_mart_secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Account created successfully',
            token,
            user: { id: user.id, email: user.email, role: user.role },
        });
    } catch (err) {
        console.error('Signup Error:', err.message);
        res.status(500).json({ error: 'Signup failed' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: 'Email and password required' });

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0)
            return res.status(401).json({ error: 'Invalid email or password' });

        const user = result.rows[0];

        const isBcryptHash = /^\$2[ab]\$/.test(user.password);
        let isMatch = false;

        if (isBcryptHash) {
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            isMatch = (password === user.password);
            if (isMatch) {
                const hashed = await bcrypt.hash(password, 10);
                await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, user.id]);
            }
        }

        if (!isMatch)
            return res.status(401).json({ error: 'Invalid email or password' });

        const role = (user.role || 'user').toLowerCase();

        const token = jwt.sign(
            { id: user.id, email: user.email, role },
            process.env.JWT_SECRET || 'essential_mart_secret',
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user.id, email: user.email, role },
        });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ error: 'Login failed' });
    }
};

module.exports = { signup, login };