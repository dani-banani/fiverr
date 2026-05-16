import RoleSwitch from "./RoleSwitch";

function Navbar() {
  return (
    <nav>
      <div className="logo">ChainWork</div>

      <RoleSwitch />

      <div className="nav-user">
        <span>Sean</span>
        <div className="avatar">SD</div>
      </div>
    </nav>
  );
}

export default Navbar;