import { useState } from "react";
import { useJobsContext } from "../../context/JobContext";
import JobListingCard from "./JobListingCard";
import ApplicationPanel from "./ApplicationPanel";
import PaymentTracker from "./PaymentTracker";

function FreelancerDashboard() {
  const { jobs, applications } = useJobsContext();
  const [selectedAppId, setSelectedAppId] = useState(
    applications[0]?.id ?? null
  );

  const selectedApp =
    applications.find((a) => a.id === selectedAppId) ??
    applications[0] ??
    null;

  const activeApps   = applications.filter((a) => a.status !== "paid").length;
  const escrowTotal  = applications
    .filter((a) => a.status === "hired" || a.status === "submitted")
    .reduce((sum, a) => sum + (a.amount ?? 0), 0);
  const openJobs     = jobs.filter((j) => j.status === "hiring").length;
  const totalEarned  = applications
    .filter((a) => a.status === "paid")
    .reduce((sum, a) => sum + (a.amount ?? 0), 0);

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="page-title">Find Work</h1>
        <p className="page-sub">
          Browse jobs. Apply directly — funds are already locked in escrow so
          you get paid, guaranteed.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Active Applications</div>
          <div className="stat-val accent">{activeApps}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Earnings in Escrow</div>
          <div className="stat-val teal">${escrowTotal.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Jobs Available</div>
          <div className="stat-val amber">{openJobs}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Earned</div>
          <div className="stat-val green">${totalEarned.toLocaleString()}</div>
        </div>
      </div>

      <div className="two-col">
        {/* Left — job listings */}
        <div>
          <div className="section-head">
            <h2>Open Jobs</h2>
            <select
              className="form-select"
              style={{ 
                width: "auto", 
                padding: "6px 32px 6px 12px", 
                fontSize: "0.8rem",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238b8fa8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
                appearance: "none",
              }}            >
              <option>All Skills </option>
              <option>Design</option>
              <option>Development</option>
              <option>Smart Contracts</option>
            </select>
          </div>

          {/* How it works strip */}
          <div
            style={{
              display: "flex",
              marginBottom: "16px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {["Apply", "Do the Work", "Submit", "Get Paid"].map(
              (step, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRight: i < 4 ? "1px solid var(--border)" : "none",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--muted)",
                      marginBottom: "2px",
                    }}
                  >
                    Step {i + 1}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: i === 4 ? "var(--teal)" : "inherit",
                    }}
                  >
                    {step}
                  </div>
                </div>
              )
            )}
          </div>

          {jobs.map((job) => (
            <JobListingCard key={job.id} job={job} />
          ))}
        </div>

        {/* Right — applications + tracker */}
        <div>
          <ApplicationPanel
            applications={applications}
            selectedAppId={selectedAppId}
            onSelect={setSelectedAppId}
          />
          <PaymentTracker app={selectedApp} />
        </div>
      </div>
    </>
  );
}

export default FreelancerDashboard;