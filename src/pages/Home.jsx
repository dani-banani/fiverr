import Navbar from "../components/layout/Navbar";
import ClientDashboard from "../components/client/ClientDashboard";
import FreelancerDashboard from "../components/freelancer/FreelancerDashboard";

import { useRole } from "../context/RoleContext";

function Home() {
  const { role } = useRole();

  return (
    <>
      <Navbar />

      <main className="page">
        {role === "client" ? (
          <ClientDashboard />
        ) : (
          <FreelancerDashboard />
        )}
      </main>
    </>
  );
}

export default Home;