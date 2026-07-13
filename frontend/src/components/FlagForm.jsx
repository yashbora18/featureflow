import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getEnvironments } from "../services/environmentService";
import { createFlag, updateFlag } from "../services/flagService";

function FlagForm({
  flag,
  onFlagCreated,
  onClose,
}) {
  const [formData, setFormData] = useState({
    flag_key: "",
    flag_type: "boolean",
    default_value: false,
    enabled: false,
    description: "",
    owner_team: "",
    environment_id: 1,
  });

  const [environments, setEnvironments] = useState([]);

  useEffect(() => {
    loadEnvironments();
  }, []);

  const loadEnvironments = async () => {
    try {
      const data = await getEnvironments();
      setEnvironments(data);
    } catch (error) {
      console.error("Failed to load environments:", error);
    }
  };

  useEffect(() => {
    if (flag) {
      setFormData({
        flag_key: flag.flag_key,
        flag_type: flag.flag_type,
        default_value:
          flag.default_value === true ||
          flag.default_value === "true",
        enabled: flag.enabled,
        description: flag.description,
        owner_team: flag.owner_team,
        environment_id: flag.environment_id,
      });
    }
  }, [flag]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : name === "environment_id"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (flag) {
        await updateFlag(flag.flag_key, formData);
        alert("✅ Feature Flag Updated Successfully!");
      } else {
        await createFlag(formData);
        alert("✅ Feature Flag Created Successfully!");
      }

      setFormData({
        flag_key: "",
        flag_type: "boolean",
        default_value: false,
        enabled: false,
        description: "",
        owner_team: "",
        environment_id: 1,
      });

      if (onFlagCreated) {
        onFlagCreated();
      }
    } catch (error) {
      console.error(error);
      toast.error("Operation Failed!");
    }
  };

    return (
    <div className="flag-form">

      <div className="form-header">

        <h2>
          {flag
            ? "✏️ Update Feature Flag"
            : "Create Feature Flag"}
        </h2>

        <button
          className="close-icon"
          type="button"
          onClick={onClose}
        >
          ✕
        </button>

      </div>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Flag Key</label>

          <input
            type="text"
            name="flag_key"
            placeholder="Enter Flag Key"
            value={formData.flag_key}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Flag Type</label>

          <input
            type="text"
            value="Boolean"
            disabled
          />
        </div>

        <div>
          <label>Default Value</label>

          <div className="toggle-group">

            <label className="switch">

              <input
                type="checkbox"
                checked={formData.default_value}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    default_value: e.target.checked,
                  })
                }
              />

              <span className="slider"></span>

            </label>

            <span className="toggle-text">
              {formData.default_value
                ? "True"
                : "False"}
            </span>

          </div>

        </div>

        <div>

          <label>Owner Team</label>

          <input
            type="text"
            name="owner_team"
            placeholder="Frontend Team"
            value={formData.owner_team}
            onChange={handleChange}
            required
          />

        </div>

        <div className="full-width">

          <label>Description</label>

          <input
            type="text"
            name="description"
            placeholder="Enter Description"
            value={formData.description}
            onChange={handleChange}
          />

        </div>

        <div>

          <label>Environment</label>

          <select
            name="environment_id"
            value={formData.environment_id}
            onChange={handleChange}
          >
            {environments.map((env) => (
              <option
                key={env.id}
                value={env.id}
              >
                {env.name}
              </option>
            ))}
          </select>

        </div>

        <div>

          <label>Status</label>

          <div className="toggle-group">

            <label className="switch">

              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    enabled: e.target.checked,
                  })
                }
              />

              <span className="slider"></span>

            </label>

            <span className="toggle-text">
              {formData.enabled
                ? "Enabled"
                : "Disabled"}
            </span>

          </div>

        </div>

        <div className="button-group">

          <button
            type="button"
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="submit-btn"
          >
            {flag
              ? "Update Flag"
              : "Create Flag"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default FlagForm;