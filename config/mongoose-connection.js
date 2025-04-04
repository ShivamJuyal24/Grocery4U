const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/grocery") // Fixed IP address
  .then(function(){
      console.log("Connected to MongoDB");
  })
  .catch(function(err){
      console.error("MongoDB connection error:", err);
  });

module.exports = mongoose.connection;
