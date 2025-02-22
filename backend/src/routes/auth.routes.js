const router = require("express").Router();
const passport = require("../config/passport");
const {
  googleCallback,
  updateRole,
  logout,
  verifyToken,
} = require("../controllers/auth.controller");


const { authenticateToken } = require("../middleware/auth.middleware");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email", "openid"],
    prompt: "select_account",
  })
);
router.get("/google/callback", passport.authenticate("google"), googleCallback);
router.get('/verify', verifyToken);
router.put("/role", authenticateToken, updateRole);
router.get('/logout', logout);

module.exports = router;
