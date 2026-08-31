import React from "react";
import { useTranslation } from "react-i18next";

import {
  FaFlag,
  FaUsersCog,
  FaFlask,
  FaRocket,
  FaChartLine
} from "react-icons/fa";

import "./Workflow.css";

function Workflow() {

  const { t } = useTranslation();

  const steps = [
    {
      icon: <FaFlag />,
      title: t("workflow.steps.create.title"),
      description: t("workflow.steps.create.description"),
    },
    {
      icon: <FaUsersCog />,
      title: t("workflow.steps.targeting.title"),
      description: t("workflow.steps.targeting.description"),
    },
    {
      icon: <FaFlask />,
      title: t("workflow.steps.evaluate.title"),
      description: t("workflow.steps.evaluate.description"),
    },
    {
      icon: <FaRocket />,
      title: t("workflow.steps.release.title"),
      description: t("workflow.steps.release.description"),
    },
    {
      icon: <FaChartLine />,
      title: t("workflow.steps.monitor.title"),
      description: t("workflow.steps.monitor.description"),
    },
  ];

  return (
    <section
      className="workflow-section"
      id="workflow"
    >

      <div className="workflow-heading">

        <span>{t("workflow.badge")}</span>

        <h2>{t("workflow.title")}</h2>

        <p>{t("workflow.description")}</p>

      </div>

      <div className="timeline">

        {steps.map((step, index) => (

          <div
            className="timeline-card"
            key={index}
          >

            <div className="timeline-number">
              {index + 1}
            </div>

            <div className="timeline-icon">
              {step.icon}
            </div>

            <h3>{step.title}</h3>

            <p>{step.description}</p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Workflow;
