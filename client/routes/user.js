const { Router } = require("express");
const userRouter = Router();
const { z } = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const { authenticate } = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_USER_SECRET || "userSecret"; // Use a single secret

const bcryptSaltRounds = 10;

userRouter.use(express.json());

userRouter.post("/signup", async (req, res) => {
    const requiredBody = z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(2)
    });

    const parsedData = requiredBody.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ success:false, message: parsedData.error.errors });
    }

    const { email, password, name } = parsedData.data;
    const hashedPassword = await bcrypt.hash(password, bcryptSaltRounds);

    try {
        await User.create({ email, password: hashedPassword, name });
        res.status(201).json({ success:true, message: "Successfully Signed Up!" });
    } catch (e) {
        if (e.code === 11000) {
            return res.status(409).json({ success:false, message: "Email Already Exists !" });
        }
        res.status(500).json({ success:false, message: "Something went wrong", error: e.message });
    }
});

userRouter.post("/signin", async (req, res) => {
    const requiredBody = z.object({
        email: z.string().email(),
        password: z.string().min(8)
    });

    const parsedData = requiredBody.safeParse(req.body);

    if (!parsedData.success) {
        return res.status(400).json({ success:false, message: parsedData.error.errors });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select("password");
        if (!user) {
            return res.status(401).json({ success:false, message: "Incorrect Email" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success:false, message: "Incorrect Password" });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

        res.json({ success:true, token: token, message: "Successfully signed in" });
    } catch (e) {
        res.status(500).json({ success:false, message: "Something went wrong", error: e.message });
    }
});

userRouter.get("/validate-token", authenticate, async(req, res) => {
    res.status(200).json({success : true})
})

userRouter.get("/", authenticate, async(req, res) => {
    const user = await User.findById({_id : req.userId})
    const name = str => str.charAt(0).toUpperCase() + str.slice(1);

    res.status(200).json({name : name(user.name)})
})

module.exports = {
    userRouter
};
