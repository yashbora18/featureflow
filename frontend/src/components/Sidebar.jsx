import { NavLink, useLocation } from "react-router-dom";
import {
  FiFlag,
  FiDatabase,
  FiFileText,
  FiSettings,
} from "react-icons/fi";
import "./Sidebar.css";

function Sidebar() {

  const location = useLocation();

  const isFlagsActive =
    location.pathname === "/" ||
    location.pathname.startsWith("/flag/");

  return (
    <aside className="sidebar">

      <div className="logo">
        <h2>Feature Flag System</h2>
      </div>

      <nav className="sidebar-menu">

        <NavLink
          to="/"
          className={isFlagsActive ? "menu-item active" : "menu-item"}
        >
          <FiFlag className="menu-icon" />
          <span>Flags</span>
        </NavLink>

        <NavLink
          to="/environments"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FiDatabase className="menu-icon" />
          <span>Environments</span>
        </NavLink>

        <NavLink
          to="/audit-log"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FiFileText className="menu-icon" />
          <span>Audit Log</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FiSettings className="menu-icon" />
          <span>Settings</span>
        </NavLink>

      </nav>

    </aside>
  );
}

export default Sidebar;