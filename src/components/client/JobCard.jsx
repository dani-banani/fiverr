function JobCard({ job, selected, onClick }) {
    const badgeClass = {
      hiring:    "badge-pending",
      active:    "badge-active",
      review:    "badge-review",
      done:      "badge-completed",
      locked:    "badge-locked",
    }[job.status] ?? "badge-pending";
  
    const badgeLabel = {
      hiring:  "Hiring",
      active:  "Active",
      review:  "Review",
      done:    "Done",
      locked:  "Locked",
    }[job.status] ?? job.status;
  
    const applicantColor = {
      hiring: "var(--amber)",
      active: "var(--green)",
      review: "var(--red)",
      done:   "var(--teal)",
    }[job.status] ?? "var(--muted)";
  
    const applicantLabel = {
      hiring: "Waiting for applicant",
      active: "Work in progress",
      review: "Work submitted — review required",
      done:   "Payment released",
    }[job.status] ?? "";
  
    return (
      <div
        className={`job-card${selected ? " selected" : ""}`}
        onClick={onClick}
      >
        <div className="job-card-top">
          <div>
            <div className="job-title">{job.title}</div>
            <div className="job-meta">{job.meta ?? job.company}</div>
          </div>
  
          <div style={{ textAlign: "right" }}>
            <div className="job-pay">
              ${job.amount?.toLocaleString() ?? job.budget}
              <small>
                {job.status === "done" ? "✅ Released" : "🔒 Escrow locked"}
              </small>
            </div>
            <div style={{ marginTop: "6px" }}>
              <span className={`badge ${badgeClass}`}>{badgeLabel}</span>
            </div>
          </div>
        </div>
  
        <div className="job-tags">
          {job.tags?.map((tag, i) => (
            <span key={i} className="tag">
              {tag}
            </span>
          ))}
        </div>
  
        <div className="applicants-bar">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {job.applicantInitials && (
              <div className="mini-avatars">
                {job.applicantInitials.map((ini, i) => (
                  <div key={i} className="mini-avatar">
                    {ini}
                  </div>
                ))}
              </div>
            )}
            <span
              className="applicant-count"
              style={{ color: applicantColor }}
            >
              {applicantLabel}
            </span>
          </div>
          <span className={`badge ${badgeClass}`}>{badgeLabel}</span>
        </div>
      </div>
    );
  }
  
  export default JobCard;