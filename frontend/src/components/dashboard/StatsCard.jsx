import "./Dashboard.css";


export default function StatsCard({

title,

value,

icon,

color,

change,

}) {


return (

<div className="stats-card">


    <div

        className="stats-icon"

        style={{
            background:color
        }}

    >

        {icon}


    </div>





    <div className="stats-content">


        <h4>

            {title}

        </h4>




        <h2>

            {value}

        </h2>




        <span>

            {change}

        </span>


    </div>



</div>

);


}