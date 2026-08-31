import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import { useTranslation } from "react-i18next";


import {
    getCleanupSuggestions,
    markCleanupReviewed,
} from "../services/cleanupService";


import {
    FaTrashAlt,
    FaCheckCircle,
    FaFlag,
    FaUsers,
    FaCheck,
    FaTimes,
} from "react-icons/fa";


import "./CleanupSuggestions.css";



function CleanupSuggestions(){


const { t } = useTranslation();


const [flags,setFlags] = useState([]);


const [currentPage,setCurrentPage] = useState(1);

const [rowsPerPage,setRowsPerPage] = useState(5);





useEffect(()=>{

    loadSuggestions();

},[]);







const loadSuggestions = async()=>{


    try{


        const data =
        await getCleanupSuggestions();


        setFlags(data);


    }
    catch(error){


        console.error(error);


        toast.error(
            t("cleanup.messages.loadFailed")
        );


    }


};









const handleReview = async(flagKey)=>{


    try{


        const response =
        await markCleanupReviewed(flagKey);



        setFlags(prev =>

            prev.map(flag =>

                flag.flag_key === flagKey

                ?

                {

                    ...flag,

                    reviewed:true,

                    reviewed_at:
                    response.reviewed_at

                }

                :

                flag

            )

        );



        toast.success(
            t("cleanup.messages.markSuccess")
        );



    }
    catch(error){


        console.error(error);



        toast.error(
            t("cleanup.messages.markFailed")
        );


    }


};








// ============================
// PAGINATION
// ============================


const totalPages = Math.ceil(
    flags.length / rowsPerPage
);



const startIndex =
(currentPage - 1) * rowsPerPage;



const endIndex =
startIndex + rowsPerPage;



const paginatedFlags =
flags.slice(
    startIndex,
    endIndex
);








return (

<div className="cleanup-card">



<div className="cleanup-header">


<h2>

<FaTrashAlt />

{t("cleanup.title")}

</h2>


<p>

{t("cleanup.description")}

</p>


</div>








{
flags.length === 0


?

(

<div className="cleanup-empty">


<FaCheckCircle />


<p>

{t("cleanup.empty")}

</p>


</div>

)


:


(

<>


<div className="cleanup-table-wrapper">



<table className="cleanup-table">



<thead>


<tr>


<th>
Flag
</th>


<th>
Environment
</th>


<th>
Owner Team
</th>


<th>
Issue
</th>


<th>
Status
</th>


<th>
Reviewed
</th>


<th>
Last Reviewed
</th>


<th>
Action
</th>


</tr>


</thead>





<tbody>


{


paginatedFlags.map((flag)=>(


<tr key={flag.flag_key}>



<td>


<div className="flag-name">


<FaFlag />


{flag.flag_key}


</div>


</td>







<td>


<span className="environment-badge">


{
flag.environment ||
"Production"
}


</span>


</td>







<td>


<div className="owner-name">


<FaUsers />


{
flag.owner_team
}


</div>


</td>








<td>


<span className="issue-text">


{
flag.issue ||
"No activity detected"
}


</span>


</td>








<td>


<span

className={
`severity ${
flag.status?.toLowerCase()
}`
}

>


{
flag.status
}


</span>


</td>








<td>


{


flag.reviewed


?


<FaCheck

className="review-yes"

/>


:


<FaTimes

className="review-no"

/>


}


</td>









<td>


{


flag.reviewed_at


?


(

<div className="last-reviewed">


<span>


{

new Date(
flag.reviewed_at
)

.toLocaleDateString(
"en-US",
{
weekday:"short",
day:"2-digit",
month:"short",
year:"numeric"
}
)

}


</span>




<small>


{

new Date(
flag.reviewed_at
)

.toLocaleTimeString(
"en-US",
{
hour:"2-digit",
minute:"2-digit",
second:"2-digit"
}
)

}


</small>


</div>

)


:


(

<span className="never-reviewed">

Never

</span>

)


}


</td>








<td>





{


!flag.reviewed


&&


(

<button


className="review-btn"


onClick={()=>


handleReview(

flag.flag_key

)


}


>


{

t(

"cleanup.markReviewed"

)

}


</button>


)


}




{


flag.reviewed


&&


(

<span className="reviewed-text">


✓ Reviewed


</span>


)


}



</td>




</tr>


))


}



</tbody>


</table>


</div>






{/* ============================
 PAGINATION
============================= */}


<div className="cleanup-pagination">





<div className="pagination-info">


Showing {startIndex + 1} - {Math.min(endIndex, flags.length)}

of {flags.length} results


</div>







<div className="pagination-controls">





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

5 rows

</option>



<option value={10}>

10 rows

</option>



<option value={20}>

20 rows

</option>


</select>








<button


disabled={currentPage === 1}


onClick={()=>


setCurrentPage(

currentPage - 1

)


}


>


Previous


</button>









{

Array.from({

length: totalPages

})


.map((_,index)=>(


<button


key={index}


className={

currentPage === index + 1

?

"active-page"

:

""

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


disabled={currentPage === totalPages}


onClick={()=>


setCurrentPage(

currentPage + 1

)


}


>


Next


</button>





</div>





</div>





</>


)


}





</div>


);


}

export default CleanupSuggestions;
