import { useState } from "react";
import Modal from "../shared/Modal";
import Button from "../shared/Button";
import { useJobsContext } from "../../context/JobContext";

function SubmitWorkModal({ app, open, onClose }) {
<<<<<<< HEAD
  const { submitWork } = useJobsContext();
  const [notes, setNotes]         = useState("");
  const [deliveryLink, setLink]   = useState("");
  const [fileUrl, setFileUrl]     = useState("");

  const handleSubmit = () => {
    if (!app) return;
    submitWork(app.id);
    setNotes(""); setLink(""); setFileUrl("");
=======
  const { submitWork }              = useJobsContext();
  const [notes,        setNotes]    = useState("");
  const [deliveryLink, setLink]     = useState("");
  const [fileUrl,      setFileUrl]  = useState("");
  const [loading,      setLoading]  = useState(false);

  const handleSubmit = async () => {
    if (!app) return;
    setLoading(true);
    await submitWork(app.id, notes, deliveryLink || fileUrl);
    setNotes(""); setLink(""); setFileUrl("");
    setLoading(false);
>>>>>>> 1f5c1cac7a76ae75f35cbf5cf2162149029a69e0
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Submit Your Work">
<<<<<<< HEAD
      {/* Job summary */}
=======
>>>>>>> 1f5c1cac7a76ae75f35cbf5cf2162149029a69e0
      {app && (
        <div className="panel" style={{ marginBottom: "1.2rem" }}>
          <div className="panel-body">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{app.title}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "3px" }}>
                  Payment in escrow — released on approval
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.2rem", color: "var(--teal)" }}>
                ${app.amount?.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

<<<<<<< HEAD
      {/* Warning */}
=======
>>>>>>> 1f5c1cac7a76ae75f35cbf5cf2162149029a69e0
      <div className="info-box amber" style={{ marginBottom: "1.2rem" }}>
        <div className="icon">⚠️</div>
        <p>
          Once submitted, the client will review your work. They can{" "}
          <strong>approve</strong> (funds released),{" "}
          <strong>request a revision</strong> (you must resubmit), or{" "}
<<<<<<< HEAD
          <strong>reject</strong> (funds returned to client). Make sure your
          work is complete before submitting.
=======
          <strong>reject</strong> (funds returned to client).
>>>>>>> 1f5c1cac7a76ae75f35cbf5cf2162149029a69e0
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">Submission Notes</label>
        <textarea
          className="form-textarea"
          style={{ minHeight: "100px" }}
<<<<<<< HEAD
          placeholder="Describe what you've delivered, any notes for the client, links to files, etc."
=======
          placeholder="Describe what you've delivered, any notes for the client..."
>>>>>>> 1f5c1cac7a76ae75f35cbf5cf2162149029a69e0
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Delivery Link / File URL</label>
        <input
          className="form-input"
          placeholder="https://drive.google.com/... or GitHub link"
          value={deliveryLink}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Attach Files (optional)</label>
        <input
          className="form-input"
          placeholder="Paste public file URL"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "0.5rem" }}>
        <Button variant="outline" onClick={onClose} style={{ flex: 1 }}>
          Cancel
        </Button>
<<<<<<< HEAD
        <Button variant="teal" onClick={handleSubmit} style={{ flex: 2 }}>
          📤 Submit for Client Review
=======
        <Button variant="teal" onClick={handleSubmit} disabled={loading} style={{ flex: 2 }}>
          {loading ? "Submitting..." : "📤 Submit for Client Review"}
>>>>>>> 1f5c1cac7a76ae75f35cbf5cf2162149029a69e0
        </Button>
      </div>
    </Modal>
  );
}

export default SubmitWorkModal;