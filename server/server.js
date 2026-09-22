const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");
const path = require("path");

dotenv.config();

require("./githubAuth");

const db = require("./database/database");
const capsuleRoutes = require("./routes/capsules");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

const frontendUrl =
  process.env.FRONTEND_URL || "http://localhost:5173";

// CORS
app.use(
  cors({
    origin: frontendUrl,
    credentials: true
  })
);

// General middleware
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Authentication
app.use("/auth", authRoutes);

// Capsule API
app.use("/api/capsules", capsuleRoutes);

// Serve React production build on Render
if (process.env.NODE_ENV === "production") {
  const clientDistPath = path.join(__dirname, "../client/dist");

  app.use(express.static(clientDistPath));

  app.use((req, res, next) => {
    if (
      req.method === "GET" &&
      !req.path.startsWith("/api/") &&
      !req.path.startsWith("/auth/")
    ) {
      return res.sendFile(
        path.join(clientDistPath, "index.html")
      );
    }

    next();
  });
}

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`AI Capsule server running on port ${PORT}`);
});