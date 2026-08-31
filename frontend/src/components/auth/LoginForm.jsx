import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./AuthForm.css";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

import {
  FaRocket,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

export default function LoginForm({ onSignup }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* =====================================================
     LOGIN FORM
  ===================================================== */

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* =====================================================
     NORMAL LOGIN
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim()) {
      toast.error(
        t("login.messages.enterEmail")
      );
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error(
        t("login.messages.invalidEmail")
      );
      return;
    }

    if (!form.password.trim()) {
      toast.error(
        t("login.messages.passwordRequired")
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        {
          email: form.email,
          password: form.password,
        }
      );

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user
        )
      );

      toast.success(
        t("login.welcome")
      );

      toast.info(
        t("login.messages.redirecting")
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch (error) {
      if (error.response?.status === 401) {

        toast.error(
          t(
            "login.messages.incorrectCredentials"
          )
        );

      } else if (error.response?.status === 500) {

        toast.error(
          t("login.messages.serverError")
        );

      } else if (!error.response) {

        toast.error(
          t("login.messages.connectionError")
        );

      } else {

        toast.error(
          t("login.messages.signInFailed")
        );

      }

    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     GOOGLE LOGIN
  ===================================================== */

  const handleGoogleLogin = async (
    credentialResponse
  ) => {

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/google",
        {
          credential:
            credentialResponse.credential,
        }
      );

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user
        )
      );

      toast.success(
        t("login.welcome")
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch (error) {

      console.error(
        "Google login error:",
        error
      );

      toast.error(
        error.response?.data?.detail ||
        "Google sign-in failed"
      );

    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="auth-form">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="auth-header">

        <div className="auth-logo">

          <div className="logo-icon">
            <FaRocket />
          </div>

          <div className="logo-text">

            <h2>
              FeatureFlow
            </h2>

            <span>
              {t("auth.platform")}
            </span>

          </div>

        </div>

        <h1>
          {t("login.welcome")}
        </h1>

        <p>
          {t("login.description")}
        </p>

      </div>


      {/* =================================================
          LOGIN FORM
      ================================================= */}

      <form onSubmit={handleSubmit}>

        {/* EMAIL */}

        <div className="input-group">

          <label>
            {t("login.email")}
          </label>

          <div className="input-box">

            <FaEnvelope
              className="input-icon"
            />

            <input
              type="email"
              name="email"
              placeholder={
                t(
                  "login.emailPlaceholder"
                )
              }
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />

          </div>

        </div>


        {/* PASSWORD */}

        <div className="input-group">

          <label>
            {t("login.password")}
          </label>

          <div className="input-box">

            <FaLock
              className="input-icon"
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder={
                t(
                  "login.passwordPlaceholder"
                )
              }
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() =>
                setShowPassword(
                  (prev) => !prev
                )
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >

              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}

            </button>

          </div>

        </div>


        {/* LOGIN OPTIONS */}

        <div className="login-options">

          <label className="remember">

            <input
              type="checkbox"
              name="remember"
              checked={
                form.remember
              }
              onChange={handleChange}
            />

            {t("login.remember")}

          </label>

          <button
            type="button"
            className="forgot-btn"
          >
            {t(
              "login.forgotPassword"
            )}
          </button>

        </div>


        {/* LOGIN BUTTON */}

        <button
          type="submit"
          className="login-btn"
          disabled={loading}
        >

          {loading
            ? t("login.signingIn")
            : t("login.signIn")}

        </button>

      </form>


      {/* =================================================
          DIVIDER
      ================================================= */}

      <div className="divider">

        <span>
          {t("login.or")}
        </span>

      </div>


      {/* =================================================
          GOOGLE LOGIN
      ================================================= */}

      <div className="google-login-wrapper">

        <GoogleLogin
          onSuccess={
            handleGoogleLogin
          }

          onError={() => {
            toast.error(
              "Google sign-in failed"
            );
          }}

          text="signin_with"
          logo_alignment="center"
          width="100%"
          theme="outline"
          size="large"
        />

      </div>


      {/* =================================================
          SIGNUP
      ================================================= */}

      <p className="bottom-text">

        {t("login.newTo")}{" "}

        <strong>
          FeatureFlow
        </strong>

        ?{" "}

        <button
          type="button"
          className="switch-btn"
          onClick={onSignup}
        >

          {t(
            "login.createWorkspace"
          )}

        </button>

      </p>

    </div>
  );
}
