import {
  HiCheckCircle,
  HiPencilSquare,
  HiPlusCircle,
} from "react-icons/hi2";

import { FiActivity } from "react-icons/fi";


import { useState } from "react";

import { useTranslation } from "react-i18next";


import "./Dashboard.css";



export default function RecentActivity({ dashboard }) {



const { t, i18n } = useTranslation();





const logs =
dashboard?.auditLogs || [];





const [currentPage,setCurrentPage] =
useState(1);



const [rowsPerPage,setRowsPerPage] =
useState(5);





const totalPages =
Math.ceil(
logs.length /
rowsPerPage
);





const startIndex =
(currentPage - 1)
*
rowsPerPage;



const currentLogs =
logs.slice(
startIndex,
startIndex + rowsPerPage
);








const getIcon=(action)=>{


switch(action){


case "Created":

return <HiPlusCircle />;




case "Updated":

return <HiPencilSquare />;




default:

return <HiCheckCircle />;


}


};








const getAction=(action)=>{


switch(action){


case "Created":

return t(
"recentActivity.created",
{
defaultValue:"Created"
}
);





case "Updated":

return t(
"recentActivity.updated",
{
defaultValue:"Updated"
}
);





default:

return t(
"recentActivity.modified",
{
defaultValue:"Modified"
}
);


}


};








const getColor=(action)=>{


switch(action){


case "Created":

return "#16a34a";



case "Updated":

return "#7c3aed";



default:

return "#64748b";


}


};








const formatTime=(timestamp)=>{


if(!timestamp)

return "";



return new Date(

timestamp.replace(
" ",
"T"
)

)

.toLocaleString(

i18n.language,

{

dateStyle:"medium",

timeStyle:"short"

}

);


};









return (


<div className="dashboard-table-card">







<div className="section-header">
  <div>
    <h3>
      <FiActivity />
      {" "}
      {t(
        "recentActivity.title",
        {
          defaultValue: "Recent Activity"
        }
      )}
    </h3>

    <p>
      {t(
        "recentActivity.subtitle",
        {
          defaultValue:
            "Track feature flag changes and updates"
        }
      )}
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
defaultValue:"Show"
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
defaultValue:"rows"
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
"recentActivity.action",
{
defaultValue:"Action"
}
)
}

</th>



<th>

{
t(
"recentActivity.flag",
{
defaultValue:"Feature Flag"
}
)
}

</th>




<th>

{
t(
"recentActivity.environment",
{
defaultValue:"Environment"
}
)
}

</th>




<th>

{
t(
"recentActivity.changedBy",
{
defaultValue:"Changed By"
}
)
}

</th>




<th>

{
t(
"recentActivity.time",
{
defaultValue:"Time"
}
)
}

</th>



</tr>



</thead>









<tbody>



{

currentLogs.length === 0



?



(


<tr>


<td

colSpan="5"

className="empty-state"

>


{
t(
"recentActivity.empty",
{
defaultValue:
"No recent activity"
}
)
}



</td>


</tr>


)



:



currentLogs.map((log)=>(



<tr

key={log.id}

>






<td>


<div className="activity-table-action">


<div

className="activity-icon"

style={{

background:
getColor(
log.action
)

}}

>


{

getIcon(
log.action
)

}


</div>




<span>


{

getAction(
log.action
)

}


</span>



</div>


</td>









<td>


<strong>


{
log.flag_key
}


</strong>


</td>









<td>


<span className="environment-tag">


{

log.environment ||


t(
"common.notAvailable",
{
defaultValue:"N/A"
}
)


}



</span>


</td>









<td>


{


log.user ||

log.owner ||


t(
"common.system",
{
defaultValue:"System"
}
)


}



</td>









<td>


<span className="activity-time">


{

formatTime(
log.timestamp
)

}


</span>


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
defaultValue:"Page"
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
defaultValue:"of"
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