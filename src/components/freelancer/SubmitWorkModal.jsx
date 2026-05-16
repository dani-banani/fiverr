import { useState } from "react";
import Modal from "../shared/Modal";
import Button from "../shared/Button";
import { useJobsContext } from "../../context/JobContext";

function SubmitWorkModal({ app, open, onClose }) {
  const { submitWork } = useJobsContext();
  const [notes, setNotes]         = useState("");
  const [deliveryLink, setLink]   = useState("");
  const [fileUrl, setFileUrl]     = useState("");

  const handleSubmit = () => {
    if (!app) return;
    submitWork(app.id);
    setNotes(""); setLink(""); setFileUrl("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Submit Your Work">
      {/* Job summary */}
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

      {/* Warning */}
      <div className="info-box amber" style={{ marginBottom: "1.2rem" }}>
        <div className="icon">⚠️</div>
        <p>
          Once submitted, the client will review your work. They can{" "}
          <strong>approve</strong> (funds released),{" "}
          <strong>request a revision</strong> (you must resubmit), or{" "}
          <strong>reject</strong> (funds returned to client). Make sure your
          work is complete before submitting.
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">Submission Notes</label>
        <textarea
          className="form-textarea"
          style={{ minHeight: "100px" }}
          placeholder="Describe what you've delivered, any notes for the client, links to files, etc."
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
        <Button variant="teal" onClick={handleSubmit} style={{ flex: 2 }}>
          📤 Submit for Client Review
        </Button>
      </div>
    </Modal>
  );
}

export default SubmitWorkModal;