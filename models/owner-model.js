const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/grocery");

const ownerSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,

    products: {
        type: Array,
        default : []
    },
  
    picture: String,
    gstin: String,

});

module.export = mongoose.model("owner",ownerSchema);