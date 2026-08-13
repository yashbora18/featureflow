import {
    HiShieldCheck,
    HiExclamationTriangle,
    HiCheckCircle,
} from "react-icons/hi2";

import { useTranslation } from "react-i18next";

import "./Dashboard.css";


export default function DeploymentSafety({ dashboard }) {


const { t } = useTranslation();



// Backend data

const safety =
dashboard?.deploymentSafety || {};



const safetyScore =
safety.score || 0;



const activeFlags =
safety.activeFlags || 0;



const totalFlags =
safety.totalFlags || 0;



const isSafe =
safety.status === "safe";





return (


<div className="intelligence-card">



<div className="intelligence-header">


<div>


<h3>

{
t(
"deploymentSafety.title",
{
defaultValue:"Deployment Safety"
}
)
}

</h3>



<p>

{
t(
"deploymentSafety.subtitle",
{
defaultValue:"Monitor release confidence"
}
)
}

</p>


</div>



<HiShieldCheck

size={32}

color="#7c3aed"

/>


</div>







<div className="safety-score">


<div className="score-circle">


{safetyScore}%


</div>





<div className="score-status">


{

isSafe


?


<>


<HiCheckCircle />


<span>

{
t(
"deploymentSafety.safe",
{
defaultValue:"Safe Deployment"
}
)
}

</span>


</>


:


<>


<HiExclamationTriangle />


<span>

{
t(
"deploymentSafety.warning",
{
defaultValue:"Needs Attention"
}
)
}

</span>


</>


}



</div>


</div>







<div className="safety-progress">


<div className="progress-track">


<div

className="progress-fill"

style={{
width:`${safetyScore}%`
}}

/>


</div>


</div>









<div className="safety-checks">





<div className="safety-item">


<HiCheckCircle color="#22c55e"/>


<div>


<strong>


{
t(
"deploymentSafety.rolloutChecks",
{
defaultValue:"Rollout Checks"
}
)
}


</strong>



<span>


{

t(
"deploymentSafety.activeCount",
{
active:activeFlags,
total:totalFlags,
defaultValue:
"{{active}}/{{total}} Active"
}
)

}



</span>


</div>


</div>









<div className="safety-item">


<HiCheckCircle color="#22c55e"/>


<div>


<strong>


{
t(
"deploymentSafety.environmentChecks",
{
defaultValue:"Environment Checks"
}
)
}


</strong>



<span>


{
t(
"deploymentSafety.passed",
{
defaultValue:"Passed"
}
)
}


</span>


</div>


</div>






</div>










<div className="deployment-summary">





<div className="summary-box">


<span>


{
t(
"deploymentSafety.activeFlags",
{
defaultValue:"Active Flags"
}
)
}


</span>



<strong>

{activeFlags}

</strong>


</div>







<div className="summary-box">


<span>


{
t(
"deploymentSafety.totalFlags",
{
defaultValue:"Total Flags"
}
)
}


</span>



<strong>

{totalFlags}

</strong>


</div>






</div>









<div className="safety-message">


{


isSafe


?


<>


<HiCheckCircle />


<p>


{
t(
"deploymentSafety.messageSafe",
{
defaultValue:
"Your deployments are currently stable and safe."
}
)
}


</p>


</>



:


<>


<HiExclamationTriangle />


<p>


{
t(
"deploymentSafety.messageWarning",
{
defaultValue:
"Some deployments require attention."
}
)
}


</p>


</>



}



</div>






</div>


);


}