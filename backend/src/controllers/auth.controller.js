const jwt = require("jsonwebtoken");
const User = require("../models");

const authController = {
  googleCallback: async (req, res) => {
    try {
      const token = jwt.sign(
        {
          id: req.user.id,
          role: req.user.role,
          name: req.user.name,
          email: req.user.email,
          profilePicture: req.user.profilePicture,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      // Redirect to front-end with token as query parameter
      res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
    } catch (error) {
      res.status(500).json({ message: "Authentication failed" });
    }
  },

  verifyToken: (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("JWT Verification Error:", err);
        return res.status(403).send({ message: "Invalid or expired token" });
      }

      // Return the user data in the expected format
      res.status(200).send({
        data: {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          profilePicture: decoded.profilePicture,
          role: decoded.role,
        },
      });
    });
  },

  logout: (req, res) => {
    res.json({ message: "Logged out successfully" });
  },

  updateRole: async (req, res) => {
    try {
      const { role } = req.body;
      const user = await User.findByPk(req.user.id);
      user.role = role;
      await user.save();
      res.json({ message: "Role updated successfully", user });
    } catch (error) {
      res
        .status(500)
        .json({ error: error.message, message: "Role update failed" });
    }
  },
};

module.exports = authController;
