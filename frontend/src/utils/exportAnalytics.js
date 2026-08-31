export function exportAnalyticsCSV(
    analytics,
    topFlags
) {


    if (!analytics) return;




    const rows = [];




    // ===============================
    // FEATURE FLAGS
    // ===============================


    rows.push([

        "FEATURE FLAGS"

    ]);



    rows.push([

        "Feature Flag",

        "Status",

        "Rollout %",

        "Owner"

    ]);




    analytics.flags?.forEach(flag=>{


        rows.push([

            flag.key,

            flag.enabled
            ?
            "Enabled"
            :
            "Disabled",


            flag.rollout_percentage || 0,


            flag.owner_team || "-"


        ]);


    });






    rows.push([]);







    // ===============================
    // EVALUATION TREND
    // ===============================


    rows.push([

        "EVALUATION TREND"

    ]);



    rows.push([

        "Date",

        "Evaluations"

    ]);





    analytics.evaluations?.forEach(item=>{


        rows.push([

            item.date,

            item.count

        ]);


    });







    rows.push([]);






    // ===============================
    // TOP FLAGS
    // ===============================


    rows.push([

        "TOP EVALUATED FLAGS"

    ]);



    rows.push([

        "Flag",

        "Evaluations"

    ]);





    topFlags?.forEach(flag=>{


        rows.push([

            flag.flag_key,

            flag.evaluations

        ]);


    });








    const csv = rows

        .map(row=>row.join(","))

        .join("\n");







    const blob = new Blob(

        [csv],

        {

            type:

            "text/csv;charset=utf-8;"

        }

    );






    const url =

    URL.createObjectURL(blob);





    const link =

    document.createElement("a");





    link.href = url;



    link.download =

    "featureflow-analytics.csv";





    document.body.appendChild(link);



    link.click();




    document.body.removeChild(link);



    URL.revokeObjectURL(url);


}
