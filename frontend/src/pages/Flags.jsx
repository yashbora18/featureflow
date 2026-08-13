import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  FiFlag,
  FiCheckCircle,
  FiSearch,
  FiRefreshCw,
  FiUsers,
} from "react-icons/fi";

import {
  MdEdit,
  MdDelete,
} from "react-icons/md";

import { FaToggleOff } from "react-icons/fa";


import PageHeader from "../components/common/PageHeader";
import FlagForm from "../components/FlagForm";
import SuccessModal from "../components/SuccessModal";
import LoadingSkeleton from "../components/common/LoadingSkeleton";


import {
  getFlags,
  deleteFlag,
} from "../services/flagService";


import "./Flags.css";




function Flags({

  environment,

  showForm,

  setShowForm,

}) {


  const { t } = useTranslation();

  const navigate = useNavigate();



  const environmentMap = {

    Development:1,

    Staging:2,

    Production:3,

  };

  const currentEnvironmentId =
    environmentMap[environment];



  const [flags,setFlags] = useState([]);


  const [loading,setLoading] = useState(true);


  const [error,setError] = useState("");



  const [searchTerm,setSearchTerm] =
  useState("");



  const [statusFilter,setStatusFilter] =
  useState("all");



  const [selectedFlag,setSelectedFlag] =
  useState(null);



  const [flagToDelete,setFlagToDelete] =
  useState(null);



  const [showDeleteModal,setShowDeleteModal] =
  useState(false);



  const [showSuccessModal,setShowSuccessModal] =
  useState(false);



  const [successMessage,setSuccessMessage] =
  useState("");



  // Pagination

  const [currentPage,setCurrentPage] =
  useState(1);


  const [itemsPerPage,setItemsPerPage] =
  useState(10);




  useEffect(()=>{

    loadFlags();

  },[environment]);





  const loadFlags = async()=>{


    try{


      setLoading(true);


      const data = await getFlags(
        environmentMap[environment]
      );



      setFlags(

        Array.isArray(data)

        ?

        data

        :

        []

      );


      setError("");



    }

    catch(error){


      console.error(
        error
      );


      setError(
        t("flags.fetchError")
      );


    }

    finally{

      setLoading(false);

    }

  };





  const handleRefresh = ()=>{

    loadFlags();

  };





  const handleDeleteClick=(flag)=>{


    setFlagToDelete(flag);

    setShowDeleteModal(true);

  };





  const confirmDelete = async()=>{


    try{


      await deleteFlag(

        flagToDelete.flag_key,

        flagToDelete.environment_id

      );



      setShowDeleteModal(false);


      setFlagToDelete(null);



      loadFlags();



      setSuccessMessage(

        t("flags.deleteSuccess")

      );


      setShowSuccessModal(true);


    }

    catch(error){


      console.error(error);


      toast.error(

        t("flags.deleteFailed")

      );


    }

  };


    // ==============================
  // FILTER FLAGS
  // ==============================


  const filteredFlags = flags.filter((flag)=>{


    const searchMatch =

      flag.flag_key
      ?.toLowerCase()
      .includes(
        searchTerm.toLowerCase()
      )

      ||

      flag.owner_team
      ?.toLowerCase()
      .includes(
        searchTerm.toLowerCase()
      )

      ||

      flag.flag_type
      ?.toLowerCase()
      .includes(
        searchTerm.toLowerCase()
      );



    const statusMatch =

      statusFilter === "all"

      ?

      true

      :

      statusFilter === "enabled"

      ?

      flag.enabled

      :

      !flag.enabled;



    return (

      searchMatch

      &&

      statusMatch

    );


  });





  // ==============================
  // STATISTICS
  // ==============================


  const totalFlags = filteredFlags.length;



  const enabledFlags = filteredFlags.filter(

    flag=>flag.enabled

  ).length;



  const disabledFlags = filteredFlags.filter(

    flag=>!flag.enabled

  ).length;



  const totalTeams = [

    ...new Set(

      filteredFlags.map(

        flag=>flag.owner_team

      )

    )

  ].length;





  // ==============================
  // PAGINATION
  // ==============================


  const totalPages = Math.ceil(

    filteredFlags.length /

    itemsPerPage

  );



  const indexOfLastFlag =

    currentPage *

    itemsPerPage;



  const indexOfFirstFlag =

    indexOfLastFlag -

    itemsPerPage;



  const currentFlags =

    filteredFlags.slice(

      indexOfFirstFlag,

      indexOfLastFlag

    );





  const changeRows = (value)=>{


    setItemsPerPage(

      Number(value)

    );


    setCurrentPage(1);


  };





  const pageNumbers = [];


  for(

    let i=1;

    i<=totalPages;

    i++

  ){

    pageNumbers.push(i);

  }





  if(loading){

    return (

      <LoadingSkeleton />

    );

  }





  return (

<div className="flags-page">



{/* =================================
    HEADER
================================= */}


{/* =================================
    ANALYTICS STYLE HEADER
================================= */}


<div className="flags-header-card">


    <div className="flags-header-left">


        <div className="flags-header-icon">

            <FiFlag />

        </div>



        <div className="flags-header-content">


            <h1>

                {t("flags.pageTitle")}

            </h1>


            <p>

                {t("flags.pageDescription")}

            </p>


        </div>


    </div>





    <div className="flags-header-actions">


        <button

            className="create-flag-btn"

            onClick={()=>{

                setSelectedFlag(null);

                setShowForm(true);

            }}

        >

            {t("flags.createFlag")}

        </button>





        <button

            className="refresh-btn"

            onClick={handleRefresh}

        >

            <FiRefreshCw />

            Refresh


        </button>



    </div>



</div>





{/* =================================
    FLAG STATISTICS
================================= */}


<div className="flag-stats-grid">



<div className="flag-stat-card">


<div className="stat-icon blue">

<FiFlag/>

</div>


<div>

<h4>

Total Flags

</h4>


<h2>

{totalFlags}

</h2>


</div>


</div>






<div className="flag-stat-card">


<div className="stat-icon green">

<FiCheckCircle/>

</div>


<div>

<h4>

Enabled

</h4>


<h2>

{enabledFlags}

</h2>


</div>


</div>







<div className="flag-stat-card">


<div className="stat-icon red">

<FaToggleOff/>

</div>


<div>

<h4>

Disabled

</h4>


<h2>

{disabledFlags}

</h2>


</div>


</div>







<div className="flag-stat-card">


<div className="stat-icon purple">

<FiUsers/>

</div>


<div>

<h4>

Teams

</h4>


<h2>

{totalTeams}

</h2>


</div>


</div>



</div>





{/* =================================
    FILTER TOOLBAR
================================= */}


<div className="flag-toolbar">



<div className="filter-buttons">



<button

className={

statusFilter==="all"

?

"filter-btn active-filter"

:

"filter-btn"

}

onClick={()=>{

setStatusFilter("all");

setCurrentPage(1);

}}

>


<FiFlag/>

All


</button>





<button

className={

statusFilter==="enabled"

?

"filter-btn active-filter"

:

"filter-btn"

}

onClick={()=>{

setStatusFilter("enabled");

setCurrentPage(1);

}}

>


<FiCheckCircle/>

Enabled


</button>





<button

className={

statusFilter==="disabled"

?

"filter-btn active-filter"

:

"filter-btn"

}

onClick={()=>{

setStatusFilter("disabled");

setCurrentPage(1);

}}

>


<FaToggleOff/>

Disabled


</button>



</div>





<div className="search-container">


<FiSearch/>


<input

className="search-box"

placeholder={t("flags.search")}

value={searchTerm}

onChange={(e)=>{

setSearchTerm(e.target.value);

setCurrentPage(1);

}}


/>


</div>



</div>

{/* =================================
    FLAG TABLE
================================= */}


<div className="flag-table-card">


<table className="flag-table">


<thead>

<tr>

<th>ID</th>

<th>
{t("flags.table.flagKey")}
</th>

<th>
{t("flags.table.type")}
</th>

<th>
{t("flags.table.status")}
</th>

<th>
{t("flags.table.ownerTeam")}
</th>

<th>
{t("flags.table.actions")}
</th>

</tr>

</thead>



<tbody>


{

currentFlags.length > 0

?


currentFlags.map((flag)=>(


<tr key={flag.id}>


<td>

{flag.id}

</td>




<td>

<span

className="flag-key"

onClick={()=>


navigate(
 `/flag/${encodeURIComponent(flag.flag_key)}/${flag.environment_id}`
)


}

>

{flag.flag_key}

</span>


</td>




<td>


<span className="type-badge">

{flag.flag_type}

</span>


</td>




<td>


<span

className={

flag.enabled

?

"status-enabled"

:

"status-disabled"

}

>


{

flag.enabled

?

t("flags.enabled")

:

t("flags.disabled")

}


</span>


</td>




<td>


<span className="owner-badge">

{flag.owner_team}

</span>


</td>




<td className="action-buttons">


<button

className="edit-btn"

onClick={()=>{

setSelectedFlag(flag);

setShowForm(true);

}}

>


Edit


</button>




<button

className="delete-btn"

onClick={()=>handleDeleteClick(flag)}

>


Delete


</button>


</td>



</tr>


))


:


<tr>

<td

colSpan="6"

className="empty-state"

>

No feature flags found

</td>

</tr>


}


</tbody>


</table>


</div>





{/* =================================
    PAGINATION CONTROLS
================================= */}



<div className="pagination-container">



<div className="rows-selector">


<span>

Show rows:

</span>



<select

value={itemsPerPage}

onChange={(e)=>

changeRows(e.target.value)

}

>


<option value="5">

5

</option>


<option value="10">

10

</option>


<option value="15">

15

</option>


<option value="20">

20

</option>


</select>



</div>







<div className="pagination">



<button

disabled={currentPage===1}

onClick={()=>setCurrentPage(currentPage-1)}

>

Previous

</button>





{

pageNumbers.map(number=>(


<button

key={number}

className={

currentPage===number

?

"active-page"

:

""

}

onClick={()=>setCurrentPage(number)}

>


{number}


</button>


))


}





<button

disabled={currentPage===totalPages}

onClick={()=>setCurrentPage(currentPage+1)}

>

Next

</button>



</div>


</div>







{/* =================================
    CREATE / EDIT MODAL
================================= */}



{

showForm && (


<div className="modal-overlay">


<div className="modal-content">



<FlagForm
    flag={selectedFlag}
    environmentId={currentEnvironmentId}
    onClose={() => {
        setSelectedFlag(null);
        setShowForm(false);
    }}
    onFlagCreated={(message) => {
        loadFlags();
        setShowForm(false);
        setSuccessMessage(message);
        setShowSuccessModal(true);
    }}
/>


</div>


</div>


)

}








{/* =================================
    DELETE MODAL
================================= */}



{

showDeleteModal && (


<div className="modal-overlay">


<div className="modal-content delete-modal">


<h2>

Delete Flag?

</h2>



<p>

Are you sure you want to delete

<strong>

{" "}

{flagToDelete?.flag_key}

</strong>

?

</p>



<div className="button-group">


<button

className="cancel-btn"

onClick={()=>{

setShowDeleteModal(false);

setFlagToDelete(null);

}}

>

Cancel

</button>




<button

className="delete-confirm-btn"

onClick={confirmDelete}

>

Delete

</button>



</div>


</div>


</div>


)

}






{

showSuccessModal && (


<SuccessModal

message={successMessage}

onClose={()=>setShowSuccessModal(false)}

/>


)


}




</div>

);


}


export default Flags;