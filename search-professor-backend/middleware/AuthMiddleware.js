const { verify } = require("jsonwebtoken");
const User = require("../model/userModel"); 

async function validateTokenMiddleware(req, res, next) {
  try {
    const rawAccessToken = req.headers.authorization;

    if (!rawAccessToken) {
      return res.status(401).json({ message: "User is not Authenticated" });
    }

    const accessToken = rawAccessToken.split(" ")[1];

    if (!accessToken || accessToken === "null") {
      return res.status(401).json({ message: "User is not Authenticated" });
    }

    const decoded = verify(accessToken, process.env.AUTH_SECRET_KEY);

    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // attach full user object
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = { validateTokenMiddleware };
