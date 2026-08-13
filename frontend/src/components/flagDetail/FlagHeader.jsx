import React from "react";
import { FaArrowLeft, FaFlag } from "react-icons/fa";
import { useTranslation } from "react-i18next";


function FlagHeader({
    flag,
    navigate
}) {


    const { t } = useTranslation();


    return (

        <div className="detail-header">


            <div className="header-left">


                <div className="detail-header-icon">

                    <FaFlag />

                </div>



                <div className="header-info">


                    <h1>

                        {flag.flag_key}

                    </h1>



                    <p>

                        {t("flagDetail.headerDescription")}

                    </p>


                </div>


            </div>





            <div className="header-right">



                <span
                    className={
                        flag.enabled
                        ?
                        "status-pill enabled"
                        :
                        "status-pill disabled"
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




                <button

                    className="back-btn"

                    onClick={()=>navigate(-1)}

                >

                    <FaArrowLeft />

                    {t("flagDetail.back")}


                </button>



            </div>



        </div>

    );

}


export default FlagHeader;