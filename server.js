const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
const stripe = Stripe('sk_test_YOUR_SECRET_KEY'); // Replace with your Stripe Secret Key

// Middleware
app.use(cors());
app.use(express.json());

// Create Checkout Session
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { cart, billingDetails, successUrl, cancelUrl } = req.body;

        // Map cart items to Stripe line_items
        const lineItems = cart.map(item => ({
            price_data: {
                currency: 'usd', // Adjust currency as needed
                product_data: {
                    name: item.title,
                    images: [item.image]
                },
                unit_amount: Math.round(item.price * 100), // Convert to cents
            },
            quantity: item.quantity
        }));

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], // Add more payment methods if needed
            line_items: lineItems,
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            customer_email: billingDetails.email,
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'GB'] // Adjust as needed
            },
            metadata: {
                fullName: billingDetails.fullName
            }
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});