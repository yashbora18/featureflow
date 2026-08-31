import { useTranslation } from "react-i18next";

import {
    HiRocketLaunch,
    HiBolt,
    HiChartBar,
} from "react-icons/hi2";

import "./HeroPreview.css";


function HeroPreview(){


const { t } = useTranslation();


return(


<div className="hero-preview">


<div className="dashboard">


<div className="dashboard-top">

<span></span>
<span></span>
<span></span>


<h3>
    {t("heroPreview.dashboard")}
</h3>


</div>




<div className="dashboard-stats">


<div>

<b>48</b>

<p>
    {t("heroPreview.activeFlags")}
</p>

</div>




<div>

<b>3</b>

<p>
    {t("heroPreview.environments")}
</p>

</div>




<div>

<b>99.9%</b>

<p>
    {t("heroPreview.success")}
</p>

</div>




<div>

<b>75%</b>

<p>
    {t("heroPreview.rollout")}
</p>

</div>


</div>





<div className="chart">

    {t("heroPreview.analytics")}

</div>





<div className="activity">


<div className="activity-item">

    <HiRocketLaunch />

    <span>
        {t("heroPreview.activities.payment")}
    </span>

</div>




<div className="activity-item">

    <HiBolt />

    <span>
        {t("heroPreview.activities.aiSearch")}
    </span>

</div>




<div className="activity-item">

    <HiChartBar />

    <span>
        {t("heroPreview.activities.darkMode")}
    </span>

</div>


</div>




</div>


</div>


)

}


export default HeroPreview;
