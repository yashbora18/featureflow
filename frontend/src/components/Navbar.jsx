import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { languages } from "../i18n/languages";
import "./Navbar.css";
import Select, { components } from "react-select";
import { toast } from "react-toastify";

import {
  FiFlag,
  FiBell,
  FiUser,
  FiChevronDown,
  FiMoon,
  FiSun,
  FiSettings,
  FiLogOut,
  FiGlobe,
  FiMenu,
  FiX,
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
  isOpen,
  setIsOpen,
}) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [options, setOptions] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  /* =====================================================
     LANGUAGE OPTIONS
  ===================================================== */

  const languageOptions = languages.map((lang) => ({
    value: lang.code,
    label: lang.name,
    shortLabel: lang.code.toUpperCase(),
  }));

  /* =====================================================
     LOAD ENVIRONMENTS
  ===================================================== */

  useEffect(() => {
    loadEnvironments();
  }, [i18n.language]);

  /* =====================================================
     LOAD SAVED LANGUAGE
  ===================================================== */

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");

    if (
      savedLanguage &&
      savedLanguage !== i18n.language
    ) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  const loadEnvironments = async () => {
    try {
      const data = await getEnvironments();

      const envOptions = data
        .filter(
          (env) =>
            env.name.trim().toLowerCase() !== "testing"
        )
        .map((env) => {
  const environmentName = env.name.trim().toLowerCase();

  let icon = "🔵";

  if (environmentName === "staging") {
    icon = "🟡";
  } else if (environmentName === "production") {
    icon = "🔴";
  }

          const translatedName =
            env.name === "Development"
              ? t("environment.development")
              : env.name === "Staging"
              ? t("environment.staging")
              : env.name === "Production"
              ? t("environment.production")
              : env.name;

          let shortName = env.name;

          if (env.name === "Development") {
            shortName = "Dev";
          } else if (env.name === "Staging") {
            shortName = "Stage";
          } else if (env.name === "Production") {
            shortName = "Prod";
          }

          return {
            value: env.name,
            label: `${icon} ${translatedName}`,
            shortLabel: `${icon} ${shortName}`,
          };
        });

      setOptions(envOptions);
    } catch (error) {
      console.error(
        "Failed to load environments:",
        error
      );
    }
  };

  /* =====================================================
     MOBILE SIDEBAR
  ===================================================== */

  const toggleSidebar = () => {
    setIsOpen((previousState) => !previousState);
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    setShowProfileMenu(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    setShowProfileMenu(false);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success(
      t("navbar.logoutSuccess")
    );

    setTimeout(() => {
      navigate("/auth", {
        replace: true,
      });
    }, 800);
  };

  /* =====================================================
     DROPDOWN TOGGLES
  ===================================================== */

  const toggleNotifications = () => {
    setShowNotifications(
      (previousState) => !previousState
    );

    setShowProfileMenu(false);
  };

  const toggleProfile = () => {
    setShowProfileMenu(
      (previousState) => !previousState
    );

    setShowNotifications(false);
  };

  /* =====================================================
     CUSTOM SELECT VALUE
  ===================================================== */

  const CustomSingleValue = (props) => {
    const { data } = props;

    return (
      <components.SingleValue {...props}>
        <span className="select-full-label">
          {data.label}
        </span>

        <span className="select-short-label">
          {data.shortLabel}
        </span>
      </components.SingleValue>
    );
  };

  const formatSelectLabel = (option) => {
    return (
      <span className="select-option-label">
        {option.label}
      </span>
    );
  };

  /* =====================================================
     REACT SELECT STYLES
  ===================================================== */

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "100%",
      minWidth: 0,
      margin: 0,
    }),

    control: (provided, state) => ({
      ...provided,

      width: "100%",

      minHeight: "46px",
      height: "46px",

      backgroundColor: darkMode
        ? "#1e293b"
        : "#ffffff",

      borderColor: state.isFocused
        ? "#7c3aed"
        : darkMode
        ? "#475569"
        : "#cbd5e1",

      borderRadius: "12px",

      boxShadow: state.isFocused
        ? "0 0 0 3px rgba(124,58,237,.12)"
        : "none",

      cursor: "pointer",

      transition:
        "border-color .2s ease, box-shadow .2s ease",

      "&:hover": {
        borderColor: "#7c3aed",
      },
    }),

    valueContainer: (provided) => ({
      ...provided,

      minWidth: 0,

      overflow: "hidden",

      paddingLeft: "12px",
      paddingRight: "4px",

      flex: "1 1 auto",
    }),

    singleValue: (provided) => ({
      ...provided,

      color: darkMode
        ? "#f8fafc"
        : "#1e293b",

      minWidth: 0,

      width: "100%",

      overflow: "hidden",

      textOverflow: "ellipsis",

      whiteSpace: "nowrap",

      margin: 0,
    }),

    menu: (provided) => ({
      ...provided,

      backgroundColor: darkMode
        ? "#1e293b"
        : "#ffffff",

      borderRadius: "12px",

      overflow: "hidden",

      zIndex: 10000,

      marginTop: "6px",
    }),

    menuPortal: (provided) => ({
      ...provided,

      zIndex: 100000,
    }),

    option: (provided, state) => ({
      ...provided,

      backgroundColor: state.isFocused
        ? "#7c3aed"
        : darkMode
        ? "#1e293b"
        : "#ffffff",

      color: state.isFocused
        ? "#ffffff"
        : darkMode
        ? "#f8fafc"
        : "#1e293b",

      cursor: "pointer",

      fontSize: "14px",

      fontWeight: 500,

      padding: "11px 12px",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    dropdownIndicator: (provided) => ({
      ...provided,

      color: "#7c3aed",

      paddingLeft: "4px",
      paddingRight: "9px",
    }),
  };
    return (
    <>
      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="navbar">

        {/* =================================================
            TOP ROW
        ================================================= */}

        <div className="navbar-top-row">

          {/* MOBILE MENU */}

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={toggleSidebar}
            aria-label={
              isOpen
                ? "Close sidebar"
                : "Open sidebar"
            }
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <FiX size={22} />
            ) : (
              <FiMenu size={22} />
            )}
          </button>


          {/* TITLE */}

          <div className="navbar-title">
            <FiFlag className="navbar-icon" />

            <span>
              {t("navbar.dashboard")}
            </span>
          </div>

        </div>


        {/* =================================================
            NAVBAR ACTIONS
        ================================================= */}

        <div className="navbar-actions">


          {/* =================================================
              ENVIRONMENT
          ================================================= */}

          <div className="navbar-environment environment-select-wrapper">

            <span className="env-label">
              {t("navbar.environment")}
            </span>

            <div className="select-control-wrapper">

              <Select
                className="navbar-select"
                classNamePrefix="navbar-select"

                options={options}

                value={
                  options.find(
                    (option) =>
                      option.value === environment
                  ) || null
                }

                onChange={(selected) => {
                  if (selected) {
                    setEnvironment(
                      selected.value
                    );
                  }
                }}

                styles={customStyles}

                isSearchable={false}

                components={{
                  SingleValue:
                    CustomSingleValue,
                }}

                formatOptionLabel={
                  formatSelectLabel
                }

                menuPortalTarget={
                  document.body
                }

                menuPosition="fixed"

                aria-label={
                  t("navbar.environment")
                }
              />

            </div>

          </div>


          {/* =================================================
              LANGUAGE
          ================================================= */}

          <div className="navbar-environment language-select-wrapper">

            <span className="env-label language-icon-label">
              <FiGlobe />
            </span>

            <div className="select-control-wrapper">

              <Select
                className="navbar-select"
                classNamePrefix="navbar-select"

                options={languageOptions}

                value={
                  languageOptions.find(
                    (lang) =>
                      lang.value ===
                      i18n.language
                  ) || null
                }

                onChange={(selected) => {
                  if (!selected) return;

                  i18n.changeLanguage(
                    selected.value
                  );

                  localStorage.setItem(
                    "language",
                    selected.value
                  );
                }}

                styles={customStyles}

                isSearchable={false}

                components={{
                  SingleValue:
                    CustomSingleValue,
                }}

                formatOptionLabel={
                  formatSelectLabel
                }

                menuPortalTarget={
                  document.body
                }

                menuPosition="fixed"

                aria-label="Language"
              />

            </div>

          </div>


          {/* =================================================
              THEME
          ================================================= */}

          <button
            type="button"
            className="theme-toggle"

            title={t("navbar.toggleTheme")}

            aria-label={t("navbar.toggleTheme")}

            onClick={() =>
              setDarkMode(
                (previousState) =>
                  !previousState
              )
            }
          >
            {darkMode ? (
              <FiSun size={20} />
            ) : (
              <FiMoon size={20} />
            )}
          </button>


          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div className="notification-wrapper">

            <button
              type="button"
              className="notification-btn"

              title={
                t("navbar.notifications")
              }

              aria-label={
                t("navbar.notifications")
              }

              onClick={
                toggleNotifications
              }
            >

              <FiBell size={20} />

              <span className="notification-badge" />

            </button>


            {showNotifications && (
              <div className="notification-dropdown">

                <h4>
                  {t(
                    "navbar.notifications"
                  )}
                </h4>


                <div className="notification-item">

                  <FaRocket />

                  <span>
                    {t(
                      "navbar.notification1"
                    )}
                  </span>

                </div>


                <div className="notification-item">

                  <FaCheckCircle />

                  <span>
                    {t(
                      "navbar.notification2"
                    )}
                  </span>

                </div>


                <div className="notification-item">

                  <FaChartLine />

                  <span>
                    {t(
                      "navbar.notification3"
                    )}
                  </span>

                </div>

              </div>
            )}

          </div>


          {/* =================================================
              PROFILE
          ================================================= */}

          <div className="profile-wrapper">

            <button
              type="button"
              className="profile-card"

              onClick={
                toggleProfile
              }
            >

              <div className="profile-avatar">
                <FiUser size={18} />
              </div>


              <div className="profile-info">

                <span className="profile-name">
                  {user?.username ||
                    t("navbar.admin")}
                </span>


                <span className="profile-role">
                  {user?.role ===
                  "Feature Manager"
                    ? t(
                        "navbar.featureManager"
                      )
                    : user?.role ===
                      "Admin"
                    ? t(
                        "navbar.admin"
                      )
                    : t(
                        "navbar.featureManager"
                      )}
                </span>

              </div>


              <FiChevronDown size={16} />

            </button>


            {showProfileMenu && (
              <div className="profile-dropdown">

                <div
                  className="profile-item"

                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/profile");
                  }}
                >

                  <FiUser />

                  <span>
                    {t("navbar.profile")}
                  </span>

                </div>


                <div
                  className="profile-item"

                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/settings");
                  }}
                >

                  <FiSettings />

                  <span>
                    {t("navbar.settings")}
                  </span>

                </div>


                <div
                  className="profile-item logout"

                  onClick={
                    handleLogout
                  }
                >

                  <FiLogOut />

                  <span>
                    {t("navbar.logout")}
                  </span>

                </div>

              </div>
            )}

          </div>

        </div>

      </header>


      {/* =================================================
          LOGOUT MODAL
      ================================================= */}

      {showLogoutModal &&
        createPortal(

          <div
            className="logout-modal-overlay"

            onClick={() =>
              setShowLogoutModal(false)
            }
          >

            <div
              className="logout-modal"

              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <h3>
                {t("navbar.logout")}
              </h3>


              <p>
                {t(
                  "navbar.logoutConfirm"
                )}
              </p>


              <div className="logout-modal-actions">

                <button
                  type="button"
                  className="logout-cancel-btn"

                  onClick={() =>
                    setShowLogoutModal(false)
                  }
                >
                  {t("common.cancel")}
                </button>


                <button
                  type="button"
                  className="logout-confirm-btn"

                  onClick={confirmLogout}
                >
                  {t("navbar.logout")}
                </button>

              </div>

            </div>

          </div>,

          document.body
        )}
    </>
  );
}

export default Navbar;

