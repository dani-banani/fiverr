import { useJobsContext } from "../context/JobContext";

function useJobs() {
  return useJobsContext();
}

export default useJobs;