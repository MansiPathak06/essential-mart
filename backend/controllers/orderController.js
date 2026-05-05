const pool = require('../config/db');

const placeOrder = async (req, res) => {
    const { address_id, payment_method, cart_items } = req.body;

    if (!address_id || !payment_method || !cart_items?.length)
        return res.status(400).json({ error: 'Address, payment method aur cart items required hain' });

    try {
        // Cart se total calculate karo
        const cartResult = await pool.query(
            `SELECT c.quantity, p.discounted_price, p.name, p.id as product_id
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = $1`,
            [req.user.id]
        );

        if (cartResult.rows.length === 0)
            return res.status(400).json({ error: 'Cart empty hai' });

        const totalAmount = cartResult.rows.reduce(
            (sum, item) => sum + (parseFloat(item.discounted_price) * item.quantity), 0
        );
        const itemsCount = cartResult.rows.reduce((sum, item) => sum + item.quantity, 0);
        const productIds = cartResult.rows.map(r => ({ id: r.product_id, name: r.name, qty: r.quantity, price: r.discounted_price }));

        // Order insert karo
        const orderResult = await pool.query(
            `INSERT INTO orders (user_id, address_id, total_amount, items_count, status, payment_method, product_ids, created_at)
             VALUES ($1, $2, $3, $4, 'pending', $5, $6, NOW()) RETURNING *`,
            [req.user.id, address_id, totalAmount, itemsCount, payment_method, JSON.stringify(productIds)]
        );

        // Cart clear karo
        await pool.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);

        res.status(201).json({
            success: true,
            message: 'Order place ho gaya!',
            order: orderResult.rows[0],
        });
    } catch (err) {
        console.error('POST /api/orders Error:', err.message);
        res.status(500).json({ error: 'Order place nahi ho saka' });
    }
};

module.exports = { placeOrder };