import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import PageHeader from "../components/common/PageHeader";

import {
  FiUsers,
  FiUserPlus,
  FiSearch,
  FiCode,
  FiRefreshCw,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";

import "./Team.css";


const initialTeamData = [

{
 id:1,
 name:"Yash Bora",
 email:"yash@example.com",
 role:"Feature Manager",
 status:"Active",
},

{
 id:2,
 name:"John Smith",
 email:"john@example.com",
 role:"Backend Developer",
 status:"Active",
},

{
 id:3,
 name:"Sarah Wilson",
 email:"sarah@example.com",
 role:"Frontend Developer",
 status:"Active",
},

{
 id:4,
 name:"Rahul Patel",
 email:"rahul@example.com",
 role:"QA Engineer",
 status:"Inactive",
}

];



export default function Team(){


const {t}=useTranslation();



const [teamData,setTeamData]=useState(initialTeamData);



const [searchTerm,setSearchTerm]=useState("");










// ADD

const [showAddModal,setShowAddModal]=useState(false);



const [newMember,setNewMember]=useState({

name:"",
email:"",
role:"Feature Manager",
status:"Active"

});



// EDIT

const [showEditModal,setShowEditModal]=useState(false);

const [editingMember,setEditingMember]=useState(null);



// DELETE

const [showDeleteModal,setShowDeleteModal]=useState(false);

const [memberToDelete,setMemberToDelete]=useState(null);





const filteredMembers = teamData.filter((member)=>{

    const search = searchTerm.toLowerCase();

    return (
        member.name.toLowerCase().includes(search) ||
        member.email.toLowerCase().includes(search) ||
        member.role.toLowerCase().includes(search) ||
        member.status.toLowerCase().includes(search)
    );

});




// =======================
// STATS
// =======================


const totalMembers = teamData.length;


const activeMembers =
teamData.filter(
(member)=>member.status==="Active"
).length;


const developers =
teamData.filter(
(member)=>member.role.includes("Developer")
).length;


const managers =
teamData.filter(
(member)=>member.role.includes("Manager")
).length;




// =======================
// ADD MEMBER
// =======================


const addMember=()=>{


if(!newMember.name || !newMember.email){

toast.warning("Please fill all details");

return;

}


setTeamData([

...teamData,

{
id:Date.now(),
...newMember
}

]);


toast.success(
"Team member added successfully"
);


setShowAddModal(false);


setNewMember({

name:"",
email:"",
role:"Feature Manager",
status:"Active"

});


};





// =======================
// EDIT
// =======================


const openEditModal=(member)=>{

setEditingMember(member);

setShowEditModal(true);

};



const updateMember=()=>{


setTeamData(

teamData.map((member)=>

member.id===editingMember.id

?

editingMember

:

member

)

);


toast.success(
"Team member updated successfully"
);


setShowEditModal(false);


};





// =======================
// DELETE
// =======================


const deleteMember=()=>{


setTeamData(

teamData.filter(

(member)=>

member.id!==memberToDelete.id

)

);


toast.success(
"Team member deleted successfully"
);


setShowDeleteModal(false);


setMemberToDelete(null);


};




return (

<div className="team-page">


<PageHeader

icon={<FiUsers/>}

title={t("team.title")}

description={t("team.description")}


action={

<>


<button

className="primary-btn"

onClick={()=>setShowAddModal(true)}

>

<FiUserPlus/>

{t("team.addMember")}

</button>




<button

className="primary-btn refresh-btn"

onClick={()=>{

setTeamData(initialTeamData);

toast.info(
"Team data refreshed"
);

}}

>

<FiRefreshCw/>

{t("common.refresh")}

</button>


</>

}

/>





{/* =====================
        STATS
===================== */}


<div className="team-stats">


<div className="team-card">

<div className="team-card-icon">

<FiUsers/>

</div>


<h2>{totalMembers}</h2>

<h3>
{t("team.totalMembers")}
</h3>

<p>
Project members
</p>


</div>





<div className="team-card">

<div className="team-card-icon">

<FiCode/>

</div>


<h2>{developers}</h2>

<h3>
{t("team.developers")}
</h3>

<p>
Engineering team
</p>


</div>





<div className="team-card">

<div className="team-card-icon">

<FiShield/>

</div>


<h2>{managers}</h2>

<h3>
{t("team.managers")}
</h3>

<p>
Management roles
</p>


</div>





<div className="team-card">

<div className="team-card-icon">

<FiCheckCircle/>

</div>


<h2>{activeMembers}</h2>

<h3>
{t("team.activeMembers")}
</h3>

<p>
Currently active
</p>


</div>


</div>






{/* =====================
        SEARCH FILTER
===================== */}


<div className="team-toolbar">


<div className="team-search">


<FiSearch/>


<input

type="text"

placeholder={t("team.search")}

value={searchTerm}

onChange={(e)=>
setSearchTerm(e.target.value)
}

/>


</div>
</div>






{/* =====================
        TABLE
===================== */}



<div className="team-table-container">


<table className="team-table">


<thead>

<tr>

<th>Name</th>

<th>Email</th>

<th>Role</th>

<th>Status</th>

<th>Actions</th>

</tr>


</thead>




<tbody>


{

filteredMembers.map((member)=>(


<tr key={member.id}>


<td>

<strong>

{member.name}

</strong>

</td>



<td>

{member.email}

</td>




<td>


<span className="role-badge">

{member.role}

</span>


</td>




<td>


<span

className={

member.status==="Active"

?

"status-active"

:

"status-inactive"

}

>

{member.status}

</span>


</td>




<td>


<div className="team-actions">


<button

className="edit-btn"

onClick={()=>openEditModal(member)}

>

Edit

</button>



<button

className="delete-btn"

onClick={()=>{

setMemberToDelete(member);

setShowDeleteModal(true);

}}

>

Delete

</button>


</div>


</td>



</tr>


))

}


</tbody>


</table>


</div>

{/* =====================
        ADD MEMBER MODAL
===================== */}


{
showAddModal &&

<div className="modal-overlay">


<div className="modal">


<h2>
Add Team Member
</h2>



<input

placeholder="Name"

value={newMember.name}

onChange={(e)=>

setNewMember({

...newMember,

name:e.target.value

})

}

/>




<input

placeholder="Email"

value={newMember.email}

onChange={(e)=>

setNewMember({

...newMember,

email:e.target.value

})

}

/>




<select

value={newMember.role}

onChange={(e)=>

setNewMember({

...newMember,

role:e.target.value

})

}

>


<option>
Feature Manager
</option>


<option>
Backend Developer
</option>


<option>
Frontend Developer
</option>


<option>
QA Engineer
</option>


</select>





<div className="modal-actions">


<button

className="cancel-btn"

onClick={()=>setShowAddModal(false)}

>

Cancel

</button>




<button

className="save-btn"

onClick={addMember}

>

Add Member

</button>



</div>


</div>


</div>

}





{/* =====================
        EDIT MODAL
===================== */}



{
showEditModal && editingMember &&


<div className="modal-overlay">


<div className="modal">


<h2>
Edit Team Member
</h2>





<input

value={editingMember.name}

onChange={(e)=>

setEditingMember({

...editingMember,

name:e.target.value

})

}

/>





<input

value={editingMember.email}

onChange={(e)=>

setEditingMember({

...editingMember,

email:e.target.value

})

}

/>





<select

value={editingMember.role}

onChange={(e)=>

setEditingMember({

...editingMember,

role:e.target.value

})

}

>


<option>
Feature Manager
</option>


<option>
Backend Developer
</option>


<option>
Frontend Developer
</option>


<option>
QA Engineer
</option>


</select>







<div className="modal-actions">


<button

className="cancel-btn"

onClick={()=>setShowEditModal(false)}

>

Cancel

</button>





<button

className="save-btn"

onClick={updateMember}

>

Save Changes

</button>



</div>



</div>


</div>


}





{/* =====================
        DELETE MODAL
===================== */}



{
showDeleteModal &&


<div className="modal-overlay">


<div className="modal delete-modal">



<h2>
Delete Member
</h2>





<p>

Are you sure you want to delete

<strong>

{" "}

{memberToDelete?.name}

</strong>

?

</p>





<div className="modal-actions">


<button

className="cancel-btn"

onClick={()=>setShowDeleteModal(false)}

>

Cancel

</button>





<button

className="confirm-delete-btn"

onClick={deleteMember}

>

Delete

</button>



</div>



</div>


</div>


}





</div>

);

}
