import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaRocket, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

import "./ForgotPassword.css";
import api from "../services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      toast.success("Password reset link sent to your email.");
    } catch (error) {
      console.error("Forgot password error:", error);

      toast.error(
        error.response?.data?.detail ||
          "Unable to send password reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">

        {/* LOGO */}
        <div className="forgot-password-header">
          <div className="forgot-password-logo">
            <FaRocket />
          </div>

          <div className="forgot-password-brand">
            <h2>FeatureFlow</h2>
            <span>Feature Flag Management Platform</span>
          </div>
        </div>

        {/* TITLE */}
        <h1>Forgot Password?</h1>

        <p className="forgot-password-description">
          Enter your email address and we'll send you a
          password reset link.
        </p>

        {/* FORM */}
        <form
          className="forgot-password-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="forgot-email">
            Email Address
          </label>

          <div className="forgot-password-input">
            <FaEnvelope />

            <input
              id="forgot-email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            className="forgot-password-submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* BACK */}
        <button
          type="button"
          className="forgot-password-back"
          onClick={() => navigate("/auth")}
        >
          <FaArrowLeft />
          Back to Login
        </button>

      </div>
    </div>
  );
}