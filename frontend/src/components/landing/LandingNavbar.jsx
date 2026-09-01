import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  HiBars3,
  HiXMark,
  HiSun,
  HiMoon,
} from "react-icons/hi2";

import LanguageSelector from "../common/LanguageSelector";

import "./LandingNavbar.css";

function LandingNavbar() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  /* =========================================
     SCROLL EFFECT
  ========================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =========================================
     THEME
  ========================================= */

  useEffect(() => {
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );

    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );
  }, [darkMode]);

  /* =========================================
     CLOSE MOBILE MENU
  ========================================= */

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  /* =========================================
     NAVIGATE TO AUTH
  ========================================= */

  const goToAuth = () => {
    setMobileMenu(false);
    navigate("/auth");
  };

  return (
    <nav
      className={`landing-navbar ${
        scrolled ? "scrolled" : ""
      }`}
    >

      {/* =========================================
          LOGO
      ========================================= */}

      <div
        className="logo"
        onClick={() => {
          closeMobileMenu();

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        <div className="logo-box">
          <img
            src="/logo.png"
            className="logo-image"
            alt="FeatureFlow"
          />
        </div>

        <span>
          FeatureFlow
        </span>
      </div>


      {/* =========================================
          NAV LINKS + MOBILE MENU CONTENT
      ========================================= */}

      <ul
        className={`nav-links ${
          mobileMenu ? "show" : ""
        }`}
      >

        {/* FEATURES */}

        <li>
          <a
            href="#features"
            onClick={closeMobileMenu}
          >
            {t("nav.features")}
          </a>
        </li>


        {/* WORKFLOW */}

        <li>
          <a
            href="#workflow"
            onClick={closeMobileMenu}
          >
            {t("nav.workflow")}
          </a>
        </li>


        {/* TECH STACK */}

        <li>
          <a
            href="#tech"
            onClick={closeMobileMenu}
          >
            {t("nav.techStack")}
          </a>
        </li>


        {/* CONTACT */}

        <li>
          <a
            href="#contact"
            onClick={closeMobileMenu}
          >
            {t("nav.contact")}
          </a>
        </li>


        {/* =========================================
            MOBILE ACTIONS
        ========================================= */}

        <li className="mobile-actions">

          {/* LANGUAGE */}

          <div className="mobile-language">
            <LanguageSelector />
          </div>


          {/* THEME */}

          <button
            type="button"
            className="mobile-theme-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? (
              <HiSun />
            ) : (
              <HiMoon />
            )}

            <span>
              {darkMode
                ? "Light Mode"
                : "Dark Mode"}
            </span>
          </button>


          {/* LOGIN */}

          <button
            type="button"
            className="mobile-login-btn"
            onClick={goToAuth}
          >
            {t("nav.login")}
          </button>


          {/* GET STARTED */}

          <button
            type="button"
            className="mobile-primary-btn"
            onClick={goToAuth}
          >
            {t("nav.getStarted")}
          </button>

        </li>

      </ul>


      {/* =========================================
          DESKTOP ACTIONS
      ========================================= */}

      <div className="nav-actions">

        {/* THEME */}

        <button
          type="button"
          className="theme-switch"
          onClick={() => setDarkMode(!darkMode)}
          aria-label={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >
          {darkMode ? (
            <HiSun />
          ) : (
            <HiMoon />
          )}
        </button>


        {/* LANGUAGE */}

        <LanguageSelector />


        {/* LOGIN */}

        <button
          type="button"
          className="login-btn"
          onClick={() => navigate("/auth")}
        >
          {t("nav.login")}
        </button>


        {/* GET STARTED */}

        <button
          type="button"
          className="primary-btn"
          onClick={() => navigate("/auth")}
        >
          {t("nav.getStarted")}
        </button>

      </div>


      {/* =========================================
          MOBILE MENU BUTTON
      ========================================= */}

      <button
        type="button"
        className="mobile-menu-btn"
        onClick={() =>
          setMobileMenu(!mobileMenu)
        }
        aria-label={
          mobileMenu
            ? "Close menu"
            : "Open menu"
        }
        aria-expanded={mobileMenu}
      >
        {mobileMenu ? (
          <HiXMark />
        ) : (
          <HiBars3 />
        )}
      </button>

    </nav>
  );
}

export default LandingNavbar;