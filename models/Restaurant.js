 import mongoose from "mongoose";

 const MenuItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
});


 const restaurantSchema= new mongoose.Schema({
    name:{type:String, required: true},
  location: { type: String, required: true },
  image: { type: String, required: true },
  description:{type: String, required:true},
  type: { type: [String], enum: ['pickup', 'delivery'], required: true }, // 'pickup' or 'delivery'
  menu: [MenuItemSchema],
});

const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
