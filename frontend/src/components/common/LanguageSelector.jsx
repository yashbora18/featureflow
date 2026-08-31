import { useEffect, useState } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { languages } from "../../i18n/languages";

export default function LanguageSelector() {

  const { t, i18n } = useTranslation();

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );


  /* ==========================================
     WATCH DARK MODE
  ========================================== */

  useEffect(() => {

    const updateTheme = () => {

      setIsDark(
        document.documentElement.classList.contains("dark")
      );

    };


    updateTheme();


    const observer = new MutationObserver(
      updateTheme
    );


    observer.observe(
      document.documentElement,
      {
        attributes: true,
        attributeFilter: ["class"],
      }
    );


    return () => {
      observer.disconnect();
    };

  }, []);


  /* ==========================================
     LANGUAGE OPTIONS
  ========================================== */

  const options = languages.map(
    (language) => ({

      value: language.code,

      label:
        `${language.nativeName} (${language.name})`,

      region: language.region,

    })
  );


  /* ==========================================
     GROUPED OPTIONS
  ========================================== */

  const groupedOptions = [

    {
      label: "India",

      options: options.filter(
        (option) =>
          option.region === "India"
      ),

    },

    {
      label: "Global",

      options: options.filter(
        (option) =>
          option.region === "Global"
      ),

    },

  ];


  /* ==========================================
     SELECTED LANGUAGE
  ========================================== */

  const selectedLanguage =
    options.find(
      (option) =>
        option.value === i18n.language
    ) || options[0];


  /* ==========================================
     CHANGE LANGUAGE
  ========================================== */

  const handleChange = (selected) => {

    if (!selected) return;

    i18n.changeLanguage(
      selected.value
    );

    localStorage.setItem(
      "language",
      selected.value
    );

  };


  /* ==========================================
     REACT SELECT STYLES
  ========================================== */

  const customStyles = {

    /* ========================================
       CONTROL
    ======================================== */

    control: (provided, state) => ({

      ...provided,

      minWidth: 260,

      height: 44,

      borderRadius: 12,

      borderColor:

        state.isFocused

          ? "#6366f1"

          : isDark
            ? "#334155"
            : "#dbe3f0",

      boxShadow: "none",

      cursor: "pointer",

      backgroundColor:

        isDark
          ? "#111827"
          : "#ffffff",

      transition:
        "all 0.2s ease",

      "&:hover": {

        borderColor: "#6366f1",

      },

    }),


    /* ========================================
       VALUE CONTAINER
    ======================================== */

    valueContainer: (provided) => ({

      ...provided,

      padding: "0 12px",

    }),


    /* ========================================
       SELECTED VALUE
    ======================================== */

    singleValue: (provided) => ({

      ...provided,

      color:

        isDark
          ? "#f8fafc"
          : "#1e293b",

      fontWeight: 500,

      fontSize: 15,

    }),


    /* ========================================
       INPUT
    ======================================== */

    input: (provided) => ({

      ...provided,

      color:

        isDark
          ? "#f8fafc"
          : "#1e293b",

    }),


    /* ========================================
       PLACEHOLDER
    ======================================== */

    placeholder: (provided) => ({

      ...provided,

      color:

        isDark
          ? "#94a3b8"
          : "#64748b",

    }),


    /* ========================================
       DROPDOWN INDICATOR
    ======================================== */

    dropdownIndicator: (provided, state) => ({

      ...provided,

      color:

        isDark
          ? "#a78bfa"
          : "#64748b",

      transition:
        "transform 0.2s ease",

      transform:
        state.selectProps.menuIsOpen
          ? "rotate(180deg)"
          : "rotate(0deg)",

      "&:hover": {

        color: "#818cf8",

      },

    }),


    /* ========================================
       INDICATOR SEPARATOR
    ======================================== */

    indicatorSeparator: () => ({

      display: "none",

    }),


    /* ========================================
       DROPDOWN MENU
    ======================================== */

    menu: (provided) => ({

      ...provided,

      marginTop: 6,

      borderRadius: 12,

      overflow: "hidden",

      zIndex: 99999,

      backgroundColor:

        isDark
          ? "#111827"
          : "#ffffff",

      border:

        isDark
          ? "1px solid #334155"
          : "1px solid #e2e8f0",

      boxShadow:

        isDark

          ? "0 20px 45px rgba(0,0,0,.50)"

          : "0 15px 35px rgba(15,23,42,.15)",

    }),


    /* ========================================
       MENU LIST
    ======================================== */

    menuList: (provided) => ({

      ...provided,

      padding: 6,

      maxHeight: 340,

      backgroundColor:

        isDark
          ? "#111827"
          : "#ffffff",

    }),


    /* ========================================
       GROUP
    ======================================== */

    group: (provided) => ({

      ...provided,

      padding: 0,

    }),


    /* ========================================
       GROUP HEADING
    ======================================== */

    groupHeading: (provided) => ({

      ...provided,

      fontWeight: 700,

      color:

        isDark
          ? "#c4b5fd"
          : "#6366f1",

      fontSize: 13,

      backgroundColor:

        isDark
          ? "#0f172a"
          : "#f8fafc",

      padding: "9px 12px",

      margin: "0 0 3px",

      borderRadius: 7,

    }),


    /* ========================================
       OPTIONS
    ======================================== */

    option: (provided, state) => ({

      ...provided,

      backgroundColor:

        state.isSelected

          ? "#6366f1"

          : state.isFocused

            ? isDark
              ? "#1e293b"
              : "#f5f3ff"

            : isDark
              ? "#111827"
              : "#ffffff",

      color:

        state.isSelected

          ? "#ffffff"

          : isDark
            ? "#e2e8f0"
            : "#1e293b",

      cursor: "pointer",

      borderRadius: 8,

      padding: "10px 12px",

      fontSize: 14,

      fontWeight:

        state.isSelected
          ? 600
          : 500,

      transition:
        "background-color 0.15s ease",

    }),


    /* ========================================
       MENU PORTAL
    ======================================== */

    menuPortal: (provided) => ({

      ...provided,

      zIndex: 999999,

    }),

  };


  return (

    <Select

      options={groupedOptions}

      value={selectedLanguage}

      onChange={handleChange}

      styles={customStyles}

      isSearchable

      placeholder={
        t("language.select")
      }

      menuPortalTarget={
        document.body
      }

      menuPosition="fixed"

    />

  );

}
