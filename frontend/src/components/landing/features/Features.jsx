import {
    HiFlag,
    HiGlobeAlt,
    HiUsers,
    HiBolt,
    HiChartBar,
    HiClipboardDocumentList,
} from "react-icons/hi2";

import { motion } from "framer-motion";

import FeatureCard from "./FeatureCard";

import "./Features.css";

const features = [

    {
        icon: HiFlag,
        title: "Feature Flags",
        description:
            "Enable or disable features instantly without redeploying your application.",
    },

    {
        icon: HiGlobeAlt,
        title: "Environment Control",
        description:
            "Manage Development, Staging and Production independently.",
    },

    {
        icon: HiUsers,
        title: "User Targeting",
        description:
            "Deliver new features to selected users, beta testers or teams.",
    },

    {
        icon: HiBolt,
        title: "Progressive Rollouts",
        description:
            "Release features gradually with percentage based rollouts.",
    },

    {
        icon: HiChartBar,
        title: "Analytics",
        description:
            "Monitor feature evaluations and rollout performance in real time.",
    },

    {
        icon: HiClipboardDocumentList,
        title: "Audit Logs",
        description:
            "Track every feature change with complete audit history.",
    },

];

function Features() {

    return (

        <section
            className="features"
            id="features"
        >

            <motion.div

                className="features-heading"

                initial={{
                    opacity:0,
                    y:30
                }}

                whileInView={{
                    opacity:1,
                    y:0
                }}

                viewport={{
                    once:true
                }}

                transition={{
                    duration:.7
                }}

            >

                <p>

                    WHY FEATUREFLOW

                </p>

                <h2>

                    Enterprise Feature Management

                </h2>

                <span>

                    Everything you need to manage feature flags,
                    environments, targeting and rollouts
                    from one powerful dashboard.

                </span>

            </motion.div>

            <div className="features-grid">

                {

                    features.map((feature,index)=>(

                        <FeatureCard

                            key={index}

                            {...feature}

                            delay={index*.08}

                        />

                    ))

                }

            </div>

        </section>

    );

}

export default Features;
