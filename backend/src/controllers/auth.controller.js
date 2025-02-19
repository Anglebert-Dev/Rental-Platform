const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');

const authController = {
  googleCallback: async (req, res) => {
    try {
      const token = jwt.sign(
        { id: req.user.id, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      res.json({ token, user: req.user });
    } catch (error) {
      res.status(500).json({ message: 'Authentication failed' });
    }
  },

  updateRole: async (req, res) => {
    try {
      const { role } = req.body;
      const user = await User.findByPk(req.user.id);
      user.role = role;
      await user.save();
      res.json({ message: 'Role updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Role update failed' });
    }
  }
};


