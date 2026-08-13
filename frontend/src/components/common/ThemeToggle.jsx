import { motion } from "framer-motion";
import { HiMoon, HiSun } from "react-icons/hi2";

import { useTheme } from "../../context/ThemeContext";

import "./ThemeToggle.css";

function ThemeToggle() {

    const { theme, toggleTheme } = useTheme();

    return (

        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
        >

            <motion.div
                className="theme-toggle-thumb"
                animate={{
                    x: theme === "dark" ? 32 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                }}
            >

                {

                    theme === "dark"

                        ? <HiMoon />

                        : <HiSun />

                }

            </motion.div>

        </button>

    );

}

export default ThemeToggle;