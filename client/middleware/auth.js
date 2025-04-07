const jwt = require("jsonwebtoken");

// Middleware to authenticate and extract user information from JWT
const authenticate = (req, res, next) => {
    const token = req.headers.authorization; // Retrieve token from cookies

    if (!token) {
        return res.status(401).json({ success:false, message: "Authorization token is missing or invalid" });
    }

    try {
        // Verify the token using the JWT secret key
        const decoded = jwt.verify(token, process.env.JWT_USER_SECRET || "userSecret"); // Use the same secret
        req.userId = decoded.id; // Assuming the token contains `id` in its payload
        next();
    } catch (err) {
        res.status(401).json({ success:false, message: "Invalid or expired token" });
    }
};

module.exports = {
    authenticate
};
