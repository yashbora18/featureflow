import { useTranslation } from "react-i18next";

import {
    HiFlag,
    HiServerStack,
    HiShieldCheck,
    HiUserGroup,
} from "react-icons/hi2";

import "./HeroStats.css";


function HeroStats(){


    const { t } = useTranslation();



    const stats = [

        {
            value:"50+",
            label:t("heroStats.activeFlags"),
            icon:<HiFlag/>,
            className:"blue"
        },

        {
            value:"3",
            label:t("heroStats.environments"),
            icon:<HiServerStack/>,
            className:"green"
        },

        {
            value:"99.9%",
            label:t("heroStats.evaluation"),
            icon:<HiShieldCheck/>,
            className:"purple"
        },

        {
            value:"10+",
            label:t("heroStats.teams"),
            icon:<HiUserGroup/>,
            className:"orange"
        }

    ];



    return(

        <div className="hero-stats">

        {
            stats.map((item,index)=>(

                <div
                    className={`hero-stat-card ${item.className}`}
                    key={index}
                >

                    <div className="stat-icon">

                        {item.icon}

                    </div>


                    <div>

                        <h3>
                            {item.value}
                        </h3>

                        <p>
                            {item.label}
                        </p>

                    </div>


                </div>

            ))
        }

        </div>

    );

}

export default HeroStats;