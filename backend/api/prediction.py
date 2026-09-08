from fastapi import APIRouter

from models.schemas import (
    PredictionRequest,
    PredictionResponse,
    RiskPrediction,
)

from ml.failure_prediction import predict_asset


router = APIRouter(tags=["AI / ML"])


@router.post(
    "/predict-risk",
    response_model=PredictionResponse,
)
def predict_risk(request: PredictionRequest):

    predictions = [
        RiskPrediction(**predict_asset(asset.model_dump()))
        for asset in request.assets
    ]

    return PredictionResponse(
        predictions=predictions
    )