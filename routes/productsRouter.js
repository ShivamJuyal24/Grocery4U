const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");

router.post("/create", upload.single("image"), async function(req, res) {
    try {
        let {
            name,
            price,
            category,
            bgcolor,
            panelcolor,
            textcolor,
            tags,
            description
        } = req.body;

        // Optional: Convert comma-separated tags into an array (if your model expects an array)
        // tags = tags.split(',').map(tag => tag.trim());

        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            category,
            bgcolor,
            panelcolor,
            textcolor,
            tags,
            description
        });

        req.flash("success", "Product created successfully!");
        res.redirect("/owners/admin");
    } catch (err) {
        res.send(err.message);
    }
});

module.exports = router;
