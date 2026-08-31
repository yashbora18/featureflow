import {
    HiServer,
    HiCircleStack,
    HiBolt,
    HiCheckCircle,
    HiXCircle,
} from "react-icons/hi2";


import { useTranslation } from "react-i18next";

import "./Dashboard.css";



export default function SystemHealth({ dashboard }) {


const { t } = useTranslation();





const backend =
dashboard?.health?.status === "healthy";



const database =
dashboard?.database?.database ===
"Connected successfully";



const redis =
dashboard?.redis?.redis ===
"Redis Connected";





const healthData = [


{
title:
t(
"systemHealth.backendApi",
{
defaultValue:
"Backend API"
}
),

status:
backend,

value:
backend
?
t(
"systemHealth.healthy",
{
defaultValue:
"Healthy"
}
)
:
t(
"systemHealth.offline",
{
defaultValue:
"Offline"
}
),

icon:
<HiServer />

},



{
title:
t(
"systemHealth.postgresql",
{
defaultValue:
"PostgreSQL"
}
),

status:
database,

value:
database
?
t(
"systemHealth.connected",
{
defaultValue:
"Connected"
}
)
:
t(
"systemHealth.disconnected",
{
defaultValue:
"Disconnected"
}
),

icon:
<HiCircleStack />

},



{
title:
t(
"systemHealth.redisCache",
{
defaultValue:
"Redis Cache"
}
),

status:
redis,

value:
redis
?
t(
"systemHealth.running",
{
defaultValue:
"Running"
}
)
:
t(
"systemHealth.offline",
{
defaultValue:
"Offline"
}
),

icon:
<HiBolt />

}

];



return (

<div className="intelligence-card">


<div className="intelligence-header">


<div>

<h3>

{
t(
"systemHealth.title",
{
defaultValue:
"System Health"
}
)
}

</h3>


<p>

{
t(
"systemHealth.subtitle",
{
defaultValue:
"Monitor platform services"
}
)
}

</p>


</div>


<HiCheckCircle

size={32}

color="#7c3aed"

/>


</div>

<div className="health-list">


{
healthData.map((item,index)=>(


<div

key={index}

className="health-item"

>


<div className="health-service">


<div className="health-icon">


{item.icon}


</div>



<div>


<h4>

{item.title}

</h4>


<span>

{item.value}

</span>


</div>


</div>





<div>


{
item.status

?

<HiCheckCircle

className="health-success"

/>

:

<HiXCircle

className="health-error"

/>

}


</div>



</div>


))

}


</div>

<div className="health-summary">


    <div className="health-summary-item">


        <span>

            {
            t(
            "systemHealth.services",
            {
            defaultValue:
            "Services"
            }
            )
            }

        </span>


        <strong>

            {healthData.length}

        </strong>


    </div>





    <div className="health-summary-item">


        <span>

            {
            t(
            "systemHealth.operational",
            {
            defaultValue:
            "Operational"
            }
            )
            }

        </span>


        <strong className="health-online">


            {
            healthData.filter(
                item=>item.status
            ).length
            }


            /
            

            {healthData.length}


        </strong>


    </div>



</div>




<div className="health-message">


{
healthData.every(
    item=>item.status
)

?

<>


<HiCheckCircle />


<p>

{
t(
"systemHealth.allHealthy",
{
defaultValue:
"All platform services are running normally."
}
)
}

</p>


</>


:

<>


<HiXCircle />


<p>

{
t(
"systemHealth.attention",
{
defaultValue:
"Some services need attention."
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


