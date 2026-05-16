import { useState, useEffect } from "react";
import { useJobsContext } from "../../context/JobContext";
import JobCard from "./JobCard";
import EscrowPanel from "./EscrowPanel";
import ReviewPanel from "./ReviewPanel";
import PostJobModal from "./PostJobModal";
import Button from "../shared/Button";

function ClientDashboard() {
  const { jobs } = useJobsContext();
  const [open, setOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(jobs[1]?.id ?? null); // start on Smart Contract Audit

  // Auto-switch right panel when job status changes (e.g. freelancer submits)
  useEffect(() => {
    const reviewJob = jobs.find((j) => j.status === "review");
    if (reviewJob) setSelectedJobId(reviewJob.id);
  }, [jobs]);

  const selectedJob =
    jobs.find((j) => j.id === selectedJobId) ?? jobs[0] ?? null;

  const activeJobs    = jobs.filter((j) => j.status !== "done").length;
  const totalEscrow   = jobs
    .filter((j) => j.status !== "done")
    .reduce((sum, j) => sum + (j.amount ?? 0), 0);
  const pendingReviews = jobs.filter((j) => j.status === "review").length;
  const completed      = jobs.filter((j) => j.status === "done").length;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1 className="page-title">Client Dashboard</h1>
          <p className="page-sub">
            Manage jobs, review submitted work, and release or dispute payments.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>+ Post New Job</Button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Active Jobs</div>
          <div className="stat-val accent">{activeJobs}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Escrow Locked</div>
          <div className="stat-val teal">${totalEscrow.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Awaiting Review</div>
          <div className="stat-val amber">{pendingReviews}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-val green">{completed}</div>
        </div>
      </div>

      <div className="two-col">
        <div>
          <div className="section-head">
            <h2>Your Posted Jobs</h2>
            <span className="badge badge-pending">{activeJobs} Active</span>
          </div>

          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              selected={job.id === selectedJob?.id}
              onClick={() => setSelectedJobId(job.id)}
            />
          ))}
        </div>

        <div>
          <EscrowPanel job={selectedJob} />
          {selectedJob?.status === "review" && (
            <ReviewPanel job={selectedJob} />
          )}
        </div>
      </div>

      <PostJobModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default ClientDashboard;