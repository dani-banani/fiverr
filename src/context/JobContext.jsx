import { createContext, useContext, useState } from "react";
import mockJobs from "../data/mockJobs";

const JobContext = createContext();

const mockApplications = [
  {
    id: 1,
    jobId: 4,
    title: "NFT Marketplace Design",
    company: "PixelVault Studios",
    amount: 950,
    status: "hired",
    daysLeft: 8,
    deadline: "May 24",
    fundedDate: "May 12",
    hiredDate: "May 13",
  },
  {
    id: 3,
    jobId: null,
    title: "Token Branding Kit",
    company: "MoonRise Protocol",
    amount: 600,
    status: "paid",
    daysLeft: 0,
    deadline: "—",
    fundedDate: "May 1",
    hiredDate: "May 2",
  },
];

export function JobProvider({ children }) {
  const [jobs, setJobs]         = useState(mockJobs);
  const [applications, setApps] = useState(mockApplications);

  const addJob = (job) => setJobs((prev) => [job, ...prev]);

  // FLOW STEP 1 — freelancer applies → job becomes "active" on client side
  const applyToJob = (job) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === job.id
          ? { ...j, status: "active", progress: 10, applicantInitials: ["SK"] }
          : j
      )
    );
    setApps((prev) => [
      {
        id: Date.now(),
        jobId: job.id,
        title: job.title,
        company: job.company,
        amount: job.amount,
        status: "hired",
        daysLeft: job.daysLeft ?? 14,
        deadline: "May 26",
        fundedDate: "Today",
        hiredDate: "Today",
      },
      ...prev,
    ]);
  };

  // FLOW STEP 2 — freelancer submits → job becomes "review" on client side
  const submitWork = (appId) => {
    setApps((prev) =>
      prev.map((a) => {
        if (a.id !== appId) return a;
        setJobs((pj) =>
          pj.map((j) =>
            j.id === a.jobId
              ? {
                  ...j,
                  status: "review",
                  progress: 60,
                  meta: "Submitted for review",
                  submissionTitle: "Audit Report v1.0",
                  submissionDesc:
                    "Comprehensive ERC-20 security audit covering reentrancy, overflow, and access control. Found 2 medium-severity issues with mitigation steps documented.",
                  submissionFile: "audit-report-erc20.pdf",
                  submissionDate: "Today",
                }
              : j
          )
        );
        return { ...a, status: "submitted" };
      })
    );
  };

  // FLOW STEP 3 — client approves → job becomes "done", app becomes "paid"
  const approveJob = (id) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, status: "done", progress: 100 } : j
      )
    );
    setApps((prev) =>
      prev.map((a) =>
        a.jobId === id ? { ...a, status: "paid" } : a
      )
    );
  };

  const requestRedo = (id, note, days) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, status: "active", daysLeft: Number(days) } : j
      )
    );
    setApps((prev) =>
      prev.map((a) =>
        a.jobId === id ? { ...a, status: "revision", daysLeft: Number(days) } : a
      )
    );
  };

  const rejectJob = (id) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id
          ? { ...j, status: "hiring", progress: 0, applicantInitials: [] }
          : j
      )
    );
    setApps((prev) => prev.filter((a) => a.jobId !== id));
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        applications,
        addJob,
        applyToJob,
        submitWork,
        approveJob,
        requestRedo,
        rejectJob,
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export function useJobsContext() {
  return useContext(JobContext);
}