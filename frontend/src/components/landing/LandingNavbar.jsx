import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
    HiBars3,
    HiXMark,
    HiSun,
    HiMoon,
} from "react-icons/hi2";

import LanguageSelector from "../common/LanguageSelector";

import "./LandingNavbar.css";


function LandingNavbar() {


    const navigate = useNavigate();

    const { t } = useTranslation();


    const [scrolled,setScrolled] = useState(false);

    const [mobileMenu,setMobileMenu] = useState(false);


    const [darkMode,setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );



    useEffect(()=>{

        const handleScroll = ()=>{

            setScrolled(window.scrollY > 20);

        };


        window.addEventListener(
            "scroll",
            handleScroll
        );


        return ()=>{

            window.removeEventListener(
                "scroll",
                handleScroll
            );

        };


    },[]);



    useEffect(()=>{

        localStorage.setItem(
            "theme",
            darkMode ? "dark" : "light"
        );


        document.documentElement.classList.toggle(
            "dark",
            darkMode
        );


    },[darkMode]);



    return (

        <nav 
        className={`landing-navbar ${
            scrolled ? "scrolled" : ""
        }`}
        >



            {/* LOGO */}

            <div
            className="logo"
            onClick={()=>window.scrollTo({
                top:0,
                behavior:"smooth"
            })}
            >


                <div className="logo-box">

                    <img
                    src="/logo.png"
                    className="logo-image"
                    alt="FeatureFlow"
                    />

                </div>


                <span>
                    FeatureFlow
                </span>


            </div>




            {/* NAV LINKS */}


            <ul 
            className={`nav-links ${
                mobileMenu ? "show" : ""
            }`}
            >


                <li>

                    <a href="#features">
                        {t("nav.features")}
                    </a>

                </li>


                <li>

                    <a href="#workflow">
                        {t("nav.workflow")}
                    </a>

                </li>


                <li>

                    <a href="#tech">
                        {t("nav.techStack")}
                    </a>

                </li>


                <li>

                    <a href="#contact">
                        {t("nav.contact")}
                    </a>

                </li>


            </ul>





            {/* ACTIONS */}


            <div className="nav-actions">


                {/* THEME SWAP */}

                <button
                className="theme-switch"
                onClick={()=>setDarkMode(!darkMode)}
                >

                    {
                    darkMode

                    ?

                    <HiSun/>

                    :

                    <HiMoon/>

                    }

                </button>



                <LanguageSelector />



                <button
                className="login-btn"
                onClick={()=>navigate("/auth")}
                >

                    {t("nav.login")}

                </button>



                <button
                className="primary-btn"
                onClick={()=>navigate("/auth")}
                >

                    {t("nav.getStarted")}

                </button>


            </div>





            {/* MOBILE MENU */}


            <button
            className="mobile-menu-btn"
            onClick={()=>setMobileMenu(!mobileMenu)}
            >

                {

                mobileMenu

                ?

                <HiXMark/>

                :

                <HiBars3/>

                }


            </button>



        </nav>

    );

}


export default LandingNavbar;


   
