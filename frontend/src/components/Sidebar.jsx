import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";

import { FaRocket } from "react-icons/fa";

import {
  FiHome,
  FiFlag,
  FiDatabase,
  FiFileText,
  FiSettings,
  FiBarChart2,
  FiUsers,
  FiX,
} from "react-icons/fi";

import "./Sidebar.css";


function Sidebar({ isOpen, setIsOpen }) {

  const { t } = useTranslation();

  const location = useLocation();


  /* =====================================================
     FLAGS ACTIVE STATE
  ===================================================== */

  const isFlagsActive =
    location.pathname === "/flags" ||
    location.pathname.startsWith("/flag/");


  /* =====================================================
     CLOSE SIDEBAR
  ===================================================== */

  const closeSidebar = () => {

    setIsOpen(false);

  };


  /* =====================================================
     SIDEBAR CONTENT
  ===================================================== */

  const sidebarContent = (

    <aside
      className={
        isOpen
          ? "sidebar open"
          : "sidebar"
      }
    >


      {/* =================================================
          MOBILE CLOSE BUTTON
      ================================================= */}

      <button
        type="button"
        className="sidebar-close-btn"
        onClick={closeSidebar}
        aria-label="Close sidebar"
      >

        <FiX size={22} />

      </button>


      {/* =================================================
          BRAND
      ================================================= */}

      <div className="sidebar-brand">

        <div className="logo-circle">

          <FaRocket />

        </div>


        <div className="logo-text">

          <h2>
            FeatureFlow
          </h2>

          <span>
            Feature Management Platform
          </span>

        </div>

      </div>


      {/* =================================================
          NAVIGATION
      ================================================= */}

      <nav className="sidebar-menu">


        {/* DASHBOARD */}

        <NavLink
          to="/dashboard"
          onClick={closeSidebar}
          className={({ isActive }) =>
            isActive
              ? "menu-item active"
              : "menu-item"
          }
        >

          <FiHome className="menu-icon" />

          <span>
            {t("sidebar.dashboard")}
          </span>

        </NavLink>


        {/* ANALYTICS */}

        <NavLink
          to="/analytics"
          onClick={closeSidebar}
          className={({ isActive }) =>
            isActive
              ? "menu-item active"
              : "menu-item"
          }
        >

          <FiBarChart2 className="menu-icon" />

          <span>
            {t("sidebar.analytics")}
          </span>

        </NavLink>


        {/* FLAGS */}

        <NavLink
          to="/flags"
          onClick={closeSidebar}
          className={
            isFlagsActive
              ? "menu-item active"
              : "menu-item"
          }
        >

          <FiFlag className="menu-icon" />

          <span>
            {t("sidebar.flags")}
          </span>

        </NavLink>


        {/* ENVIRONMENTS */}

        <NavLink
          to="/environments"
          onClick={closeSidebar}
          className={({ isActive }) =>
            isActive
              ? "menu-item active"
              : "menu-item"
          }
        >

          <FiDatabase className="menu-icon" />

          <span>
            {t("sidebar.environments")}
          </span>

        </NavLink>


        {/* TEAM */}

        <NavLink
          to="/team"
          onClick={closeSidebar}
          className={({ isActive }) =>
            isActive
              ? "menu-item active"
              : "menu-item"
          }
        >

          <FiUsers className="menu-icon" />

          <span>
            {t("sidebar.team")}
          </span>

        </NavLink>


        {/* AUDIT LOGS */}

        <NavLink
          to="/audit-logs"
          onClick={closeSidebar}
          className={({ isActive }) =>
            isActive
              ? "menu-item active"
              : "menu-item"
          }
        >

          <FiFileText className="menu-icon" />

          <span>
            {t("sidebar.auditLogs")}
          </span>

        </NavLink>


        {/* SETTINGS */}

        <NavLink
          to="/settings"
          onClick={closeSidebar}
          className={({ isActive }) =>
            isActive
              ? "menu-item active"
              : "menu-item"
          }
        >

          <FiSettings className="menu-icon" />

          <span>
            {t("sidebar.settings")}
          </span>

        </NavLink>


      </nav>


      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="sidebar-footer">


        <div className="status-online">

          <span className="status-dot"></span>

          <span>
            {t("sidebar.systemOnline")}
          </span>

        </div>


        <div className="system-status">


          <div className="status-row">

            <span>
              {t("sidebar.api")}
            </span>

            <strong>
              {t("sidebar.healthy")}
            </strong>

          </div>


          <div className="status-row">

            <span>
              {t("sidebar.database")}
            </span>

            <strong>
              {t("sidebar.connected")}
            </strong>

          </div>


          <div className="status-row">

            <span>
              {t("sidebar.redis")}
            </span>

            <strong>
              {t("sidebar.running")}
            </strong>

          </div>


        </div>


        <div className="footer-divider"></div>


        <div className="footer-version">

          {t("sidebar.version")} 1.0.0

        </div>


        <div className="footer-copy">

          {t("sidebar.copyright")}

        </div>


      </div>


    </aside>

  );


  /* =====================================================
     DESKTOP
  ===================================================== */

  if (window.innerWidth > 768) {

    return sidebarContent;

  }


  /* =====================================================
     MOBILE PORTAL
  ===================================================== */

  return createPortal(

    <>

      {isOpen && (

        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />

      )}

      {sidebarContent}

    </>,

    document.body

  );

}


export default Sidebar;