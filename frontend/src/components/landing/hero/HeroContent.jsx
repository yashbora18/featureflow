import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
    HiSparkles,
    HiArrowRight,
    HiPlayCircle
} from "react-icons/hi2";

import HeroStats from "./HeroStats";
import "./HeroContent.css";


function HeroContent(){

    const navigate = useNavigate();

    const { t } = useTranslation();


    return(

    <div className="hero-content">


        <div className="hero-badge">

            <HiSparkles/>

            {t("hero.badge")}

        </div>



        <h1>

            {t("hero.title")}

            <span>
                {t("hero.highlight")}
            </span>

        </h1>



        <p>

            {t("hero.description")}

        </p>




        <div className="hero-buttons">


            <button
                className="hero-primary"
                onClick={()=>navigate("/auth")}
            >

                {t("hero.getStarted")}

                <HiArrowRight/>

            </button>




            <button
                className="hero-secondary"
                onClick={()=>document
                    .getElementById("features")
                    ?.scrollIntoView({
                        behavior:"smooth"
                    })
                }
            >

                <HiPlayCircle/>

                {t("hero.learnMore")}

            </button>


        </div>




        <HeroStats/>


    </div>

    );

}


export default HeroContent;