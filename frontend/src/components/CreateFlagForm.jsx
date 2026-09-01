import { useState } from "react";
import { useTranslation } from "react-i18next";

function CreateFlagForm({ onFlagCreated }) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    flag_key: "",
    name: "",
    flag_type: "boolean",
    default_value: "false",
    description: "",
    owner_team: "",
    is_enabled: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/flags/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(t("createFlag.success"));

        if (onFlagCreated) onFlagCreated();

        setFormData({
          flag_key: "",
          name: "",
          flag_type: "boolean",
          default_value: "false",
          description: "",
          owner_team: "",
          is_enabled: false,
        });
      } else {
        alert(data.detail);
      }
    } catch (err) {
      alert(t("createFlag.connectionError"));
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    border: "1px solid #dbe4f0",
    borderRadius: "12px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div>
      <h2
        style={{
          marginBottom: "25px",
          color: "#1e293b",
        }}
      >
        🚀 {t("createFlag.title")}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        <div>
          <label style={{ fontWeight: "600" }}>
            {t("createFlag.flagKey")}
          </label>

          <input
            style={inputStyle}
            name="flag_key"
            value={formData.flag_key}
            onChange={handleChange}
            placeholder="login_v3"
          />
        </div>

        <div>
          <label style={{ fontWeight: "600" }}>
            {t("createFlag.flagName")}
          </label>

          <input
            style={inputStyle}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t("createFlag.flagNamePlaceholder")}
          />
        </div>

        <div>
          <label style={{ fontWeight: "600" }}>
            {t("createFlag.ownerTeam")}
          </label>

          <input
            style={inputStyle}
            name="owner_team"
            value={formData.owner_team}
            onChange={handleChange}
            placeholder={t("createFlag.ownerPlaceholder")}
          />
        </div>

        <div>
          <label style={{ fontWeight: "600" }}>
            {t("createFlag.defaultValue")}
          </label>

          <select
            name="default_value"
            value={formData.default_value}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="false">
              {t("common.false")}
            </option>

            <option value="true">
              {t("common.true")}
            </option>
          </select>
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
        }}
      >
        <label style={{ fontWeight: "600" }}>
          {t("createFlag.description")}
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder={t("createFlag.descriptionPlaceholder")}
          style={{
            ...inputStyle,
            resize: "none",
          }}
        />
      </div>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "600",
          }}
        >
          <input
            type="checkbox"
            name="is_enabled"
            checked={formData.is_enabled}
            onChange={handleChange}
          />

          {t("createFlag.enableFeature")}
        </label>

        <button
          onClick={handleSubmit}
          style={{
            background:
              "linear-gradient(135deg,#2563eb,#7c3aed)",
            color: "white",
            border: "none",
            padding: "14px 28px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "15px",
            boxShadow: "0 10px 20px rgba(37,99,235,.25)",
          }}
        >
          + {t("createFlag.createButton")}
        </button>
      </div>
    </div>
  );
}

export default CreateFlagForm;