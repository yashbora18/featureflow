import { useTranslation } from "react-i18next";


import {
    HiFlag,
    HiCheckCircle,
    HiGlobeAlt,
    HiBolt,
} from "react-icons/hi2";


import StatsCard from "./StatsCard";



export default function StatsGrid({ dashboard }) {



const { t, i18n } = useTranslation();





const totalFlags =

dashboard?.flags?.length || 0;





const activeFlags =

dashboard?.flags?.filter(

(flag)=>

flag.enabled

).length || 0;





const environments =

dashboard?.environments?.length || 0;





// Temporary value
// Later connect with evaluation analytics API


const evaluations =
dashboard?.evaluations || 0;





const stats = [



{

title:

t(

"stats.totalFlags",

{

defaultValue:

"Total Flags"

}

),


value:

totalFlags,


change:

t(

"stats.totalFlagsChange",

{

defaultValue:

"Feature toggles created"

}

),


color:

"#ede9fe",


icon:

<HiFlag color="#7c3aed"/>


},





{

title:

t(

"stats.activeFlags",

{

defaultValue:

"Active Flags"

}

),


value:

activeFlags,


change:

t(

"stats.activeFlagsChange",

{

defaultValue:

"Currently enabled"

}

),


color:

"#dcfce7",


icon:

<HiCheckCircle color="#16a34a"/>


},





{

title:

t(

"stats.environments",

{

defaultValue:

"Environments"

}

),


value:

environments,


change:

t(

"stats.environmentsChange",

{

defaultValue:

"Deployment spaces"

}

),


color:

"#ede9fe",


icon:

<HiGlobeAlt color="#7c3aed"/>


},





{

title:

t(

"stats.evaluations",

{

defaultValue:

"Evaluations"

}

),


value:

evaluations.toLocaleString(

i18n.language

),


change:

t(

"stats.evaluationsChange",

{

defaultValue:

"Flag checks processed"

}

),


color:

"#fef3c7",


icon:

<HiBolt color="#d97706"/>


}



];







return (


<div className="stats-grid">



{

stats.map(

(stat,index)=>(


<StatsCard


key={index}


title={stat.title}


value={stat.value}


change={stat.change}


color={stat.color}


icon={stat.icon}


/>


)

)


}



</div>


);


}