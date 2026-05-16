import { useState } from "react";
import Button from "../shared/Button";
import Modal from "../shared/Modal";
import { useJobsContext } from "../../context/JobContext";

function ReviewPanel({ job }) {
  const { approveJob, requestRedo, rejectJob } = useJobsContext();

  const [redoOpen,   setRedoOpen]   = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [redoNote,   setRedoNote]   = useState("");
  const [redoDays,   setRedoDays]   = useState(5);
  const [rejectNote, setRejectNote] = useState("");

  if (!job) return null;

  return (
    <>
      <div
        className="panel"
        style={{ marginBottom: "16px", borderColor: "rgba(248,113,113,0.3)" }}
      >
        <div
          className="panel-head"
          style={{ borderColor: "rgba(248,113,113,0.2)" }}
        >
          <h3>📋 Work Submitted for Review</h3>
          <span className="badge badge-review">Action Required</span>
        </div>

        <div className="panel-body">
          {/* Warning */}
          <div className="info-box red" style={{ marginBottom: "1rem" }}>
            <div className="icon">⚠️</div>
            <p>
              The freelancer has submitted their work. Please review and take
              action. <strong>You have 3 days</strong> before auto-release
              kicks in.
            </p>
          </div>

          {/* Submission card */}
          <div className="review-submission">
            <div className="review-submission-title">
              {job.submissionTitle ?? "Submitted Work"}
            </div>

            {/* Delivery notes */}
            {job.submissionDesc && (
              <div className="review-submission-desc">
                {job.submissionDesc}
              </div>
            )}

            {/* Delivery link — clickable */}
            {job.submissionFile && (
  <div
    style={{
      margin: "10px 0",
      padding: "10px 12px",
      background: "var(--bg)",
      border: "1px solid var(--border2)",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
      <span style={{ fontSize: "1rem", flexShrink: 0 }}>🔗</span>
      <a                               // ✅ added
        href={job.submissionFile}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "var(--accent2)",
          fontSize: "0.8rem",
          fontFamily: "var(--font-mono)",
          textDecoration: "none",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {job.submissionFile}
      </a>
    </div>
    <a                                
      href={job.submissionFile}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-sm btn-outline"
      style={{ flexShrink: 0, fontSize: "0.75rem", padding: "4px 10px" }}
    >
      Open ↗
    </a>
  </div>
)}

            {/* Submission date */}
            {job.submissionDate && (
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--muted)",
                  marginBottom: "10px",
                }}
              >
                📅 Submitted {job.submissionDate}
              </div>
            )}

            <div className="review-actions" style={{ marginTop: "12px" }}>
              <Button variant="teal" small onClick={() => approveJob(job.id)}>
                ✅ Approve & Release Payment
              </Button>
              <Button variant="amber" small onClick={() => setRedoOpen(true)}>
                🔄 Request Revision
              </Button>
              <Button variant="danger" small onClick={() => setRejectOpen(true)}>
                ✗ Reject Job
              </Button>
            </div>
          </div>

          {/* Explanation */}
          <div
            className="info-box purple"
            style={{ marginTop: "12px", marginBottom: 0 }}
          >
            <div className="icon">💡</div>
            <p>
              Approving releases{" "}
              <strong>${job.amount?.toLocaleString()}</strong> from escrow
              instantly. Rejecting refunds you. Requesting a revision keeps
              funds locked.
            </p>
          </div>
        </div>
      </div>

      {/* Revision modal */}
      <Modal open={redoOpen} onClose={() => setRedoOpen(false)} title="Request Revision">
        <div className="info-box amber" style={{ marginBottom: "1.2rem" }}>
          <div className="icon">🔄</div>
          <p>
            The freelancer will be notified to revise their work.{" "}
            <strong>Funds remain locked in escrow</strong> until the revised
            submission is approved or rejected.
          </p>
        </div>
        <div className="form-group">
          <label className="form-label">Describe what needs to be revised</label>
          <textarea
            className="form-textarea"
            style={{ minHeight: "120px" }}
            placeholder="Be specific — tell the freelancer exactly what changes are needed..."
            value={redoNote}
            onChange={(e) => setRedoNote(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Extended Deadline (days from now)</label>
          <input
            type="number"
            className="form-input"
            min="1"
            value={redoDays}
            onChange={(e) => setRedoDays(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button variant="outline" onClick={() => setRedoOpen(false)} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button
            variant="amber"
            style={{ flex: 2 }}
            onClick={() => { requestRedo(job.id, redoNote, redoDays); setRedoOpen(false); }}
          >
            🔄 Send Revision Request
          </Button>
        </div>
      </Modal>

      {/* Reject modal */}
      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} title="Reject Job">
        <div className="info-box red" style={{ marginBottom: "1.2rem" }}>
          <div className="icon">⛔</div>
          <p>
            Rejecting will <strong>refund the full escrow amount to your
            wallet</strong>. The freelancer will not be paid. This cannot be
            undone.
          </p>
        </div>
        <div className="form-group">
          <label className="form-label">Reason for Rejection</label>
          <textarea
            className="form-textarea"
            style={{ minHeight: "100px" }}
            placeholder="Explain why the work is being rejected..."
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button variant="outline" onClick={() => setRejectOpen(false)} style={{ flex: 2 }}>
            Go Back
          </Button>
          <Button
            variant="danger"
            style={{ flex: 1 }}
            onClick={() => { rejectJob(job.id); setRejectOpen(false); }}
          >
            Reject &amp; Refund
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default ReviewPanel;