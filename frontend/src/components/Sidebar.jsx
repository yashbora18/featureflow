import { Link } from "react-router-dom";
import {
  FiFlag,
  FiDatabase,
  FiFileText,
  FiSettings,
} from "react-icons/fi";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo">
        <h2>Feature Flag System</h2>
      </div>

      <nav className="sidebar-menu">

        <Link to="/" className="menu-item active">
          <FiFlag className="menu-icon" />
          <span>Flags</span>
        </Link>

        <Link to="/environments" className="menu-item">
          <FiDatabase className="menu-icon" />
          <span>Environments</span>
        </Link>

        <Link to="/audit-log" className="menu-item">
          <FiFileText className="menu-icon" />
          <span>Audit Log</span>
        </Link>

        <Link to="/settings" className="menu-item">
          <FiSettings className="menu-icon" />
          <span>Settings</span>
        </Link>

      </nav>

    </aside>
  );
}

export default Sidebar;