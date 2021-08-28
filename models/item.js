const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 120
  }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
