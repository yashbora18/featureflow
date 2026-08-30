import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function SecuritySettings() {
  const { t } = useTranslation();

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdatePassword = async () => {
    if (!passwords.current) {
      toast.error("Enter your current password");
      return;
    }

    if (!passwords.new) {
      toast.error("Enter a new password");
      return;
    }

    if (passwords.new.length < 8) {
      toast.error(
        "New password must be at least 8 characters"
      );
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.put("/auth/change-password", {
        current_password: passwords.current,
        new_password: passwords.new,
      });

      toast.success(
        "Password updated successfully"
      );

      setPasswords({
        current: "",
        new: "",
        confirm: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    setTimeout(() => {
      window.location.href = "/auth";
    }, 700);
  };

  return (
    <div className="settings-card">

      <h3>
        {t("settings.security.title")}
      </h3>

      <p>
        {t("settings.security.description")}
      </p>

      <div className="settings-grid">

        <div className="form-group">
          <label>
            {t("settings.security.currentPassword")}
          </label>

          <input
            type="password"
            name="current"
            value={passwords.current}
            onChange={handleChange}
            placeholder={t(
              "settings.security.currentPlaceholder"
            )}
          />
        </div>

        <div className="form-group">
          <label>
            {t("settings.security.newPassword")}
          </label>

          <input
            type="password"
            name="new"
            value={passwords.new}
            onChange={handleChange}
            placeholder={t(
              "settings.security.newPlaceholder"
            )}
          />
        </div>

        <div className="form-group">
          <label>
            {t("settings.security.confirmPassword")}
          </label>

          <input
            type="password"
            name="confirm"
            value={passwords.confirm}
            onChange={handleChange}
            placeholder={t(
              "settings.security.confirmPlaceholder"
            )}
          />
        </div>

      </div>

      <div className="settings-actions">

        <button
          type="button"
          className="primary-btn"
          onClick={handleUpdatePassword}
          disabled={loading}
        >
          {loading
            ? "Updating..."
            : t(
                "settings.security.updatePassword"
              )}
        </button>

        <button
          type="button"
          className="danger-btn"
          onClick={handleLogout}
        >
          {t("settings.security.logout")}
        </button>

      </div>

    </div>
  );
}