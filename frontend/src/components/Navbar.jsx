import { useEffect, useState } from "react";
import "./Navbar.css";
import Select from "react-select";
import { FiFlag } from "react-icons/fi";
import { getEnvironments } from "../services/environmentService";

function Navbar({
  environment,
  setEnvironment,
  onCreateFlag,
}) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    loadEnvironments();
  }, []);

  const loadEnvironments = async () => {
    try {
      const data = await getEnvironments();

      const envOptions = data.map((env) => {
        let icon = "🟢";

        if (env.name === "Staging") {
          icon = "🟡";
        } else if (env.name === "Production") {
          icon = "🔴";
        }

        return {
          value: env.name,
          label: `${icon} ${env.name}`,
        };
      });

      setOptions(envOptions);
    } catch (error) {
      console.error("Failed to load environments:", error);
    }
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: 46,
      width: 240,
      borderRadius: 12,
      border: state.isFocused
        ? "2px solid #2563eb"
        : "1px solid #dbeafe",
      boxShadow: state.isFocused
        ? "0 0 0 4px rgba(37,99,235,.15)"
        : "0 4px 12px rgba(0,0,0,.05)",
      cursor: "pointer",
      transition: "all .25s ease",

      "&:hover": {
        borderColor: "#2563eb",
      },
    }),

    valueContainer: (base) => ({
      ...base,
      padding: "0 12px",
    }),

    option: (base, state) => ({
      ...base,
      padding: 12,
      cursor: "pointer",
      fontWeight: 500,
      backgroundColor: state.isSelected
        ? "#2563eb"
        : state.isFocused
        ? "#eff6ff"
        : "#fff",
      color: state.isSelected
        ? "#fff"
        : "#1e293b",
    }),

    menu: (base) => ({
      ...base,
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 12px 30px rgba(0,0,0,.12)",
      marginTop: 8,
      zIndex: 9999,
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    dropdownIndicator: (base) => ({
      ...base,
      color: "#2563eb",

      "&:hover": {
        color: "#1d4ed8",
      },
    }),
  };

  return (
    <div className="navbar">
      <div className="navbar-title">
        <FiFlag className="navbar-icon" />
        <span>Feature Flag Dashboard</span>
      </div>

      <div className="navbar-actions">
        <div className="navbar-environment">
          <span className="env-label">
            Environment
          </span>

          <Select
            options={options}
            value={options.find(
              (option) =>
                option.value === environment
            )}
            onChange={(selectedOption) =>
              setEnvironment(selectedOption.value)
            }
            styles={customStyles}
            isSearchable={false}
          />
        </div>

        <button
          className="navbar-create-btn"
          onClick={onCreateFlag}
        >
          + Create Flag
        </button>
      </div>
    </div>
  );
}

export default Navbar;