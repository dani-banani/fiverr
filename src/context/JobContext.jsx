import { createContext, useContext, useState, useEffect } from "react";
import {
    dbFetchMarketplaceJobs,
    dbFetchClientJobs,
    dbPostJob,
    dbAcceptJob,
    dbSubmitWork,
    dbResolveJob,
    dbQuery,                // ← add this
  } from "../../api/supabase_helpers";

const JobContext = createContext();

// Map Supabase status strings to UI status strings
function mapStatus(dbStatus) {
  switch (dbStatus) {
    case "OPEN":        return "hiring";
    case "IN_PROGRESS": return "active";
    case "SUBMITTED":   return "review";
    case "RESOLVED":    return "done";
    default:            return "hiring";
  }
}

function mapJobToUI(job) {
  const created   = new Date(job.created_at);
  const due       = job.due_date ? new Date(job.due_date) : null;
  const now       = new Date();
  const daysLeft  = due ? Math.max(0, Math.ceil((due - now) / 86400000)) : 0;
  const postedAgo = Math.floor((now - created) / 3600000) < 24
    ? `${Math.floor((now - created) / 3600000)}h ago`
    : `${Math.floor((now - created) / 86400000)}d ago`;

  return {
    id:                   job.id,
    title:                job.title,
    company:              job.client_id ?? "Unknown",
    meta:                 `Posted ${postedAgo} · ${daysLeft > 0 ? `Ends in ${daysLeft} days` : "Ended"}`,
    amount:               Number(job.budget),
    budget:               String(job.budget),
    status:               mapStatus(job.status),
    tags:                 job.tags ?? [],
    daysLeft,
    progress:             job.status === "OPEN" ? 0 : job.status === "IN_PROGRESS" ? 40 : job.status === "SUBMITTED" ? 70 : 100,
    applicantInitials:    job.freelancer_id ? [job.freelancer_id.slice(2, 4).toUpperCase()] : [],
    description:          job.description ?? "",
    postedAgo,
    freelancerId:         job.freelancer_id ?? null,
    deliveryNotes:        job.delivery_notes ?? "",
    submissionTitle:      job.title,
    submissionDesc:       job.delivery_notes ?? "",
    submissionFile:       job.chat_logs ?? "",
    submissionDate:       job.updated_at ? new Date(job.updated_at).toLocaleDateString() : "",
  };
}

