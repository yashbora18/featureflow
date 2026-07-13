import { useState } from "react";

function CreateFlagForm({ onFlagCreated }) {
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
      const response = await fetch("http://127.0.0.1:8000/flags/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Feature Flag Created Successfully");

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
      alert("Backend Connection Failed");
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
        🚀 Create Feature Flag
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        <div>
          <label style={{ fontWeight: "600" }}>Flag Key</label>

          <input
            style={inputStyle}
            name="flag_key"
            value={formData.flag_key}
            onChange={handleChange}
            placeholder="login_v3"
          />
        </div>

        <div>
          <label style={{ fontWeight: "600" }}>Flag Name</label>

          <input
            style={inputStyle}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Login Version 3"
          />
        </div>

        <div>
          <label style={{ fontWeight: "600" }}>Owner Team</label>

          <input
            style={inputStyle}
            name="owner_team"
            value={formData.owner_team}
            onChange={handleChange}
            placeholder="Frontend Team"
          />
        </div>

        <div>
          <label style={{ fontWeight: "600" }}>Default Value</label>

          <select
            name="default_value"
            value={formData.default_value}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
        }}
      >
        <label style={{ fontWeight: "600" }}>Description</label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Describe your feature..."
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

          Enable Feature
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
          + Create Flag
        </button>
      </div>
    </div>
  );
}

export default CreateFlagForm;