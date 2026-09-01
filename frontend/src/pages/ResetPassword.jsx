import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset link.");
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

      const response = await fetch(
        `${API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Password reset failed."
        );
      }

      toast.success("Password reset successfully!");

      setTimeout(() => {
        navigate("/auth");
      }, 1500);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        <h1>Reset Password</h1>

        <p>
          Enter a new password for your FeatureFlow
          account.
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <label>New Password</label>

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              disabled={loading}
            />
          </div>

          <div>
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Resetting Password..."
              : "Reset Password"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/auth")}
          className="back-login"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;