export function JobProvider({ children }) {
  const [jobs, setJobs]               = useState([]);
  const [applications, setApps]       = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Hardcoded demo addresses for the prototype
  const CLIENT_ADDRESS     = "0xClientDemoAddress";
  const FREELANCER_ADDRESS = "0xFreelancerDemoAddress";

  // Load all jobs on mount
  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoadingJobs(true);
    try {
      console.log("🔄 Fetching jobs...");
  
      const clientJobs = await dbFetchClientJobs(CLIENT_ADDRESS);
      console.log("✅ Client jobs:", clientJobs);
  
      const marketJobs = await dbFetchMarketplaceJobs();
      console.log("✅ Market jobs:", marketJobs);
  
      const merged = Object.values(
        [...clientJobs, ...marketJobs].reduce((acc, j) => {
          acc[j.id] = j;
          return acc;
        }, {})
      );
      console.log("✅ Merged jobs:", merged);
  
      const uiJobs = merged.map(mapJobToUI);
      console.log("✅ UI jobs:", uiJobs);
      setJobs(uiJobs);
  
      const activeApps = merged
        .filter((j) => j.freelancer_id)
        .map((j) => ({
          id:         j.id,
          jobId:      j.id,
          title:      j.title,
          company:    j.client_id,
          amount:     Number(j.budget),
          status:     mapStatus(j.status) === "active"  ? "hired"
                    : mapStatus(j.status) === "review"  ? "submitted"
                    : mapStatus(j.status) === "done"    ? "paid"
                    : "hired",
          daysLeft:   Math.max(0, Math.ceil((new Date(j.due_date) - new Date()) / 86400000)),
          deadline:   j.due_date ? new Date(j.due_date).toLocaleDateString() : "—",
          fundedDate: new Date(j.created_at).toLocaleDateString(),
          hiredDate:  new Date(j.updated_at).toLocaleDateString(),
        }));
  
      console.log("✅ Applications:", activeApps);
      setApps(activeApps);
  
    } catch (err) {
      console.error("❌ loadJobs failed:", err.message, err);
    } finally {
      setLoadingJobs(false);
    }
  }

  // POST JOB — client posts, inserts into Supabase
  const addJob = async ({ title, description, budget, timeline, tags }) => {
    try {
      const dbJob = await dbPostJob(
        title,
        description,
        Number(budget),
        Number(timeline),
        CLIENT_ADDRESS
      );
      if (!dbJob) throw new Error("No data returned from insert");
      const uiJob = mapJobToUI({ ...dbJob, tags: tags ?? [] });
      setJobs((prev) => [uiJob, ...prev]);
    } catch (err) {
      console.error("Failed to post job:", err.message);
    }
  };

  // APPLY — freelancer applies, job becomes IN_PROGRESS
  const applyToJob = async (job) => {
    try {
      const updated = await dbAcceptJob(job.id, FREELANCER_ADDRESS);
      const uiJob   = mapJobToUI({ ...updated, tags: job.tags });

      setJobs((prev) => prev.map((j) => (j.id === job.id ? uiJob : j)));
      setApps((prev) => [
        {
          id:         job.id,
          jobId:      job.id,
          title:      job.title,
          company:    job.company,
          amount:     job.amount,
          status:     "hired",
          daysLeft:   job.daysLeft,
          deadline:   new Date(Date.now() + job.daysLeft * 86400000).toLocaleDateString(),
          fundedDate: new Date().toLocaleDateString(),
          hiredDate:  new Date().toLocaleDateString(),
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("Failed to apply to job:", err);
    }
  };

  // SUBMIT WORK — freelancer submits, job becomes SUBMITTED
  const submitWork = async (appId, deliveryNotes, deliveryUrl) => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return;
    try {
      const updated = await dbSubmitWork(app.jobId, deliveryNotes ?? "", deliveryUrl ?? "");
      const original = jobs.find((j) => j.id === app.jobId);
  
      // Manually patch the returned job with submission data
      // since Supabase may not return delivery_notes/chat_logs immediately
      const patched = {
        ...updated,
        tags:          original?.tags ?? [],
        delivery_notes: deliveryNotes,
        chat_logs:      deliveryUrl,
      };
  
      const uiJob = mapJobToUI(patched);
      setJobs((prev) => prev.map((j) => (j.id === app.jobId ? uiJob : j)));
      setApps((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: "submitted" } : a))
      );
    } catch (err) {
      console.error("Failed to submit work:", err.message);
    }
  };

  // APPROVE — client approves, job becomes RESOLVED
  const approveJob = async (id) => {
    try {
      const updated = await dbResolveJob(id);
      const original = jobs.find((j) => j.id === id);
      const uiJob = mapJobToUI({ ...updated, tags: original?.tags ?? [] });

      setJobs((prev) => prev.map((j) => (j.id === id ? uiJob : j)));
      setApps((prev) =>
        prev.map((a) => (a.jobId === id ? { ...a, status: "paid" } : a))
      );
    } catch (err) {
      console.error("Failed to approve job:", err);
    }
  };

  // REQUEST REDO — stays in UI only for now (no dedicated DB column)
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

  // REJECT — revert job to OPEN so new freelancers can apply
  const rejectJob = async (id) => {
    try {
      await dbQuery('jobs', {
        update: { status: 'OPEN', freelancer_id: null },
        eq: { id }
      });
      setJobs((prev) =>
        prev.map((j) =>
          j.id === id
            ? { ...j, status: "hiring", progress: 0, applicantInitials: [] }
            : j
        )
      );
      setApps((prev) => prev.filter((a) => a.jobId !== id));
    } catch (err) {
      console.error("Failed to reject job:", err);
    }
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        applications,
        loadingJobs,
        addJob,
        applyToJob,
        submitWork,
        approveJob,
        requestRedo,
        rejectJob,
        reloadJobs: loadJobs,
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export function useJobsContext() {
  return useContext(JobContext);
}