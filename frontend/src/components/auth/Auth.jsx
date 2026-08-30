import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { languages } from "../../i18n/languages";

import {
  HiArrowLeft,
  HiMoon,
  HiSun,
} from "react-icons/hi2";

import "./Auth.css";

import LoginLeft from "./LoginLeft";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const languageOptions = languages.map((lang) => ({
    value: lang.code,
    label: lang.name,
  }));

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );

    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );

    document.documentElement.classList.toggle(
      "dark-theme",
      darkMode
    );
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <main
      className={`auth-page ${
        darkMode ? "dark" : ""
      }`}
    >
      <div className="auth-container">

        {/* TOP CONTROLS */}

        <div className="auth-top-controls">

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/")}
          >
            <HiArrowLeft />
            <span>Back</span>
          </button>

          <button
            type="button"
            className="theme-btn"
            onClick={toggleTheme}
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

          <select
            className="language-btn"
            value={i18n.language}
            onChange={(e) => {
              const selectedLanguage = e.target.value;

              i18n.changeLanguage(
                selectedLanguage
              );

              localStorage.setItem(
                "language",
                selectedLanguage
              );
            }}
          >
            {languageOptions.map((lang) => (
              <option
                key={lang.value}
                value={lang.value}
              >
                {lang.label}
              </option>
            ))}
          </select>

        </div>

        {/* LEFT SIDE */}

        <section className="auth-left">
          <LoginLeft />
        </section>

        {/* RIGHT SIDE */}

        <section className="auth-right">

          <div className="auth-card">

            <div
              className={`form-wrapper ${
                isSignup
                  ? "signup-active"
                  : ""
              }`}
            >

              {/* LOGIN */}

              <div className="form-slide">
                <LoginForm
                  onSignup={() =>
                    setIsSignup(true)
                  }
                />
              </div>

              {/* SIGNUP */}

              <div className="form-slide">
                <SignupForm
                  onLogin={() =>
                    setIsSignup(false)
                  }
                />
              </div>

            </div>

          </div>

          <footer className="auth-footer">
            © 2026 FeatureFlow

            <span>Privacy</span>
            <span>Terms</span>
          </footer>

        </section>

      </div>
    </main>
  );
}