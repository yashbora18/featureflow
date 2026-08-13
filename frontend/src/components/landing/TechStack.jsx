import React from "react";
import { useTranslation } from "react-i18next";

import {
  FaReact,
  FaPython,
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaGitAlt,
  FaGithub,
  FaDocker,
  FaDatabase
} from "react-icons/fa";

import "./TechStack.css";

function TechStack() {

  const { t } = useTranslation();

  const technologies = [
    {
      icon: <FaReact />,
      title: "React",
      desc: t("techStack.cards.react")
    },
    {
      icon: <FaPython />,
      title: "FastAPI",
      desc: t("techStack.cards.fastapi")
    },
    {
      icon: <FaDatabase />,
      title: "PostgreSQL",
      desc: t("techStack.cards.postgresql")
    },
    {
      icon: <FaJsSquare />,
      title: "JavaScript",
      desc: t("techStack.cards.javascript")
    },
    {
      icon: <FaHtml5 />,
      title: "HTML5",
      desc: t("techStack.cards.html")
    },
    {
      icon: <FaCss3Alt />,
      title: "CSS3",
      desc: t("techStack.cards.css")
    },
    {
      icon: <FaGitAlt />,
      title: "Git",
      desc: t("techStack.cards.git")
    },
    {
      icon: <FaGithub />,
      title: "GitHub",
      desc: t("techStack.cards.github")
    },
    {
      icon: <FaDocker />,
      title: "Docker Ready",
      desc: t("techStack.cards.docker")
    }
  ];

  return (

    <section
      className="tech-section"
      id="tech"
    >

      <div className="tech-heading">

        <span>{t("techStack.badge")}</span>

        <h2>{t("techStack.title")}</h2>

        <p>{t("techStack.description")}</p>

      </div>

      <div className="tech-grid">

        {technologies.map((tech, index) => (

          <div
            className="tech-card"
            key={index}
          >

            <div className="tech-icon">
              {tech.icon}
            </div>

            <h3>{tech.title}</h3>

            <p>{tech.desc}</p>

          </div>

        ))}

      </div>

    </section>

  );

}

export default TechStack;