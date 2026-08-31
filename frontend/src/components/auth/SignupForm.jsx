import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./AuthForm.css";
import api from "../../services/api";

import { FaRocket } from "react-icons/fa";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

export default function SignupForm({ onLogin }) {

  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
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

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.username.trim()) {

      toast.error(
        t("signup.errors.usernameRequired")
      );

      return;

    }

    if (!form.email.trim()) {

      toast.error(
        t("signup.errors.emailRequired")
      );

      return;

    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {

      toast.error(
        t("signup.errors.invalidEmail")
      );

      return;

    }

    if (form.password.length < 8) {

      toast.error(
        t("signup.errors.passwordLength")
      );

      return;

    }

    if (form.password !== form.confirmPassword) {

      toast.error(
        t("signup.errors.passwordMismatch")
      );

      return;

    }

    if (!form.terms) {

      toast.error(
        t("signup.errors.acceptTerms")
      );

      return;

    }

    try {

      setLoading(true);

      await api.post(
        "/auth/register",
        {
          username: form.username,
          email: form.email,
          password: form.password,
        }
      );

      toast.success(
        t("signup.success.accountCreated")
      );

      setForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
      });

      setTimeout(() => {

        onLogin();

      }, 1000);

    } catch (error) {

      if (error.response?.data?.detail) {

        toast.error(
          error.response.data.detail
        );

      } else {

        toast.error(
          t("signup.errors.signupFailed")
        );

      }

    } finally {

      setLoading(false);

    }

  };

  const handleGoogleSignup = () => {

    toast.info(
      t("signup.googleComingSoon")
    );

  };

  return (
  <div className="auth-form">

    <div className="auth-header">

      <div className="logo-circle">
        <FaRocket />
      </div>

      <h1>
        {t("signup.createAccount")}
      </h1>

      <p>
        {t("signup.description")}
      </p>

    </div>

    <form onSubmit={handleSubmit}>

      {/* Username */}

      <div className="input-group">

        <label>
          {t("signup.username")}
        </label>

        <div className="input-box">

          <FaUser className="input-icon" />

          <input
            type="text"
            name="username"
            placeholder={t("signup.usernamePlaceholder")}
            value={form.username}
            onChange={handleChange}
          />

        </div>

      </div>

      {/* Email */}

      <div className="input-group">

        <label>
          {t("signup.email")}
        </label>

        <div className="input-box">

          <FaEnvelope className="input-icon" />

          <input
            type="email"
            name="email"
            placeholder={t("signup.emailPlaceholder")}
            value={form.email}
            onChange={handleChange}
          />

        </div>

      </div>

      {/* Password */}

      <div className="input-group">

        <label>
          {t("signup.password")}
        </label>

        <div className="input-box">

          <FaLock className="input-icon" />

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            name="password"
            placeholder={t("signup.passwordPlaceholder")}
            value={form.password}
            onChange={handleChange}
          />

          <button
            type="button"
            className="toggle-password"
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword
              ? <FaEyeSlash />
              : <FaEye />}
          </button>

        </div>

      </div>

      {/* Confirm Password */}

      <div className="input-group">

        <label>
          {t("signup.confirmPassword")}
        </label>

        <div className="input-box">

          <FaLock className="input-icon" />

          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            name="confirmPassword"
            placeholder={t("signup.confirmPasswordPlaceholder")}
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <button
            type="button"
            className="toggle-password"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
          >
            {showConfirmPassword
              ? <FaEyeSlash />
              : <FaEye />}
          </button>

        </div>

      </div>

      {/* Terms */}

      <label className="remember">

        <input
          type="checkbox"
          name="terms"
          checked={form.terms}
          onChange={handleChange}
        />

        {t("signup.terms")}

      </label>

      <button
        type="submit"
        className="login-btn"
        disabled={loading}
      >
        {loading
          ? t("signup.creatingAccount")
          : t("signup.createAccount")}
      </button>

    </form>

    <div className="divider">
      <span>{t("signup.or")}</span>
    </div>

    <button
      className="google-btn"
      type="button"
      onClick={handleGoogleSignup}
    >

      <FcGoogle />

      {t("signup.google")}

    </button>

    <p className="bottom-text">

      {t("signup.alreadyHaveWorkspace")}

      <button
        type="button"
        className="switch-btn"
        onClick={onLogin}
      >
        {t("signup.signIn")}
      </button>

    </p>

  </div>
);

}
