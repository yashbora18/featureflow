import {
    FaServer,
    FaCheckCircle,
    FaRocket,
} from "react-icons/fa";


import { useState } from "react";

import { useTranslation } from "react-i18next";


import "./Dashboard.css";



export default function RolloutOverview({ dashboard }) {



const { t } = useTranslation();





const rolloutData =
dashboard?.flags || [];



const environments =
dashboard?.environments || [];





const [currentPage,setCurrentPage] =
useState(1);



const [rowsPerPage,setRowsPerPage] =
useState(5);





const totalPages =
Math.ceil(
rolloutData.length /
rowsPerPage
);





const startIndex =
(currentPage - 1)
*
rowsPerPage;



const currentRows =
rolloutData.slice(
startIndex,
startIndex + rowsPerPage
);








const getEnvironment = (id)=>{


const environment =
environments.find(
(env)=>
env.id === id
);



return environment?.name ||


t(
"rollout.unknownEnvironment",
{
defaultValue:
"Unknown"
}
);


};








const getStatus = (flag)=>{


if(!flag.enabled){


return t(
"rollout.disabled",
{
defaultValue:
"Disabled"
}
);


}



const percentage =
flag.rollout_percentage ?? 0;



if(percentage === 100){


return t(
"rollout.fullRelease",
{
defaultValue:
"Full Release"
}
);


}



if(percentage >= 75){


return t(
"rollout.almostComplete",
{
defaultValue:
"Almost Complete"
}
);


}



if(percentage >= 25){


return t(
"rollout.gradualRollout",
{
defaultValue:
"Gradual Rollout"
}
);


}



return t(
"rollout.canary",
{
defaultValue:
"Canary"
}
);


};









return (


<div className="dashboard-table-card">







<div className="section-header">



<div>


<h3>


<FaRocket />


{" "}


{
t(
"rollout.title",
{
defaultValue:
"Rollout Overview"
}
)
}



</h3>




<p>


{
t(
"rollout.subtitle",
{
defaultValue:
"Monitor feature release progress across environments"
}
)
}


</p>



</div>




</div>










<div className="table-controls">



<div className="rows-selector">



<label>


{
t(
"common.show",
{
defaultValue:
"Show"
}
)
}



</label>





<select


value={rowsPerPage}


onChange={(e)=>{


setRowsPerPage(
Number(e.target.value)
);


setCurrentPage(1);


}}


>


<option value={5}>
5
</option>


<option value={10}>
10
</option>


<option value={25}>
25
</option>


<option value={50}>
50
</option>


</select>




<span>


{
t(
"common.rows",
{
defaultValue:
"rows"
}
)
}


</span>



</div>



</div>









<div className="dashboard-table-wrapper">





<table className="dashboard-table">





<thead>


<tr>


<th>

{
t(
"rollout.flag",
{
defaultValue:
"Flag"
}
)
}

</th>



<th>

{
t(
"rollout.environment",
{
defaultValue:
"Environment"
}
)
}

</th>




<th>

{
t(
"rollout.percentage",
{
defaultValue:
"Rollout %"
}
)
}

</th>




<th>

{
t(
"rollout.status",
{
defaultValue:
"Status"
}
)
}

</th>




<th>

{
t(
"rollout.progress",
{
defaultValue:
"Progress"
}
)
}

</th>



</tr>



</thead>









<tbody>





{

currentRows.length === 0


?


(


<tr>


<td

colSpan="5"

className="empty-state"

>


{
t(
"rollout.empty",
{
defaultValue:
"No rollout data available"
}
)
}



</td>



</tr>


)



:


currentRows.map((flag)=>(



<tr

key={flag.flag_key}

>






<td>



<div className="table-flag-name">


<FaRocket />



<strong>

{flag.flag_key}

</strong>



</div>



</td>








<td>



<span className="environment-tag">


<FaServer />



{

getEnvironment(
flag.environment_id
)

}



</span>



</td>









<td>


<strong className="rollout-value">


{
flag.rollout_percentage ?? 0
}%


</strong>



</td>








<td>



<span className="status-pill">


<FaCheckCircle />



{

getStatus(flag)

}



</span>



</td>









<td>



<div className="table-progress">



<div className="progress-track">



<div

className="progress-fill"


style={{

width:

`${flag.rollout_percentage ?? 0}%`

}}


/>



</div>



</div>



</td>








</tr>



))


}



</tbody>





</table>






</div>









<div className="pagination-container">





<div className="pagination-info">


{
t(
"common.page",
{
defaultValue:
"Page"
}
)
}


{" "}


{currentPage}


{" "}


{
t(
"common.of",
{
defaultValue:
"of"
}
)
}


{" "}


{totalPages || 1}



</div>








<div className="pagination-buttons">



<button


className="pagination-btn"


disabled={
currentPage === 1
}


onClick={()=>


setCurrentPage(
prev =>
Math.max(
prev - 1,
1
)

)


}


>

←

</button>








{

Array.from(

{

length:
totalPages

}

)

.map((_,index)=>(


<button


key={index}


className={

currentPage === index + 1

?

"pagination-btn active"

:

"pagination-btn"

}


onClick={()=>


setCurrentPage(
index + 1
)

}


>


{index + 1}


</button>


))


}









<button


className="pagination-btn"


disabled={
currentPage === totalPages
}


onClick={()=>


setCurrentPage(

prev =>

Math.min(

prev + 1,

totalPages

)

)


}


>

→

</button>






</div>






</div>









</div>


);


}