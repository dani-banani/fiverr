import { useEffect, useState } from "react";

function EscrowPanel({ job }) {
  const [timeDisplay, setTimeDisplay] = useState("");

  useEffect(() => {
    if (!job) return;

    let totalSecs = (job.daysLeft ?? 0) * 86400 + Math.floor(Math.random() * 86400);

    function update() {
      const d = Math.floor(totalSecs / 86400);
      const h = Math.floor((totalSecs % 86400) / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      setTimeDisplay(
        (d > 0 ? d + "d " : "") +
          String(h).padStart(2, "0") +
          "h " +
          String(m).padStart(2, "0") +
          "m"
      );
      if (totalSecs > 0) totalSecs--;
    }

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [job?.id]);

  if (!job) return null;

  const statusBadgeClass =
    job.status === "done"
      ? "badge-completed"
      : job.status === "review"
      ? "badge-review"
      : "badge-locked";

  const statusBadgeLabel =
    job.status === "done"
      ? "Released"
      : job.status === "review"
      ? "Under Review"
      : "Blockchain Locked";

  return (
    <div className="panel" style={{ marginBottom: "16px" }}>
      <div className="panel-head">
        <h3>⬡ Escrow Status</h3>
        <span className={`badge ${statusBadgeClass}`}>{statusBadgeLabel}</span>
      </div>

      <div className="panel-body">
        {/* Amount */}
        <div className="escrow-amount">
          <div className="label">Locked Amount</div>
          <div className="value">${job.amount?.toLocaleString() ?? "0"}.00</div>
          <div className="sub">{job.title}</div>
        </div>

        {/* Chain visual */}
        <div className="chain-visual">
          <div className="chain-block">0x4f2a...</div>
          <span className="chain-arrow">→</span>
          <div className="chain-block" style={{ color: "var(--green)" }}>
            LOCK
          </div>
          <span className="chain-arrow">→</span>
          <div className="chain-block">0x8e1c...</div>
        </div>

        {/* Countdown */}
        <div className="timer-display">
          <div className="timer-val">{timeDisplay || "—"}</div>
          <div className="timer-label">
            {job.status === "review"
              ? "3-day review window remaining"
              : "Auto-release countdown"}
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-wrap">
          <div className="progress-bg">
            <div
              className="progress-fill"
              style={{ width: `${job.progress ?? 0}%` }}
            />
          </div>
          <div className="progress-label">
            <span>Job started</span>
            <span>Auto-release</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EscrowPanel;