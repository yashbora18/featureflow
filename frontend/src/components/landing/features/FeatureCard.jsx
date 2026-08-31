import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";

function FeatureCard({
    icon: Icon,
    title,
    description,
    delay,
}) {

    return (

        <motion.div

            className="feature-card"

            initial={{
                opacity:0,
                y:40
            }}

            whileInView={{
                opacity:1,
                y:0
            }}

            viewport={{
                once:true
            }}

            transition={{
                duration:.6,
                delay
            }}

            whileHover={{
                y:-10
            }}

        >

            <div className="feature-icon">

                <Icon />

            </div>

            <h3>

                {title}

            </h3>

            <p>

                {description}

            </p>

            <button className="feature-link">

                Learn More

                <HiArrowRight />

            </button>

        </motion.div>

    );

}

export default FeatureCard;
