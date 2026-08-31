import {
    HiUsers,
    HiUserGroup,
    HiChartPie,
    HiAdjustmentsHorizontal,
} from "react-icons/hi2";

import { useTranslation } from "react-i18next";

import "./Dashboard.css";


export default function TargetingSummary({ dashboard }) {


const { t } = useTranslation();



// Backend targeting data

const targeting =
dashboard?.targetingSummary || {};



const userRules =
targeting.userRules || 0;



const groupRules =
targeting.groupRules || 0;



const percentageRules =
targeting.percentageRules || 0;



const totalRules =
targeting.totalRules || 0;



const coverage =
targeting.coverage || 0;





const targetingCards = [


{
title:
t(
"targetingSummary.userRules",
{
defaultValue:"User Targeting"
}
),

value:
userRules,

icon:
<HiUsers />,

className:
"user-targeting"

},



{
title:
t(
"targetingSummary.groupRules",
{
defaultValue:"Group Targeting"
}
),

value:
groupRules,

icon:
<HiUserGroup />,

className:
"group-targeting"

},



{
title:
t(
"targetingSummary.percentageRules",
{
defaultValue:"Percentage Rollout"
}
),

value:
percentageRules,

icon:
<HiChartPie />,

className:
"percentage-targeting"

},



{
title:
t(
"targetingSummary.totalRules",
{
defaultValue:"Total Rules"
}
),

value:
totalRules,

icon:
<HiAdjustmentsHorizontal />,

className:
"total-targeting"

}

];







return (


<div className="intelligence-card">





<div className="intelligence-header">


<div>


<h3>

{
t(
"targetingSummary.title",
{
defaultValue:"Targeting Summary"
}
)
}

</h3>



<p>

{
t(
"targetingSummary.subtitle",
{
defaultValue:
"Monitor audience targeting rules"
}
)
}

</p>


</div>




<HiAdjustmentsHorizontal

size={32}

color="#7c3aed"

/>



</div>









<div className="targeting-grid">



{

targetingCards.map(

(card,index)=>(


<div

key={index}

className={
`targeting-item ${card.className}`
}

>


<div className="targeting-icon">


{card.icon}


</div>





<div className="targeting-content">


<span>

{card.title}

</span>




<strong>

{card.value}

</strong>



</div>



</div>


)

)



}



</div>









<div className="targeting-health">





<div className="targeting-progress">





<div className="summary-header">



<span>


{
t(
"targetingSummary.coverage",
{
defaultValue:
"Targeting Coverage"
}
)
}


</span>





<strong>


{

coverage > 0

?

t(
"targetingSummary.active",
{
defaultValue:"Active"
}
)

:

t(
"targetingSummary.noRules",
{
defaultValue:"No Rules"
}
)

}


</strong>



</div>







<div className="progress-track">


<div


className="progress-fill"


style={{

width:`${coverage}%`

}}


/>



</div>





</div>









<div className="targeting-message">


<HiAdjustmentsHorizontal />



<p>


{

totalRules > 0


?


t(
"targetingSummary.activeMessage",
{
defaultValue:
"Audience targeting is configured for feature releases."
}
)


:


t(
"targetingSummary.emptyMessage",
{
defaultValue:
"No targeting rules configured yet."
}
)



}



</p>



</div>







</div>





</div>


);


}
