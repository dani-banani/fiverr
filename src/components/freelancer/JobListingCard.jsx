import { useJobsContext } from "../../context/JobContext";

function JobListingCard({ job }) {
  const { applyToJob, applications } = useJobsContext();

  const alreadyApplied = applications.some((a) => a.jobId === job.id);

  const handleApply = () => {
    if (alreadyApplied || job.status !== "hiring") return;
    applyToJob(job);
  };

  return (
    <div
      className="job-listing-card"
      style={{ opacity: alreadyApplied ? 0.75 : 1 }}
    >
      <div className="jl-head">
        <div>
          <div className="jl-company">
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--green)",
                display: "inline-block",
              }}
            />
            {job.company} · Verified Client
          </div>
          <div className="job-title">{job.title}</div>
        </div>

        <div className="jl-pay">
          <div className="amount">${job.amount?.toLocaleString()}</div>
          <div className="locked-badge">🔒 Escrow Locked</div>
        </div>
      </div>

      <div className="jl-desc">
        {job.description ??
          "Looking for an experienced freelancer. Payment is secured in escrow — guaranteed payout on approval."}
      </div>

      <div className="job-tags">
        {job.tags?.map((tag, i) => (
          <span key={i} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="jl-foot">
        <div className="jl-details">
          <div className="jl-detail">
            <span className="detail-icon">📅</span>
            {job.daysLeft ?? "—"} days
          </div>
          <div className="jl-detail">
            <span className="detail-icon">👥</span>
            {alreadyApplied ? "Applied" : "Open"}
          </div>
          <div className="jl-detail">
            <span className="detail-icon">⏰</span>
            {job.postedAgo ?? "Recently"}
          </div>
        </div>

<button
  className={`btn btn-sm ${alreadyApplied ? "btn-danger" : "btn-primary apply-btn"}`}
  disabled={alreadyApplied || job.status !== "hiring"}
  onClick={handleApply}
  style={
    alreadyApplied
      ? { cursor: "not-allowed", opacity: 0.8 }
      : undefined
  }
>
  {alreadyApplied ? "✗ Applied" : "Apply Now"}
</button>
      </div>
    </div>
  );
}

export default JobListingCard;