import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsGrid from "../components/dashboard/StatsGrid";
import RolloutOverview from "../components/dashboard/RolloutOverview";
import RecentActivity from "../components/dashboard/RecentActivity";
import SystemHealth from "../components/dashboard/SystemHealth";
import QuickActions from "../components/dashboard/QuickActions";
import DeploymentSafety from "../components/dashboard/DeploymentSafety";
import FlagLifecycle from "../components/dashboard/FlagLifecycle";
import TargetingSummary from "../components/dashboard/TargetingSummary";
import CleanupSuggestions from "../components/CleanupSuggestions";

import { getDashboardData } from "../services/dashboardService";

import "../components/dashboard/Dashboard.css";


export default function Dashboard({ environment }) {

    const { t } = useTranslation();


    // =====================================================
    // ENVIRONMENT MAPPING
    // =====================================================

    const environmentMap = {

        Development: 1,

        Staging: 2,

        Production: 3,

    };


    const environmentId =
        environmentMap[environment] || 1;



    // =====================================================
    // STATE
    // =====================================================

    const [dashboard, setDashboard] =
        useState(null);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");



    // =====================================================
    // LOAD DASHBOARD DATA
    // =====================================================

    useEffect(() => {


        async function loadDashboard() {


            try {


                setLoading(true);

                setError("");


                console.log(
                    "Loading Dashboard for:",
                    environment
                );


                console.log(
                    "Environment ID:",
                    environmentId
                );



                const data =
                    await getDashboardData(
                        environmentId
                    );



                console.log(
                    "Dashboard Data:",
                    data
                );



                setDashboard(data);


            }


            catch (error) {


                console.error(
                    "Dashboard Error:",
                    error
                );


                setError(
                    t(
                        "dashboard.error",
                        {
                            defaultValue:
                                "Unable to load dashboard data."
                        }
                    )
                );


                setDashboard(null);


            }


            finally {


                setLoading(false);


            }


        }



        loadDashboard();


    }, [
        environment,
        environmentId,
        t
    ]);



    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {


        return (

            <div className="dashboard-page">

                <h2>

                    {
                        t(
                            "dashboard.loading",
                            {
                                defaultValue:
                                    "Loading Dashboard..."
                            }
                        )
                    }

                </h2>

            </div>

        );

    }



    // =====================================================
    // ERROR
    // =====================================================

    if (error) {


        return (

            <div className="dashboard-page">

                <h2>

                    {
                        t(
                            "dashboard.errorTitle",
                            {
                                defaultValue:
                                    "Dashboard Error"
                            }
                        )
                    }

                </h2>


                <p>

                    {error}

                </p>

            </div>

        );

    }



    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <div className="dashboard-page">


            {/* =========================
                HEADER
            ========================= */}

            <DashboardHeader />



            {/* =========================
                STATS
            ========================= */}

            <StatsGrid

                dashboard={dashboard}

            />



            {/* =========================
                PLATFORM INTELLIGENCE
            ========================= */}

            <div className="intelligence-grid">


                <DeploymentSafety

                    dashboard={dashboard}

                />


                <SystemHealth

                    dashboard={dashboard}

                />


                <FlagLifecycle

                    dashboard={dashboard}

                />


                <TargetingSummary

                    dashboard={dashboard}

                />


            </div>



            {/* =========================
                ROLLOUT OVERVIEW
            ========================= */}

            <div className="dashboard-section">

                <RolloutOverview

                    dashboard={dashboard}

                />

            </div>



            {/* =========================
                RECENT ACTIVITY
            ========================= */}

            <div className="dashboard-section">

                <RecentActivity

                    dashboard={dashboard}

                />

            </div>



            {/* =========================
                QUICK ACTIONS
            ========================= */}

            <QuickActions />



            {/* =========================
                CLEANUP SUGGESTIONS
            ========================= */}

            <CleanupSuggestions />


        </div>

    );

}