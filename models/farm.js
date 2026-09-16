const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const farmSchema = new Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 200,
    required: [true, "Farm must have a name!"]
  },
  type: {
    type: String,
    trim: true,
    maxlength: 200,
    required: [true, "Farm must have a type!"],
  },
  location: {
    type: String,
    trim: true,
    maxlength: 200,
    required: [true, "Farm must have a location!"]
  },
  email: {
    type: String,
    trim: true,
    maxlength: 200,
    required: [true, "Email is required"]
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: "Product"
  }]
});

const Farm = mongoose.model("Farm", farmSchema);
module.exports = Farm;
