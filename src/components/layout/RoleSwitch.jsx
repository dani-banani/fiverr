import { useRole } from "../../context/RoleContext";

function RoleSwitch() {
  const { role, setRole } = useRole();

  return (
    <div className="nav-center">
      <button
        className={`role-btn ${role === "client" ? "active" : ""}`}
        onClick={() => setRole("client")}
      >
        Client
      </button>

      <button
        className={`role-btn ${role === "freelancer" ? "active" : ""}`}
        onClick={() => setRole("freelancer")}
      >
        Freelancer
      </button>
    </div>
  );
}

export default RoleSwitch;