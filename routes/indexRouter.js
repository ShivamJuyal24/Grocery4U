const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const router = express.Router();
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


router.get("/", function(req, res)  {
    let error = req.flash("error");
    res.render("index", { error, loggedin: false });
});

router.get("/shop", isLoggedIn, async function(req, res) {
    try {
        let product = await productModel.find();
        let success = req.flash("success");
        res.render("shop", { product, success });
    } catch (err) {
        console.error("Fetch error:", err);
        res.status(500).send("Error fetching products");
    }
});

router.get("/search", async function(req, res) {
  const searchQuery = req.query.query.trim();  // Get and trim the search query
  
  if (!searchQuery) {
      return res.redirect("/shop");
  }

  try {
      // First check if the search query matches any category
      const categories = ['vegetable', 'fruit', 'dairy', 'meat']; // Add your actual categories
      const isCategorySearch = categories.includes(searchQuery.toLowerCase());
      
      let products;
      
      if (isCategorySearch) {
          // If it's a category search, find all products in that category
          products = await productModel.find({
              category: { $regex: new RegExp(`^${searchQuery}$`, 'i') }
          });
      } else {
          // Otherwise perform a normal name search
          products = await productModel.find({
              $or: [
                  { name: { $regex: searchQuery, $options: 'i' } },
                  { category: { $regex: searchQuery, $options: 'i' } }
              ]
          });
      }

      res.render("shop", { 
          product: products, 
          success: isCategorySearch 
              ? `Showing all ${searchQuery}s` 
              : `Showing results for "${searchQuery}"`
      });
  } catch (err) {
      console.error("Error searching products:", err);
      res.status(500).send("Error searching products");
  }
});


router.get("/cart", isLoggedIn, async function (req, res) {
    const user = await userModel
      .findOne({ email: req.user.email })
      .populate("cart");

    const totalPrice = user.cart.reduce((total, product) => total + product.price, 0);
    const bill = totalPrice + 20;

    const categories = user.cart.map(p => p.category);
    const tags = user.cart.flatMap(p => p.tags);

    const recommended = await productModel.find({
      _id: { $nin: user.cart.map(item => item._id) }, // Exclude already added products
      $or: [
        { category: { $in: categories } },
        { tags: { $in: tags } }
      ]
    }).limit(8); // Limit to 8 recommended products

    // Send the updated recommended products and cart data to the cart page
    res.render("cart", { user, bill, recommended });
});
// Add this route with your other routes
router.get("/category/:category", isLoggedIn, async function(req, res) {
    try {
        const category = req.params.category;
        // Convert URL-friendly category name to display name
        const displayName = category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        // Find products with matching category (case-insensitive)
        const products = await productModel.find({
            category: { $regex: new RegExp(displayName, 'i') }
        });

        if (products.length === 0) {
            req.flash("error", `No products found in ${displayName} category`);
            return res.redirect("/shop");
        }

        res.render("shop", { 
            product: products, 
            success: `Showing ${displayName} category products`,
            category: displayName  // Pass the category name to the view
        });
    } catch (err) {
        console.error("Category fetch error:", err);
        req.flash("error", "Error fetching category products");
        res.redirect("/shop");
    }
});
router.get("/addtocart/:productid", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "Added to Cart.");
    res.redirect("/shop");
  });
  
  router.post('/create-checkout-session', isLoggedIn, async (req, res) => {
    try {
      const user = await userModel.findOne({ email: req.user.email }).populate('cart');
      
      if (!user || !user.cart || user.cart.length === 0) {
        return res.status(400).json({ error: 'Your cart is empty' });
      }
  
      // Convert base64 images to URLs (if needed)
      const line_items = user.cart.map(product => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: product.name,
            description: product.description || '', // Add fallback
            images: product.imageUrl ? [product.imageUrl] : [],
          },
          unit_amount: Math.round(product.price * 100), // Ensure integer
        },
        quantity: 1,
      }));
  
      // Add platform fee only if > 0
      if (20 > 0) {
        line_items.push({
          price_data: {
            currency: 'inr',
            product_data: { name: 'Platform Fee' },
            unit_amount: 20 * 100,
          },
          quantity: 1,
        });
      }
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${req.headers.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cart`,
        metadata: { userId: user._id.toString() },
      });
  
      console.log('Session created:', session.id); // Debug log
      res.json({ id: session.id });
  
    } catch (error) {
      console.error('STRIPE ERROR DETAILS:', {
        message: error.message,
        stack: error.stack,
        raw: error.raw || null,
      });
      res.status(500).json({ 
        error: 'Checkout failed',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  });
  router.get('/checkout/success', isLoggedIn, async (req, res) => {
    try {
      const user = await userModel.findOne({ email: req.user.email });
      
      // Render the checkout success page and pass the user object
      res.render('checkoutsuccess', { user });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).send('Something went wrong');
    }
  });
  
  



router.get("/logout", isLoggedIn, function (req, res) {
    res.render("shop");
});

module.exports = router;
