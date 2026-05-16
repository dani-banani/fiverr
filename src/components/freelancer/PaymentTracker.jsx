import { useEffect, useState } from "react";

function PaymentTracker({ app }) {
  const [timeDisplay, setTimeDisplay] = useState("");

  useEffect(() => {
    if (!app) return;

    const isReview = app.status === "submitted";
    let totalSecs = isReview
      ? 3 * 86400
      : (app.daysLeft ?? 0) * 86400;

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
  }, [app?.id, app?.status]);

  if (!app) return null;

  const steps = [
    {
      label: "Client funded escrow",
      sub: `${app.fundedDate ?? "—"} · $${app.amount?.toLocaleString()} locked on-chain`,
      state: "done",
    },
    {
      label:
        app.status === "submitted" || app.status === "paid"
          ? "Work submitted for review"
          : "In progress — submit when done",
      sub:
        app.status === "submitted" || app.status === "paid"
          ? "Awaiting client review"
          : `Deliver before ${app.deadline ?? "—"}`,
      state:
        app.status === "paid"
          ? "done"
          : app.status === "submitted"
          ? "done"
          : app.status === "hired" || app.status === "revision"
          ? "active"
          : "pending",
    },
    {
      label: "Client review",
      sub: "Approve, request revision, or reject · 3-day window",
      state:
        app.status === "paid"
          ? "done"
          : app.status === "submitted"
          ? "active"
          : "pending",
    },
    {
      label: "Payment released to your wallet",
      sub: "Automatic on approval",
      state: app.status === "paid" ? "done" : "pending",
    },
  ];

  const dotClass = {
    done:    "t-done",
    active:  "t-active",
    pending: "t-pending",
    warn:    "t-warn",
  };

  const dotIcon = { done: "✓", active: "⚡", pending: null, warn: "!" };

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>💰 Payment Tracker</h3>
      </div>

      <div className="panel-body">
        {/* Escrow balance */}
        <div className="escrow-amount">
          <div className="label">Escrow Balance (You)</div>
          <div className="value" style={{ fontSize: "1.8rem" }}>
            ${app.amount?.toLocaleString()}.00
          </div>
          <div className="sub">
            {app.title} ·{" "}
            {app.status === "submitted"
              ? "Awaiting client review"
              : app.status === "paid"
              ? "Payment released"
              : "In Progress"}
          </div>
        </div>

        {/* Countdown */}
        <div className="timer-display">
          <div className="timer-val">{timeDisplay || "—"}</div>
          <div className="timer-label">
            {app.status === "submitted"
              ? "Client review window — 3 days"
              : `Deliver before ${app.deadline ?? "—"}`}
          </div>
        </div>

        {/* Timeline */}
        <div className="escrow-timeline">
          {steps.map((step, i) => (
            <div key={i} className="timeline-step">
              <div className={`timeline-dot ${dotClass[step.state]}`}>
                {dotIcon[step.state] ?? i + 1}
              </div>
              <div className="timeline-info">
                <div className="tl">{step.label}</div>
                <div className="ts">{step.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PaymentTracker;