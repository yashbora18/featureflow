import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

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

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, isOpen]);

  const isFlagsActive =
    location.pathname === "/flags" ||
    location.pathname.startsWith("/flag/");

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const sidebarContent = (
    <aside
      className={`sidebar ${isOpen ? "open" : ""}`}
      aria-hidden={isMobile ? !isOpen : false}
    >
      {isMobile && (
        <button
          type="button"
          className="sidebar-close-btn"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        >
          <FiX size={22} />
        </button>
      )}

      {/* BRAND */}
      <div className="sidebar-brand">
        <div className="logo-circle">
          <FaRocket />
        </div>

        <div className="logo-text">
          <h2>FeatureFlow</h2>
          <span>Feature Management Platform</span>
        </div>
      </div>

      {/* MENU */}
      <nav className="sidebar-menu">
        <NavLink
          to="/dashboard"
          onClick={closeSidebar}
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FiHome className="menu-icon" />
          <span>{t("sidebar.dashboard")}</span>
        </NavLink>

        <NavLink
          to="/analytics"
          onClick={closeSidebar}
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FiBarChart2 className="menu-icon" />
          <span>{t("sidebar.analytics")}</span>
        </NavLink>

        <NavLink
          to="/flags"
          onClick={closeSidebar}
          className={
            isFlagsActive ? "menu-item active" : "menu-item"
          }
        >
          <FiFlag className="menu-icon" />
          <span>{t("sidebar.flags")}</span>
        </NavLink>

        <NavLink
          to="/environments"
          onClick={closeSidebar}
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FiDatabase className="menu-icon" />
          <span>{t("sidebar.environments")}</span>
        </NavLink>

        <NavLink
          to="/team"
          onClick={closeSidebar}
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FiUsers className="menu-icon" />
          <span>{t("sidebar.team")}</span>
        </NavLink>

        <NavLink
          to="/audit-logs"
          onClick={closeSidebar}
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FiFileText className="menu-icon" />
          <span>{t("sidebar.auditLogs")}</span>
        </NavLink>

        <NavLink
          to="/settings"
          onClick={closeSidebar}
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FiSettings className="menu-icon" />
          <span>{t("sidebar.settings")}</span>
        </NavLink>
      </nav>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <div className="status-online">
          <span className="status-dot" />
          <span>{t("sidebar.systemOnline")}</span>
        </div>

        <div className="system-status">
          <div className="status-row">
            <span>{t("sidebar.api")}</span>
            <strong>{t("sidebar.healthy")}</strong>
          </div>

          <div className="status-row">
            <span>{t("sidebar.database")}</span>
            <strong>{t("sidebar.connected")}</strong>
          </div>

          <div className="status-row">
            <span>{t("sidebar.redis")}</span>
            <strong>{t("sidebar.running")}</strong>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-version">
          {t("sidebar.version")} 1.0.0
        </div>

        <div className="footer-copy">
          {t("sidebar.copyright")}
        </div>
      </div>
    </aside>
  );

  /* DESKTOP */
  if (!isMobile) {
    return sidebarContent;
  }

  /* MOBILE */
  return createPortal(
    <div className="mobile-sidebar-layer">
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {sidebarContent}
    </div>,
    document.body
  );
}

export default Sidebar;
