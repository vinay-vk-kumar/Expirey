const { Router } = require("express");
const expireyRouter = Router();
const { z } = require("zod");
const { Expirey } = require("../db"); // Correct import for Expirey
const { authenticate } = require("../middleware/auth"); // Middleware for authentication
const express = require("express");
const mongoose = require("mongoose")


expireyRouter.use(express.json());

// Add a new expiry item
expireyRouter.post("/create", authenticate, async (req, res) => {
    const expireySchema = z.object({
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
        date: z.string(), // Date will be parsed as string and converted later
        comment: z.string().optional()
    });

    const parsedData = expireySchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ success: false, error: parsedData.error.errors });
    }

    const { name, price, quantity, date, comment } = parsedData.data;

    try {
        const newExpirey = await Expirey.create({
            name,
            price,
            quantity,
            date, // Convert string to Date object
            comment,
            userId: req.userId // Add user ID from authenticated token
        });
        res.status(201).json({success: true, newExpirey, message: "Item Added"});
    } catch (e) {
        res.status(500).json({ success: false, message: "Server Error While Creating Item", error: e.message });
    }
});

// Get all expiry items for the authenticated user
expireyRouter.get("/", authenticate, async (req, res) => {
    try {
        const items = await Expirey.find({ userId: req.userId });

        const result = items.map(item => {
            const currentDate = new Date();
            const expiryDate = new Date(item.date);
            const remainingDays = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
            
            return {
                ...item.toObject(),
                remainingDays: remainingDays
            };
        });

        res.status(200).json({result, message: "data send", success:true});
    } catch (e) {
        res.status(500).json({ message: "Error fetching items", error: e.message, success : false });
    }
});

// Update an existing expiry item
expireyRouter.put("/update/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    console.log("request came",id)
    const expireySchema = z.object({
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
        date: z.string()// Date as string
    });

    const parsedData = expireySchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ error: parsedData.error.errors });
    }

    const { name, price, quantity, date } = parsedData.data;
    console.log(name)
    try {
        const updatedExpirey = await Expirey.findOneAndUpdate(
            { _id: id, userId: req.userId }, // Ensure the user owns the item
            { name, price, quantity, date },
            { new: true } // Return the updated document
        );

        if (!updatedExpirey) {
            return res.status(404).json({ success: false, message: "Item not found or not authorized" });
        }

        res.json({success:true, updatedExpirey});
    } catch (e) {
        res.status(500).json({ success:false, message: "Error updating expiry item", error: e.message });
    }
});

// Delete an expiry item
expireyRouter.delete("/delete/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id);
    try {
        const deletedExpirey = await Expirey.findOneAndDelete({ _id: objectId });

        if (!deletedExpirey) {
            return res.status(404).json({success: false, message: "Item not found" });
        }

        res.json({ success: true, message: "Item deleted successfully" });
    } catch (e) {
        res.status(500).json({ success: false, message: "Error deleting expiry item", error: e.message });
    }
});

module.exports = {
    expireyRouter
};
