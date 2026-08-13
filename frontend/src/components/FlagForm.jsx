import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { getEnvironments } from "../services/environmentService";

import {
  createFlag,
  updateFlag,
} from "../services/flagService";

import "./FlagForm.css";


function FlagForm({
  flag,
  environmentId,
  onFlagCreated,
  onClose,
}) {

  const { t } = useTranslation();


  // =====================================================
  // FORM STATE
  // =====================================================

  const [formData, setFormData] = useState({

    flag_key: "",

    flag_type: "boolean",

    default_value: false,

    enabled: false,

    description: "",

    owner_team: "",

    environment_id:
      environmentId || 1,

  });


  // =====================================================
  // ENVIRONMENTS
  // =====================================================

  const [environments, setEnvironments] = useState([]);


  // =====================================================
  // LOAD ENVIRONMENTS
  // =====================================================

  useEffect(() => {

    loadEnvironments();

  }, []);


  const loadEnvironments = async () => {

    try {

      const data = await getEnvironments();

      setEnvironments(data);

    } catch (error) {

      console.error(
        "Failed to load environments:",
        error
      );

    }

  };


  // =====================================================
  // LOAD FLAG FOR EDIT
  // =====================================================

  useEffect(() => {

    if (flag) {

      setFormData({

        flag_key:
          flag.flag_key,

        flag_type:
          flag.flag_type,

        default_value:
          flag.default_value === true ||
          flag.default_value === "true",

        enabled:
          flag.enabled,

        description:
          flag.description || "",

        owner_team:
          flag.owner_team || "",

        environment_id:
          flag.environment_id,

      });

    }

  }, [flag]);


  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;


    let updatedValue = value;


    // ---------------------------------------------
    // NORMALIZE FLAG KEY
    // ---------------------------------------------

    if (name === "flag_key") {

      updatedValue = value
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(
          /[^a-z0-9_]/g,
          ""
        );

    }


    setFormData({

      ...formData,

      [name]:

        type === "checkbox"

          ? checked

          : name === "environment_id"

          ? Number(value)

          : updatedValue,

    });

  };


  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    try {

      console.log(
        "Submitting Flag:",
        formData
      );


      // =================================================
      // UPDATE EXISTING FLAG
      // =================================================

      if (flag) {

        /*
         * IMPORTANT
         *
         * The URL must contain the OLD environment ID.
         *
         * Example:
         *
         * Existing:
         * beta_search → Development (1)
         *
         * Selected:
         * Production (3)
         *
         * Request:
         *
         * PUT /flags/beta_search?environment_id=1
         *
         * Body:
         * environment_id: 3
         */


        const originalEnvironmentId =
          flag.environment_id;


        await updateFlag(

          flag.flag_key,

          originalEnvironmentId,

          formData

        );


        toast.success(

          t(
            "flagForm.updateSuccess"
          )

        );


        if (onFlagCreated) {

          onFlagCreated(

            t(
              "flagForm.updateSuccess"
            )

          );

        }

      }


      // =================================================
      // CREATE NEW FLAG
      // =================================================

      else {

        await createFlag(
          formData
        );


        toast.success(

          t(
            "flagForm.createSuccess"
          )

        );


        if (onFlagCreated) {

          onFlagCreated(

            t(
              "flagForm.createSuccess"
            )

          );

        }

      }


      // =================================================
      // RESET FORM
      // =================================================

      setFormData({

        flag_key: "",

        flag_type: "boolean",

        default_value: false,

        enabled: false,

        description: "",

        owner_team: "",

        environment_id:
          environmentId || 1,

      });


      // =================================================
      // CLOSE MODAL
      // =================================================

      if (onClose) {

        onClose();

      }


    } catch (error) {

      console.error(
        "Failed to save feature flag:",
        error
      );


      console.error(
        "Backend response:",
        error.response?.data
      );


      toast.error(

        t(
          "flagForm.operationFailed"
        )

      );

    }

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="flag-form">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="form-header">

        <h2>

          {flag

            ? t(
                "flagForm.updateTitle"
              )

            : t(
                "flagForm.createTitle"
              )

          }

        </h2>


        <button

          type="button"

          className="close-icon"

          onClick={onClose}

        >

          ✕

        </button>

      </div>



      <form onSubmit={handleSubmit}>


        {/* =================================================
            FLAG KEY
        ================================================= */}

        <div>

          <label>

            {t(
              "flagForm.flagKey"
            )}

          </label>


          <input

            type="text"

            name="flag_key"

            placeholder={t(
              "flagForm.enterFlagKey"
            )}

            value={
              formData.flag_key
            }

            onChange={
              handleChange
            }

            required

          />

        </div>



        {/* =================================================
            FLAG TYPE
        ================================================= */}

        <div>

          <label>

            {t(
              "flagForm.flagType"
            )}

          </label>


          <input

            type="text"

            value={t(
              "flagForm.boolean"
            )}

            disabled

          />

        </div>



        {/* =================================================
            DEFAULT VALUE
        ================================================= */}

        <div>

          <label>

            {t(
              "flagForm.defaultValue"
            )}

          </label>


          <div className="toggle-group">

            <label className="switch">

              <input

                type="checkbox"

                checked={
                  formData.default_value
                }

                onChange={(e) =>

                  setFormData({

                    ...formData,

                    default_value:
                      e.target.checked,

                  })

                }

              />


              <span className="slider"></span>

            </label>


            <span className="toggle-text">

              {formData.default_value

                ? t(
                    "common.true"
                  )

                : t(
                    "common.false"
                  )

              }

            </span>

          </div>

        </div>



        {/* =================================================
            OWNER TEAM
        ================================================= */}

        <div>

          <label>

            {t(
              "flagForm.ownerTeam"
            )}

          </label>


          <input

            type="text"

            name="owner_team"

            placeholder={t(
              "flagForm.ownerPlaceholder"
            )}

            value={
              formData.owner_team
            }

            onChange={
              handleChange
            }

            required

          />

        </div>



        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <div className="full-width">

          <label>

            {t(
              "flagForm.description"
            )}

          </label>


          <input

            type="text"

            name="description"

            placeholder={t(
              "flagForm.descriptionPlaceholder"
            )}

            value={
              formData.description
            }

            onChange={
              handleChange
            }

          />

        </div>



        {/* =================================================
            ENVIRONMENT
        ================================================= */}

        <div>

          <label>

            {t(
              "flagForm.environment"
            )}

          </label>


          <select

            name="environment_id"

            value={
              formData.environment_id
            }

            onChange={
              handleChange
            }

          >

            {environments.map(
              (env) => (

                <option

                  key={env.id}

                  value={env.id}

                >

                  {env.name ===
                    "Development"

                    ? t(
                        "environment.development"
                      )

                    : env.name ===
                      "Staging"

                    ? t(
                        "environment.staging"
                      )

                    : env.name ===
                      "Production"

                    ? t(
                        "environment.production"
                      )

                    : env.name

                  }

                </option>

              )
            )}

          </select>

        </div>



        {/* =================================================
            STATUS
        ================================================= */}

        <div>

          <label>

            {t(
              "flagForm.status"
            )}

          </label>


          <div className="toggle-group">

            <label className="switch">

              <input

                type="checkbox"

                checked={
                  formData.enabled
                }

                onChange={(e) =>

                  setFormData({

                    ...formData,

                    enabled:
                      e.target.checked,

                  })

                }

              />


              <span className="slider"></span>

            </label>


            <span className="toggle-text">

              {formData.enabled

                ? t(
                    "flags.enabled"
                  )

                : t(
                    "flags.disabled"
                  )

              }

            </span>

          </div>

        </div>



        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="button-group">


          <button

            type="button"

            className="cancel-btn"

            onClick={onClose}

          >

            {t(
              "common.cancel"
            )}

          </button>


          <button

            type="submit"

            className="submit-btn"

          >

            {flag

              ? t(
                  "flagForm.updateButton"
                )

              : t(
                  "flagForm.createButton"
                )

            }

          </button>


        </div>


      </form>

    </div>

  );

}


export default FlagForm;