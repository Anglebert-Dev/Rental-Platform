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

  verifyToken : (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; 
  
    if (!token) {
      return res.status(401).send({ message: "No token provided" });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: "Failed to authenticate token" });
      }
  
      // Assuming `decoded` has the user info
      res.status(200).send({ user: decoded });
    });
  };
  

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
