import api from "./api";


export const getDashboardData = async (
    environmentId
) => {

    const [
        flags,
        environments,
        health,
        db,
        redis,
        auditLogs,
        analytics
    ] = await Promise.all([

        // ==========================================
        // FLAGS FOR SELECTED ENVIRONMENT
        // ==========================================

        api.get("/flags/", {
            params: {
                environment_id: environmentId
            }
        }),


        // ==========================================
        // ALL ENVIRONMENTS
        // ==========================================

        api.get("/environments/"),


        // ==========================================
        // SYSTEM HEALTH
        // ==========================================

        api.get("/health"),


        // ==========================================
        // DATABASE HEALTH
        // ==========================================

        api.get("/db-test"),


        // ==========================================
        // REDIS HEALTH
        // ==========================================

        api.get("/redis-test"),


        // ==========================================
        // AUDIT LOGS
        // ==========================================

        api.get("/audit-logs/"),


        // ==========================================
        // ANALYTICS FOR SELECTED ENVIRONMENT
        // ==========================================

        api.get("/analytics/dashboard", {
            params: {
                days: 7,
                environment_id: environmentId
            }
        })

    ]);


    const analyticsData =
        analytics.data || {};


    return {

        // ==========================================
        // REAL FLAG DATA
        // ==========================================

        flags:
            Array.isArray(flags.data)
                ? flags.data
                : [],


        // ==========================================
        // REAL ENVIRONMENT DATA
        // ==========================================

        environments:
            Array.isArray(environments.data)
                ? environments.data
                : [],


        // ==========================================
        // SYSTEM DATA
        // ==========================================

        health:
            health.data,

        database:
            db.data,

        redis:
            redis.data,

        auditLogs:
            Array.isArray(auditLogs.data)
                ? auditLogs.data
                : [],


        // ==========================================
        // REAL ANALYTICS DATA
        // ==========================================

        evaluations:
            analyticsData.totalEvaluations || 0,


        activeFlags:
            analyticsData.activeFlags || 0,


        // ==========================================
        // FLAG LIFECYCLE
        // ==========================================

        flagLifecycle:
            analyticsData.flagLifecycle || {

                active: 0,

                disabled: 0,

                stale: 0,

                total: 0,

                health: 0

            },


        // ==========================================
        // TARGETING SUMMARY
        // ==========================================

        targetingSummary:
            analyticsData.targetingSummary || {

                userRules: 0,

                groupRules: 0,

                percentageRules: 0,

                totalRules: 0,

                coverage: 0

            },


        // ==========================================
        // DEPLOYMENT SAFETY
        // ==========================================

        deploymentSafety:
            analyticsData.deploymentSafety || {

                score: 0,

                activeFlags: 0,

                totalFlags: 0,

                status: "warning"

            },


        // ==========================================
        // EVALUATION TREND
        // ==========================================

        trend:
            Array.isArray(analyticsData.trend)
                ? analyticsData.trend
                : [],


        // ==========================================
        // COMPLETE ANALYTICS RESPONSE
        // ==========================================

        analytics:
            analyticsData

    };

};