import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
    itemId: String,
    title: String,
    price: Number,
    quantity: Number,
  });

const UserSchema= new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'please provide name'],
    },
    email:{
        type: String,
        required: [true, 'please provie email'],
        unique: true,
        match:[/.+\@.+\..+/, 'please provde valid email address'],
    },
    password:{
        type: String,
        required:[true, 'please provide a password'],
        minlength: 6,
    },
    cart:[CartItemSchema],
},{timestamps: true});

const User= mongoose.models.User || mongoose.model('User', UserSchema);

export default User;