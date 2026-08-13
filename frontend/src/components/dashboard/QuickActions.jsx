import {
    HiPlus,
    HiBolt,
    HiGlobeAlt,
    HiDocumentText,
} from "react-icons/hi2";


import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";


import "./Dashboard.css";



export default function QuickActions(){


const { t } = useTranslation();


const navigate = useNavigate();





const actions = [



{
title:
t(
"quickActions.createFlag",
{
defaultValue:
"Create Flag"
}
),

description:
t(
"quickActions.createDescription",
{
defaultValue:
"Create a new feature toggle quickly"
}
),

icon:
<HiPlus />,


path:
"/flags",


},




{
title:
t(
"quickActions.evaluateFlag",
{
defaultValue:
"Evaluate Flag"
}
),

description:
t(
"quickActions.evaluateDescription",
{
defaultValue:
"Test flag behavior instantly"
}
),

icon:
<HiBolt />,


path:
"/flags",


},




{
title:
t(
"quickActions.environments",
{
defaultValue:
"Environments"
}
),

description:
t(
"quickActions.environmentDescription",
{
defaultValue:
"Manage releases safely"
}
),

icon:
<HiGlobeAlt />,


path:
"/environments",


},




{
title:
t(
"quickActions.auditLogs",
{
defaultValue:
"Audit Logs"
}
),

description:
t(
"quickActions.auditDescription",
{
defaultValue:
"Track changes history"
}
),

icon:
<HiDocumentText />,


path:
"/audit-logs",


},


];

return (

<div className="quick-actions-container">


    <h2 className="quick-actions-title">

        {
        t(
        "quickActions.title",
        {
        defaultValue:
        "Quick Actions"
        }
        )
        }

    </h2>



    <p className="quick-actions-subtitle">

        {
        t(
        "quickActions.subtitle",
        {
        defaultValue:
        "Access frequently used features"
        }
        )
        }

    </p>



    <div className="quick-actions-grid">


        {
        actions.map((action,index)=>(


            <div

            key={index}

            className="quick-action-card"


            onClick={()=>navigate(action.path)}

            >


                <div className="quick-action-icon">

                    {action.icon}

                </div>



                <h3>

                    {action.title}

                </h3>



                <span>

                    {action.description}

                </span>



            </div>


        ))

        }


    </div>


</div>

);
}