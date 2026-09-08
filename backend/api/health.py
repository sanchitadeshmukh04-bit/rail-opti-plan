from fastapi import APIRouter


router = APIRouter(tags=["System"])


@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "RailOpt AI Backend",
        "message": "Backend API is running successfully",
    }