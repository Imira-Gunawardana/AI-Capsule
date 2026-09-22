import { useEffect, useState } from "react";

const emptyForm = {
  project_name: "",
  prompt_title: "",
  prompt_version: "v1",
  prompt_text: "",
  response_summary: "",
  category: "General",
  usefulness: "Good",
  reviewed: false,
  improved: false,
  screenshot_url: "",
  notes: ""
};

function Dashboard() {
  const [capsules, setCapsules] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "";

  // READ
  const loadCapsules = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/capsules`, {
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Could not load capsules");
      }

      const data = await response.json();
      setCapsules(data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load your prompts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCapsules();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // CREATE / UPDATE
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${API_URL}/api/capsules/${editingId}`
      : `${API_URL}/api/capsules`;

    try {
      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      setMessage(
        editingId
          ? "Prompt updated successfully."
          : "Prompt created successfully."
      );

      setForm(emptyForm);
      setEditingId(null);

      await loadCapsules();
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  // EDIT
  const handleEdit = (capsule) => {
    setEditingId(capsule.id);

    setForm({
      project_name: capsule.project_name || "",
      prompt_title: capsule.prompt_title || "",
      prompt_version: capsule.prompt_version || "v1",
      prompt_text: capsule.prompt_text || "",
      response_summary: capsule.response_summary || "",
      category: capsule.category || "General",
      usefulness: capsule.usefulness || "Good",
      reviewed: Boolean(capsule.reviewed),
      improved: Boolean(capsule.improved),
      screenshot_url: capsule.screenshot_url || "",
      notes: capsule.notes || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/capsules/${id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Delete failed");
      }

      setMessage("Prompt deleted successfully.");

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }

      await loadCapsules();
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
      });

      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>AI Capsule</h1>
          <p>My AI Prompt Library</p>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main className="dashboard-content">

        <section className="form-card">
          <div className="section-heading">
            <div>
              <h2>
                {editingId ? "Edit Prompt" : "Create Prompt"}
              </h2>

              <p>
                Save useful AI prompts and record how they performed.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="form-group">
                <label>Project Name *</label>

                <input
                  name="project_name"
                  value={form.project_name}
                  onChange={handleChange}
                  placeholder="e.g. AI Capsule Assessment"
                  required
                />
              </div>

              <div className="form-group">
                <label>Prompt Title *</label>

                <input
                  name="prompt_title"
                  value={form.prompt_title}
                  onChange={handleChange}
                  placeholder="e.g. Improve React UI"
                  required
                />
              </div>

              <div className="form-group">
                <label>Prompt Version</label>

                <input
                  name="prompt_version"
                  value={form.prompt_version}
                  onChange={handleChange}
                  placeholder="v1"
                />
              </div>

              <div className="form-group">
                <label>Category</label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option>General</option>
                  <option>Coding</option>
                  <option>Writing</option>
                  <option>Research</option>
                  <option>Debugging</option>
                  <option>Study</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Usefulness</label>

                <select
                  name="usefulness"
                  value={form.usefulness}
                  onChange={handleChange}
                >
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Average</option>
                  <option>Poor</option>
                </select>
              </div>

              <div className="form-group">
                <label>Screenshot URL</label>

                <input
                  name="screenshot_url"
                  value={form.screenshot_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

            </div>

            <div className="form-group">
              <label>Prompt Text *</label>

              <textarea
                name="prompt_text"
                value={form.prompt_text}
                onChange={handleChange}
                placeholder="Enter the AI prompt..."
                rows="6"
                required
              />
            </div>

            <div className="form-group">
              <label>Response Summary</label>

              <textarea
                name="response_summary"
                value={form.response_summary}
                onChange={handleChange}
                placeholder="Summarise the AI response..."
                rows="4"
              />
            </div>

            <div className="checkbox-row">

              <label>
                <input
                  type="checkbox"
                  name="reviewed"
                  checked={form.reviewed}
                  onChange={handleChange}
                />
                Reviewed
              </label>

              <label>
                <input
                  type="checkbox"
                  name="improved"
                  checked={form.improved}
                  onChange={handleChange}
                />
                Improved
              </label>

            </div>

            <div className="form-group">
              <label>Notes</label>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Additional notes..."
                rows="4"
              />
            </div>

            <div className="button-row">

              <button
                type="submit"
                className="primary-button"
              >
                {editingId ? "Update Prompt" : "Save Prompt"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleCancelEdit}
                >
                  Cancel Edit
                </button>
              )}

            </div>

          </form>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

        </section>


        <section className="prompts-section">

          <div className="section-heading">
            <div>
              <h2>Your Saved Prompts</h2>

              <p>
                {capsules.length} prompt
                {capsules.length === 1 ? "" : "s"} saved.
              </p>
            </div>
          </div>

          {loading ? (
            <p>Loading prompts...</p>
          ) : capsules.length === 0 ? (
            <div className="empty-state">
              <h3>No prompts yet</h3>
              <p>
                Create your first AI prompt using the form above.
              </p>
            </div>
          ) : (
            <div className="prompt-list">

              {capsules.map((capsule) => (
                <article
                  className="prompt-card"
                  key={capsule.id}
                >

                  <div className="prompt-card-header">

                    <div>
                      <h3>{capsule.prompt_title}</h3>

                      <p className="project-name">
                        {capsule.project_name}
                      </p>
                    </div>

                    <span className="category-badge">
                      {capsule.category || "General"}
                    </span>

                  </div>

                  <div className="prompt-meta">

                    <span>
                      Version: {capsule.prompt_version || "v1"}
                    </span>

                    <span>
                      Usefulness: {capsule.usefulness || "Not rated"}
                    </span>

                    <span>
                      Reviewed: {capsule.reviewed ? "Yes" : "No"}
                    </span>

                    <span>
                      Improved: {capsule.improved ? "Yes" : "No"}
                    </span>

                  </div>

                  <div className="prompt-preview">
                    <strong>Prompt</strong>

                    <p>
                      {capsule.prompt_text}
                    </p>
                  </div>

                  {capsule.response_summary && (
                    <div className="prompt-preview">
                      <strong>Response Summary</strong>

                      <p>
                        {capsule.response_summary}
                      </p>
                    </div>
                  )}

                  {capsule.notes && (
                    <div className="prompt-preview">
                      <strong>Notes</strong>

                      <p>
                        {capsule.notes}
                      </p>
                    </div>
                  )}

                  <div className="prompt-actions">

                    <button
                      className="edit-button"
                      onClick={() => handleEdit(capsule)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => handleDelete(capsule.id)}
                    >
                      Delete
                    </button>

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default Dashboard;