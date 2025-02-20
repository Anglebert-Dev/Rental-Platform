const jwt = require("jsonwebtoken");
const User = require("../models");

const authController = {
  googleCallback: async (req, res) => {
    try {
      const token = jwt.sign(
        {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (error) {
      res.redirect(
        `${process.env.FRONTEND_URL}/login?error=authentication_failed`
      );
    }
  },

  verifyToken: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          profilePicture: user.profilePicture,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Token verification failed" });
    }
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
