from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db

from app.models.flag import Flag
from app.models.cleanup_review import CleanupReview


router = APIRouter(
    prefix="/cleanup",
    tags=["Cleanup"],
)



# ==============================
# Get Cleanup Suggestions
# ==============================

@router.get("/")
def get_cleanup_suggestions(
    db: Session = Depends(get_db),
):

    flags = db.query(Flag).all()

    suggestions = []


    for flag in flags:


        reviewed = (
            db.query(CleanupReview)
            .filter(
                CleanupReview.flag_key == flag.flag_key
            )
            .first()
        )


        if (
            flag.rollout_percentage == 100
            or not flag.enabled
        ):


            suggestions.append(

                {

                    "flag_key":
                    flag.flag_key,


                    "owner_team":
                    flag.owner_team,


                    "environment":
                    "Production",


                    "issue":
(
    "Feature fully rolled out. Safe to remove."
    if flag.rollout_percentage == 100

    else

    "Flag is disabled. Consider cleanup."
),


                    "status":

                    (
                        "Fully Rolled Out"

                        if flag.rollout_percentage == 100

                        else "Disabled"
                    ),



                    "rollout_percentage":
                    flag.rollout_percentage,



                    "reviewed":
                    reviewed is not None,



                    "reviewed_at":

                    reviewed.reviewed_at.isoformat()

                    if reviewed and reviewed.reviewed_at

                    else None

                }

            )


    return suggestions





# ==============================
# Mark Flag As Reviewed
# ==============================

@router.post("/review/{flag_key}")
def mark_as_reviewed(

    flag_key: str,

    db: Session = Depends(get_db),

):


    existing = (

        db.query(CleanupReview)

        .filter(
            CleanupReview.flag_key == flag_key
        )

        .first()

    )


    if existing:

        return {

            "message":
            "Already reviewed",

            "reviewed":
            True,

            "reviewed_at":
            existing.reviewed_at.isoformat()

            if existing.reviewed_at

            else None

        }




    review = CleanupReview(

        flag_key=flag_key

    )


    db.add(review)

    db.commit()

    db.refresh(review)



    return {

        "message":
        "Flag marked as reviewed",


        "flag_key":
        flag_key,


        "reviewed":
        True,


        "reviewed_at":
        review.reviewed_at.isoformat()

        if review.reviewed_at

        else None

    }