import { useState } from "react";
import { useJobsContext } from "../../context/JobContext";
import SubmitWorkModal from "./SubmitWorkModal";

function ApplicationPanel({ applications, selectedAppId, onSelect }) {
  const [submitApp, setSubmitApp] = useState(null);

  const badgeClass = {
    hired:     "badge-active",
    pending:   "badge-pending",
    paid:      "badge-completed",
    submitted: "badge-review",
    revision:  "badge-redo",
  };

  const badgeLabel = {
    hired:     "Hired",
    pending:   "Pending",
    paid:      "Paid",
    submitted: "In Review",
    revision:  "Revision",
  };

  const iconBg = {
    hired:     "rgba(52,211,153,0.2)",
    pending:   "rgba(251,191,36,0.2)",
    paid:      "rgba(45,212,191,0.2)",
    submitted: "rgba(248,113,113,0.2)",
    revision:  "rgba(251,191,36,0.2)",
  };

  const iconColor = {
    hired:     "var(--green)",
    pending:   "var(--amber)",
    paid:      "var(--teal)",
    submitted: "var(--red)",
    revision:  "var(--amber)",
  };

  const iconEmoji = {
    hired:     "💼",
    pending:   "⏳",
    paid:      "✓",
    submitted: "📤",
    revision:  "🔄",
  };

  const activeCount = applications.filter((a) => a.status !== "paid").length;

  return (
    <>
      <div className="panel" style={{ marginBottom: "16px" }}>
        <div className="panel-head">
          <h3>My Applications</h3>
          <span className="badge badge-pending">{activeCount} active</span>
        </div>

        <div id="my-applications-list">
          {applications.map((app) => (
            <div key={app.id}>
              <div
                className="app-row"
                style={{ cursor: "pointer" }}
                onClick={() => onSelect(app.id)}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: iconBg[app.status] ?? "var(--surface2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    color: iconColor[app.status] ?? "var(--muted)",
                    flexShrink: 0,
                  }}
                >
                  {iconEmoji[app.status] ?? "•"}
                </div>

                <div className="app-row-info">
                  <div className="app-row-title">{app.title}</div>
                  <div className="app-row-company">{app.company}</div>
                </div>

                <div className="app-row-pay">
                  ${app.amount?.toLocaleString()}
                </div>

                <span className={`badge ${badgeClass[app.status] ?? "badge-pending"}`}>
                  {badgeLabel[app.status] ?? app.status}
                </span>
              </div>

              {/* Submit button row — only for hired jobs */}
              {app.status === "hired" && (
                <div
                  style={{
                    padding: "8px 1.4rem",
                    background: "rgba(52,211,153,0.05)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <button
                    className="btn btn-teal btn-sm btn-full"
                    onClick={() => setSubmitApp(app)}
                  >
                    📤 Submit Completed Work
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <SubmitWorkModal
        app={submitApp}
        open={!!submitApp}
        onClose={() => setSubmitApp(null)}
      />
    </>
  );
}

export default ApplicationPanel;