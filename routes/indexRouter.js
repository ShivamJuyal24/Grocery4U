const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const router = express.Router();
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

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
    const searchQuery = req.query.query;  // Get the search query from the URL

    if (!searchQuery) {
        return res.redirect("/shop");  // Redirect if no search query is provided
    }

    try {
        // Perform case-insensitive search based on product name
        const products = await productModel.find({
            name: { $regex: searchQuery, $options: 'i' }
        });

        // Render the shop view with the search results
        res.render("shop", { product: products, success: `Showing results for "${searchQuery}"` });
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

router.get("/addtocart/:id", isLoggedIn, async (req, res) => {
    const productId = req.params.id;

    let user = await userModel.findOne({ email: req.user.email });

    // Add the product to the cart
    user.cart.push(productId);
    await user.save();

    // Redirect to the cart page after adding the product to the cart
    // This will fetch the updated recommended products along with the updated cart
    req.flash("success", "Product added to cart");
    res.redirect("/shop");
});

router.get("/logout", isLoggedIn, function (req, res) {
    res.render("shop");
});

module.exports = router;
