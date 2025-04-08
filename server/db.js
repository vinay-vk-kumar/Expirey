const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true }
},{ timestamps: true });

const expireySchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    date: { type: String, required: true },
    comment: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // Reference to User
},{ timestamps: true });

const User = mongoose.model("User", userSchema);
const Expirey = mongoose.model("Expirey", expireySchema);

module.exports = {
    User,
    Expirey
};
