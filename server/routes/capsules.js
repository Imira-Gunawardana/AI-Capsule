const express = require("express");
const router = express.Router();

const db = require("../database/database");
const authenticateToken = require("../middleware/auth");

// GET /api/capsules
// Read only the authenticated user's records
router.get("/", authenticateToken, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT *
    FROM capsules
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.error("Error fetching capsules:", err.message);

      return res.status(500).json({
        error: "Failed to fetch capsules"
      });
    }

    res.json(rows);
  });
});


// POST /api/capsules
// Create a new record for the authenticated user
router.post("/", authenticateToken, (req, res) => {
  const userId = req.user.id;

  const {
    project_name,
    prompt_title,
    prompt_version,
    prompt_text,
    response_summary,
    category,
    usefulness,
    reviewed,
    improved,
    screenshot_url,
    notes
  } = req.body;

  if (!project_name || !prompt_title || !prompt_text) {
    return res.status(400).json({
      error: "Project name, prompt title and prompt text are required"
    });
  }

  const sql = `
    INSERT INTO capsules (
      user_id,
      project_name,
      prompt_title,
      prompt_version,
      prompt_text,
      response_summary,
      category,
      usefulness,
      reviewed,
      improved,
      screenshot_url,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    userId,
    project_name,
    prompt_title,
    prompt_version || "",
    prompt_text,
    response_summary || "",
    category || "",
    usefulness || "",
    reviewed ? 1 : 0,
    improved ? 1 : 0,
    screenshot_url || "",
    notes || ""
  ];

  db.run(sql, values, function (err) {
    if (err) {
      console.error("Error creating capsule:", err.message);

      return res.status(500).json({
        error: "Failed to create capsule"
      });
    }

    db.get(
      "SELECT * FROM capsules WHERE id = ? AND user_id = ?",
      [this.lastID, userId],
      (selectErr, row) => {
        if (selectErr) {
          return res.status(500).json({
            error: "Capsule created but could not be retrieved"
          });
        }

        res.status(201).json(row);
      }
    );
  });
});


// PUT /api/capsules/:id
// Update only a record owned by the authenticated user
router.put("/:id", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const capsuleId = req.params.id;

  const {
    project_name,
    prompt_title,
    prompt_version,
    prompt_text,
    response_summary,
    category,
    usefulness,
    reviewed,
    improved,
    screenshot_url,
    notes
  } = req.body;

  if (!project_name || !prompt_title || !prompt_text) {
    return res.status(400).json({
      error: "Project name, prompt title and prompt text are required"
    });
  }

  const sql = `
    UPDATE capsules
    SET
      project_name = ?,
      prompt_title = ?,
      prompt_version = ?,
      prompt_text = ?,
      response_summary = ?,
      category = ?,
      usefulness = ?,
      reviewed = ?,
      improved = ?,
      screenshot_url = ?,
      notes = ?
    WHERE id = ?
      AND user_id = ?
  `;

  const values = [
    project_name,
    prompt_title,
    prompt_version || "",
    prompt_text,
    response_summary || "",
    category || "",
    usefulness || "",
    reviewed ? 1 : 0,
    improved ? 1 : 0,
    screenshot_url || "",
    notes || "",
    capsuleId,
    userId
  ];

  db.run(sql, values, function (err) {
    if (err) {
      console.error("Error updating capsule:", err.message);

      return res.status(500).json({
        error: "Failed to update capsule"
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: "Capsule not found"
      });
    }

    db.get(
      "SELECT * FROM capsules WHERE id = ? AND user_id = ?",
      [capsuleId, userId],
      (selectErr, row) => {
        if (selectErr) {
          return res.status(500).json({
            error: "Updated but could not retrieve capsule"
          });
        }

        res.json(row);
      }
    );
  });
});


// DELETE /api/capsules/:id
// Delete only a record owned by the authenticated user
router.delete("/:id", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const capsuleId = req.params.id;

  const sql = `
    DELETE FROM capsules
    WHERE id = ?
      AND user_id = ?
  `;

  db.run(sql, [capsuleId, userId], function (err) {
    if (err) {
      console.error("Error deleting capsule:", err.message);

      return res.status(500).json({
        error: "Failed to delete capsule"
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: "Capsule not found"
      });
    }

    res.json({
      message: "Capsule deleted successfully"
    });
  });
});

module.exports = router;