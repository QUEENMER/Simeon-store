// Replace with your Stripe publishable key
const stripe = Stripe('pk_test_your_publishable_key_here');

async function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    const lineItems = cart.map(item => ({
        price: item.stripePriceId,
        quantity: item.quantity
    }));

    try {
        const { error } = await stripe.redirectToCheckout({
            lineItems,
            mode: 'payment',
            successUrl: `${window.location.origin}/success.html`,
            cancelUrl: `${window.location.origin}/cancel.html`,
        });

        if (error) {
            alert('Payment failed: ' + error.message);
        }
    } catch (err) {
        console.error('Error:', err);
        alert('An error occurred during checkout');
    }
}
