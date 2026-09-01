import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaRocket, FaLock, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

import "./ResetPassword.css";
import api from "../services/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get token from:
  // /reset-password?token=xxxxx
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error("Please enter both passwords.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        token: token,
        new_password: newPassword,
      });

      toast.success("Password reset successfully!");

      setTimeout(() => {
        navigate("/auth");
      }, 1500);
    } catch (error) {
      console.error("Reset password error:", error);

      toast.error(
        error.response?.data?.detail ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">

        {/* HEADER */}
        <div className="reset-password-header">
          <div className="reset-password-logo">
            <FaRocket />
          </div>

          <div className="reset-password-brand">
            <h2>FeatureFlow</h2>

            <span>
              Feature Flag Management Platform
            </span>
          </div>
        </div>

        {/* TITLE */}
        <h1>Reset Password</h1>

        <p className="reset-password-description">
          Enter a new password for your FeatureFlow
          account.
        </p>

        {/* FORM */}
        <form
          className="reset-password-form"
          onSubmit={handleSubmit}
        >

          {/* NEW PASSWORD */}
          <label htmlFor="new-password">
            New Password
          </label>

          <div className="reset-password-input">
            <FaLock />

            <input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <label htmlFor="confirm-password">
            Confirm Password
          </label>

          <div className="reset-password-input">
            <FaLock />

            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="reset-password-submit"
            disabled={loading}
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>
        </form>

        {/* BACK */}
        <button
          type="button"
          className="reset-password-back"
          onClick={() => navigate("/auth")}
        >
          <FaArrowLeft />
          Back to Login
        </button>

      </div>
    </div>
  );
}