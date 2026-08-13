import React from "react";
import { useTranslation } from "react-i18next";
import { FaRocket, FaGithub, FaEnvelope } from "react-icons/fa";
import "./Footer.css";

function Footer() {

  const { t } = useTranslation();

  return (

    <footer
      className="footer"
      id="contact"
    >

      <div className="footer-grid">

        <div className="footer-brand">

          <div className="footer-logo">

            <FaRocket />

            <h2>FeatureFlow</h2>

          </div>

          <p>

            {t("footer.description")}

          </p>

        </div>

        <div>

          <h3>

            {t("footer.platform")}

          </h3>

          <a href="#features">

            {t("footer.features")}

          </a>

          <a href="#workflow">

            {t("footer.workflow")}

          </a>

          <a href="#tech">

            {t("footer.techStack")}

          </a>

        </div>

        <div>

          <h3>

            {t("footer.resources")}

          </h3>

          <a href="#">

            {t("footer.documentation")}

          </a>

          <a href="#">

            {t("footer.api")}

          </a>

          <a href="#">

            {t("footer.support")}

          </a>

        </div>

        <div>

          <h3>

            {t("footer.connect")}

          </h3>

          <a href="#">

            <FaGithub />

            GitHub

          </a>

          <a href="#">

            <FaEnvelope />

            {t("footer.contact")}

          </a>

        </div>

      </div>

      <div className="footer-bottom">

        {t("footer.copyright")}

      </div>

    </footer>

  );

}

export default Footer;