import {
    HiFlag,
    HiCheckCircle,
    HiClock,
    HiTrash,
} from "react-icons/hi2";

import { useTranslation } from "react-i18next";

import "./Dashboard.css";


export default function FlagLifecycle({ dashboard }) {


const { t } = useTranslation();



// Backend lifecycle data

const lifecycle =
dashboard?.flagLifecycle || {};



const activeFlags =
lifecycle.active || 0;



const disabledFlags =
lifecycle.disabled || 0;



const staleFlags =
lifecycle.stale || 0;



const totalFlags =
lifecycle.total || 0;



const health =
lifecycle.health || 0;






const lifecycleData = [



{

title:

t(
"flagLifecycle.active",
{
defaultValue:"Active"
}
),


value:

activeFlags,


icon:

<HiCheckCircle />,


className:

"lifecycle-active"

},





{

title:

t(
"flagLifecycle.disabled",
{
defaultValue:"Disabled"
}
),


value:

disabledFlags,


icon:

<HiFlag />,


className:

"lifecycle-disabled"

},





{

title:

t(
"flagLifecycle.stale",
{
defaultValue:"Stale"
}
),


value:

staleFlags,


icon:

<HiClock />,


className:

"lifecycle-stale"

},





{

title:

t(
"flagLifecycle.total",
{
defaultValue:"Total Flags"
}
),


value:

totalFlags,


icon:

<HiTrash />,


className:

"lifecycle-total"

}



];







return (


<div className="intelligence-card">





<div className="intelligence-header">



<div>


<h3>

{
t(
"flagLifecycle.title",
{
defaultValue:"Flag Lifecycle"
}
)
}

</h3>



<p>

{
t(
"flagLifecycle.subtitle",
{
defaultValue:"Track feature flag health"
}
)
}

</p>


</div>




<HiFlag

size={32}

color="#7c3aed"

/>



</div>







<div className="lifecycle-grid">



{

lifecycleData.map(

(item,index)=>(


<div

key={index}

className={
`lifecycle-item ${item.className}`
}

>


<div className="lifecycle-icon">


{item.icon}


</div>





<div className="lifecycle-content">


<span>

{item.title}

</span>




<strong>

{item.value}

</strong>



</div>



</div>


)

)



}



</div>









<div className="lifecycle-summary">





<div className="summary-progress">





<div className="summary-header">



<span>


{

t(
"flagLifecycle.health",
{
defaultValue:"Flag Health"
}
)

}


</span>




<strong>


{health}%


</strong>



</div>







<div className="progress-track">



<div


className="progress-fill"


style={{

width:`${health}%`

}}


/>



</div>





</div>









<div className="lifecycle-message">



<HiCheckCircle />



<p>


{

t(
"flagLifecycle.message",
{
defaultValue:
"Keep monitoring unused flags and clean stale releases regularly."
}
)

}


</p>



</div>






</div>





</div>


);


}