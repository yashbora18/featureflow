import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  FiFileText,
  FiRefreshCw,
  FiSearch,
  FiCopy,
} from "react-icons/fi";


import PageHeader from "../components/common/PageHeader";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import EmptyState from "../components/common/EmptyState";

import "./AuditLogs.css";



function AuditLogs({ environment }) {


const {t,i18n}=useTranslation();



const [auditLogs,setAuditLogs]=useState([]);

const [selectedLog,setSelectedLog]=useState(null);


const [searchTerm,setSearchTerm]=useState("");

const [selectedAction,setSelectedAction]=useState("");

const [selectedFlag,setSelectedFlag]=useState("");

const [fromDate,setFromDate]=useState("");

const [toDate,setToDate]=useState("");


const [loading,setLoading]=useState(true);



// ============================
// PAGINATION STATES
// ============================


const [rowsPerPage,setRowsPerPage]=useState(5);

const [currentPage,setCurrentPage]=useState(1);




// ============================
// FETCH AUDIT LOGS
// ============================


const fetchAuditLogs=async()=>{


try{

setLoading(true);


const response=await fetch(
`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/audit-logs/`
);


const data=await response.json();


setAuditLogs(data);


}
catch(error){

console.error(error);

}
finally{

setLoading(false);

}


};




useEffect(()=>{

fetchAuditLogs();

},[]);





const handleViewDiff=(log)=>{

setSelectedLog(log);

};



const closeModal=()=>{

setSelectedLog(null);

};





const getActionLabel=(action)=>{


switch(action){


case "Created":

return t(
"auditLogs.actions.created"
);



case "Updated":

return t(
"auditLogs.actions.updated"
);



case "Deleted":

return t(
"auditLogs.actions.deleted"
);



default:

return action;


}


};





// ============================
// FILTER DATA
// ============================


const filteredLogs=auditLogs.filter((log)=>{


const matchesEnvironment =
log.environment===environment;



const matchesActor =

log.actor
.toLowerCase()
.includes(
searchTerm.toLowerCase()
);



const matchesAction =

selectedAction===""

||

log.action===selectedAction;




const matchesFlag =

selectedFlag===""

||

log.flag_key===selectedFlag;




const logDate =
log.timestamp.split(" ")[0];



const matchesFrom =

!fromDate

||

logDate>=fromDate;




const matchesTo =

!toDate

||

logDate<=toDate;



return (

matchesEnvironment &&

matchesActor &&

matchesAction &&

matchesFlag &&

matchesFrom &&

matchesTo

);



});





// ============================
// PAGINATION LOGIC
// ============================


const totalPages=Math.ceil(

filteredLogs.length / rowsPerPage

);



const paginatedLogs = filteredLogs.slice(

(currentPage-1)*rowsPerPage,

currentPage*rowsPerPage

);

useEffect(()=>{

    if(currentPage > totalPages && totalPages > 0){

        setCurrentPage(1);

    }

},[currentPage,totalPages]);









if(loading){

return <LoadingSkeleton/>;

}




if(filteredLogs.length===0){


return(

<EmptyState

title={t("auditLogs.emptyTitle")}

description={
t("auditLogs.emptyDescription")
}


action={

<button

className="primary-btn"

onClick={fetchAuditLogs}

>

<FiRefreshCw/>

{t("common.refresh")}

</button>

}

/>

);


}





return (

<div className="audit-page">



<PageHeader

icon={<FiFileText/>}

title={t("auditLogs.title")}

description={
t("auditLogs.description")
}



action={


<button

className="primary-btn"

onClick={fetchAuditLogs}

>

<FiRefreshCw/>

{t("common.refresh")}

</button>


}


/>

{/* =========================
        FILTERS
========================= */}


<div className="audit-filters">


<div className="search-box">

<FiSearch className="search-icon"/>


<input

type="text"

className="search-input"

placeholder={
t("auditLogs.searchPlaceholder")
}

value={searchTerm}

onChange={(e)=>{

setSearchTerm(e.target.value);

setCurrentPage(1);

}}

/>

</div>




<div className="date-range">


<input

type="date"

value={fromDate}

onChange={(e)=>{

setFromDate(e.target.value);

setCurrentPage(1);

}}

/>


<span className="date-arrow">
→
</span>



<input

type="date"

value={toDate}

onChange={(e)=>{

setToDate(e.target.value);

setCurrentPage(1);

}}

/>


</div>





<select
  className="filter-select"
  value={selectedAction}
  onChange={(e) => {
    setSelectedAction(e.target.value);
    setCurrentPage(1);
  }}
>
  <option value="">
    {t("auditLogs.allActions")}
  </option>

  <option value="Created">
    Created
  </option>

  <option value="Updated">
    Updated
  </option>

  <option value="Deleted">
    Deleted
  </option>

  <option value="Enabled">
    Enabled
  </option>

  <option value="Disabled">
    Disabled
  </option>

  <option value="Rollout Changed">
    Rollout Changed
  </option>

  <option value="Targeting Updated">
    Targeting Updated
  </option>

  <option value="Environment Changed">
    Environment Changed
  </option>
</select>






<select

className="filter-select"

value={selectedFlag}

onChange={(e)=>{

setSelectedFlag(e.target.value);

setCurrentPage(1);

}}

>


<option value="">

{t("auditLogs.allFlags")}

</option>



{

[...new Set(
auditLogs.map(
(log)=>log.flag_key
)
)]

.map((flag)=>(


<option

key={flag}

value={flag}

>

{flag}

</option>


))


}


</select>



</div>






{/* =========================
        TABLE
========================= */}



<div className="audit-table-container">


<table className="audit-table">


<thead>

<tr>

<th>
{t("auditLogs.table.timestamp")}
</th>


<th>
{t("auditLogs.table.actor")}
</th>


<th>
{t("auditLogs.table.flag")}
</th>


<th>
{t("auditLogs.table.action")}
</th>


<th>
{t("auditLogs.table.viewDiff")}
</th>


</tr>

</thead>




<tbody>


{

paginatedLogs.map((log)=>(


<tr key={log.id}>


<td>

{
new Date(
log.timestamp
)
.toLocaleString(
i18n.language
)
}

</td>



<td>

{log.actor}

</td>




<td>

{log.flag_key}

</td>




<td>


<span
  className={`action-badge ${log.action
    .toLowerCase()
    .replace(/\s+/g, "-")}`}
>
  {getActionLabel(log.action)}
</span>


</td>




<td>


<button

className="diff-btn"

onClick={()=>handleViewDiff(log)}

>

{t("auditLogs.viewDiff")}

</button>


</td>



</tr>


))


}


</tbody>



</table>


</div>






{/* =========================
        PAGINATION
========================= */}



<div className="audit-pagination">



<div className="rows-selector">


<span>
Rows:
</span>



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


<option value={15}>
15
</option>


</select>


</div>







<div className="page-buttons">



<button


disabled={currentPage===1}


onClick={()=>


setCurrentPage(
currentPage-1
)

}


>

Previous

</button>





{

Array.from(

{
length:totalPages
},

(_,index)=>index+1

)

.map((page)=>(


<button


key={page}


className={

currentPage===page

?

"active-page"

:

""

}


onClick={()=>


setCurrentPage(page)

}


>


{page}


</button>


))


}






<button


disabled={
currentPage===totalPages
}


onClick={()=>


setCurrentPage(
currentPage+1
)

}


>

Next

</button>




</div>


</div>







{/* =========================
        MODAL
========================= */}



{
selectedLog &&

<div className="modal-overlay">


<div className="diff-modal">


<h2>

{t("auditLogs.detailsTitle")}

</h2>



<div className="diff-info">


<p>

<strong>
{t("auditLogs.flag")}:
</strong>

{" "}

{selectedLog.flag_key}

</p>



<p>

<strong>
{t("auditLogs.action")}:
</strong>

{" "}

{getActionLabel(
selectedLog.action
)}

</p>




<p>

<strong>
{t("auditLogs.actor")}:
</strong>

{" "}

{selectedLog.actor}

</p>




<p>

<strong>
{t("auditLogs.timestamp")}:
</strong>

{" "}

{
new Date(
selectedLog.timestamp
)
.toLocaleString(
i18n.language
)
}


</p>



</div>





<h3>

{t("auditLogs.jsonDiff")}

</h3>



<pre>


{

(()=>{


try{


return JSON.stringify(

JSON.parse(
selectedLog.diff
),

null,

2

);


}

catch{


return selectedLog.diff;


}


})()


}


</pre>






<button


className="copy-btn"


onClick={()=>{


navigator.clipboard.writeText(

selectedLog.diff

);


}}


>


<FiCopy/>


{t("auditLogs.copyJson")}


</button>







<button


className="close-btn"


onClick={closeModal}


>


{t("common.close")}


</button>





</div>


</div>


}



</div>

);


}


export default AuditLogs;
