const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    image: Buffer,
    name: String,
    price: Number,
    category: String,
    bgcolor: String,
    panelcolor: String,
    textcolor: String,
    tags: [String],
    description: String
});

module.exports = mongoose.model("product", productSchema);
