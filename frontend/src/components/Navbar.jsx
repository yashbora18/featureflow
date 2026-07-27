import { useEffect, useState } from "react";
import "./Navbar.css";
import Select from "react-select";
import {
  FiFlag,
  FiBell,
  FiUser,
  FiChevronDown,
  FiMoon,
  FiSun,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

import {
  FaRocket,
  FaCheckCircle,
  FaChartLine,
} from "react-icons/fa";
import { getEnvironments } from "../services/environmentService";

function Navbar({
  environment,
  setEnvironment,
  darkMode,
  setDarkMode,
}) {
  const [options, setOptions] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    loadEnvironments();
  }, []);

  const loadEnvironments = async () => {
    try {
      const data = await getEnvironments();

      const envOptions = data
  .filter(
  (env) => env.name.trim().toLowerCase() !== "testing"
)
  .map((env) => {
        let icon = "🟢";

        if (env.name === "Staging") {
          icon = "🟡";
        } else if (env.name === "Production") {
          icon = "🔴";
        }

        return {
          value: env.name,
          label: `${icon} ${env.name}`,
        };
      });

      setOptions(envOptions);
    } catch (error) {
      console.error("Failed to load environments:", error);
    }
  };

  const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: darkMode ? "#1e293b" : "#ffffff",
    borderColor: darkMode ? "#475569" : "#dbeafe",
    borderRadius: "12px",
    minHeight: "46px",
    boxShadow: "none",
    cursor: "pointer",

    "&:hover": {
      borderColor: "#2563eb",
    },
  }),

  menu: (provided) => ({
    ...provided,
    backgroundColor: darkMode ? "#1e293b" : "#ffffff",
    borderRadius: "12px",
    overflow: "hidden",
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? "#2563eb"
      : darkMode
      ? "#1e293b"
      : "#ffffff",

    color: state.isFocused
      ? "#ffffff"
      : darkMode
      ? "#f8fafc"
      : "#1e293b",

    cursor: "pointer",
  }),

  singleValue: (provided) => ({
    ...provided,
    color: darkMode ? "#f8fafc" : "#1e293b",
  }),

  placeholder: (provided) => ({
    ...provided,
    color: darkMode ? "#cbd5e1" : "#64748b",
  }),

  input: (provided) => ({
    ...provided,
    color: darkMode ? "#f8fafc" : "#1e293b",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#2563eb",
  }),
};

  return (
    <div className="navbar">
      <div className="navbar-title">
        <FiFlag className="navbar-icon" />
        <span>Feature Flag Dashboard</span>
      </div>

      <div className="navbar-actions">

  {/* Environment */}
  <div className="navbar-environment">
    <span className="env-label">
      Environment
    </span>

    <Select
      options={options}
      value={options.find(
        (option) => option.value === environment
      )}
      onChange={(selectedOption) =>
        setEnvironment(selectedOption.value)
      }
      styles={customStyles}
      isSearchable={false}
    />
  </div>

  <div
  className="theme-toggle"
  onClick={() => setDarkMode(!darkMode)}
  title="Toggle Theme"
>
  {darkMode ? (
    <FiSun size={20} />
  ) : (
    <FiMoon size={20} />
  )}
</div>

  {/* Notifications */}
  <div className="notification-wrapper">

    <div
      className="notification-btn"
      title="Notifications"
      onClick={() =>
        setShowNotifications(!showNotifications)
      }
    >
      <FiBell size={20} />
      <span className="notification-badge"></span>
    </div>

    {showNotifications && (
      <div className="notification-dropdown">

        <h4>Notifications</h4>

        <div className="notification-item">
    <FaRocket className="notification-icon blue" />
    <span>New feature flag created</span>
</div>

        <div className="notification-item">
    <FaCheckCircle className="notification-icon green" />
    <span>Production environment selected</span>
</div>

        <div className="notification-item">
    <FaChartLine className="notification-icon orange" />
    <span>Rollout updated to 50%</span>
</div>

      </div>
    )}

  </div>

  {/* Profile */}
  <div className="profile-wrapper">

    <div
      className="profile-card"
      onClick={() =>
        setShowProfileMenu(!showProfileMenu)
      }
    >
      <div className="profile-avatar">
        <FiUser size={18} />
      </div>

      <div className="profile-info">
        <span className="profile-name">
          Admin
        </span>

        <span className="profile-role">
          Feature Manager
        </span>
      </div>

      <FiChevronDown size={16} />
    </div>

    {showProfileMenu && (
      <div className="profile-dropdown">

        <div className="profile-item">
    <FiUser className="profile-icon" />
    <span>Profile</span>
</div>

<div className="profile-item">
    <FiSettings className="profile-icon" />
    <span>Settings</span>
</div>

<div className="profile-item logout">
    <FiLogOut className="profile-icon" />
    <span>Logout</span>
</div>

      </div>
    )}

  </div>
</div>
    </div>
  );
}

export default Navbar;