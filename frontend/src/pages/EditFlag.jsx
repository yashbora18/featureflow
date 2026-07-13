import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function EditFlag() {
  const { flagKey } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    owner_team: "",
    default_value: "false",
    is_enabled: false,
  });

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/flags/${flagKey}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          name: data.name,
          description: data.description,
          owner_team: data.owner_team,
          default_value: data.default_value,
          is_enabled: data.is_enabled,
        });
      });
  }, [flagKey]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUpdate = async () => {
    const response = await fetch(
      `http://127.0.0.1:8000/flags/${flagKey}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (response.ok) {
      alert("✅ Flag Updated Successfully");
      navigate("/flags");
    } else {
      alert("Update Failed");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "18px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "15px",
    boxSizing: "border-box",
  };

  return (
    <>
      <Sidebar />

      <div
        style={{
          marginLeft: "280px",
          padding: "35px",
          background: "#f5f7fb",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "18px",
            boxShadow: "0 10px 25px rgba(0,0,0,.08)",
            maxWidth: "700px",
          }}
        >
          <h1 style={{ marginBottom: "25px" }}>
            ✏️ Edit Feature Flag
          </h1>

          <label>Name</label>
          <input
            style={inputStyle}
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Owner Team</label>
          <input
            style={inputStyle}
            name="owner_team"
            value={formData.owner_team}
            onChange={handleChange}
          />

          <label>Description</label>
          <textarea
            rows={5}
            style={inputStyle}
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <label>Default Value</label>

          <select
            style={inputStyle}
            name="default_value"
            value={formData.default_value}
            onChange={handleChange}
          >
            <option value="false">False</option>
            <option value="true">True</option>
          </select>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
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
            onClick={handleUpdate}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "14px 28px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            💾 Save Changes
          </button>
        </div>
      </div>
    </>
  );
}

export default EditFlag;