const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const isLoggedIn = require('../middlewares/isLoggedIn');
const userModel = require('../models/user-model');

router.post('/create-checkout-session', isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email }).populate('cart');
    
    // Prepare line items for Stripe
    const line_items = user.cart.map(product => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: product.name,
          images: [product.imageUrl], // Ensure product model includes image URL
        },
        unit_amount: product.price * 100, // Stripe uses cents/paisa
      },
      quantity: 1, // Adjust based on quantity control
    }));

    // Add platform fee as a separate line item
    line_items.push({
      price_data: {
        currency: 'inr',
        product_data: {
          name: 'Platform Fee',
        },
        unit_amount: 20 * 100, // Example platform fee amount (20 INR)
      },
      quantity: 1,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.DOMAIN}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/cart`,
      metadata: {
        userId: req.user._id.toString(),
      },
    });

    // Respond with session id
    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Error creating checkout session' });
  }
});

module.exports = router;
