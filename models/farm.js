const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const farmSchema = new Schema({
  name: {
    type: String,
    required: [true, "Farm must have a name!"]
  },
  type: {
    type: String,
    required: [true, "Farm must have a type!"],
  },
  location: {
    type: String,
    required: [true, "Farm must have a location!"]
  },
  email: {
    type: String,
    required: [true, "Email is required"]
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: "Product"
  }]
});

const Farm = mongoose.model("Farm", farmSchema);
module.exports = Farm;
