const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("../githubAuth");
const router = express.Router();

// Start GitHub OAuth
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["read:user", "user:email"]
  })
);

// GitHub OAuth callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/login?error=oauth_failed"
  }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        displayName: user.displayName
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h"
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 60 * 60 * 1000
    });

const frontendUrl =
  process.env.FRONTEND_URL || "http://localhost:5173";

res.redirect(`${frontendUrl}/dashboard`);  }
);

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });

  res.json({
    message: "Logged out successfully"
  });
});

module.exports = router;