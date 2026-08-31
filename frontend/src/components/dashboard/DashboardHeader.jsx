import "./Dashboard.css";

import {
    FaSyncAlt,
    FaCalendarAlt,
} from "react-icons/fa";

import {
    HiSparkles,
} from "react-icons/hi2";

import { useTranslation } from "react-i18next";


export default function DashboardHeader() {

    const { t, i18n } = useTranslation();


    /* =====================================================
       USER
    ===================================================== */

    let user = null;

    try {

        user = JSON.parse(
            localStorage.getItem("user")
        );

    } catch (error) {

        console.warn(
            "Unable to read user data from localStorage."
        );

    }


    const username =
        user?.username ||
        t(
            "dashboardHeader.user",
            {
                defaultValue: "Admin"
            }
        );


    /* =====================================================
       GREETING
    ===================================================== */

    const hour =
        new Date().getHours();


    const greeting =

        hour < 12

            ?

            t(
                "dashboardHeader.goodMorning",
                {
                    defaultValue: "Good Morning"
                }
            )

            :

            hour < 18

                ?

                t(
                    "dashboardHeader.goodAfternoon",
                    {
                        defaultValue: "Good Afternoon"
                    }
                )

                :

                t(
                    "dashboardHeader.goodEvening",
                    {
                        defaultValue: "Good Evening"
                    }
                );


    /* =====================================================
       TODAY'S DATE
    ===================================================== */

    const today =

        new Date().toLocaleDateString(

            i18n.language,

            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }

        );


    /* =====================================================
       REFRESH
    ===================================================== */

    const handleRefresh = () => {

        window.location.reload();

    };


    return (

        <div className="dashboard-header">


            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <div className="dashboard-main">


                <div className="dashboard-badge">

                    <HiSparkles />

                    {
                        t(
                            "dashboardHeader.badge",
                            {
                                defaultValue:
                                    "Enterprise Feature Management"
                            }
                        )
                    }

                </div>


                <h1>

                    <span className="dashboard-greeting">

                        {greeting}

                    </span>


                    ,{" "}


                    <span className="dashboard-username">

                        {username}

                    </span>

                </h1>


                <p>

                    {
                        t(
                            "dashboardHeader.description",
                            {
                                defaultValue:
                                    "Manage feature flags, environments and rollouts from a single dashboard."
                            }
                        )
                    }

                </p>


            </div>


            {/* =================================================
                RIGHT CONTENT
            ================================================= */}

            <div className="dashboard-header-right">


                <div className="dashboard-date">

                    <FaCalendarAlt />

                    <span>

                        {today}

                    </span>

                </div>


                <div className="dashboard-actions">

                    <button

                        type="button"

                        className="refresh-btn"

                        onClick={handleRefresh}

                    >

                        <FaSyncAlt />

                        {
                            t(
                                "dashboardHeader.refresh",
                                {
                                    defaultValue: "Refresh"
                                }
                            )
                        }

                    </button>

                </div>


            </div>


        </div>

    );

}
