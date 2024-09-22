// server/server.js
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Sample products endpoint
const products = [
    { id: 1, name: "Album 1", price: 9.99 },
    { id: 2, name: "Merch T-Shirt", price: 19.99 },
    { id: 3, name: "Music Video 1", price: 4.99 },
];

app.get('/api/products', (req, res) => {
    res.json(products);
});

// Endpoint to create a payment intent
app.post('/api/create-checkout-session', async (req, res) => {
    const { items } = req.body;

    const line_items = items.map(item => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.name,
            },
            unit_amount: item.price * 100, // Amount in cents
        },
        quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: 'http://localhost:5000/success',
        cancel_url: 'http://localhost:5000/cancel',
    });

    res.json({ id: session.id });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
