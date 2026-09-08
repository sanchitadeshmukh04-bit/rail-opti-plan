from pathlib import Path
from typing import Dict

import joblib
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent
MODEL_FILE = BASE_DIR / "failure_model.pkl"

# Load the trained XGBoost model and preprocessing pipeline
MODEL_PACKAGE = joblib.load(MODEL_FILE)

MODEL = MODEL_PACKAGE["model"]
PREPROCESSOR = MODEL_PACKAGE["preprocessor"]
FEATURES = MODEL_PACKAGE["features"]


def risk_level(score: float) -> str:
    if score >= 85:
        return "CRITICAL"

    if score >= 65:
        return "HIGH"

    if score >= 35:
        return "MEDIUM"

    return "LOW"


def predict_asset(asset: Dict) -> Dict:
    """
    Predict asset failure risk using the trained XGBoost model.
    """

    # Prepare input using the same features used during training
    data = {
        "condition": asset.get("condition", "Fair"),
        "criticality": asset.get("criticality", "Medium"),
        "availability": float(asset.get("availability", 100)),
        "failureRisk": float(asset.get("failureRisk", 40)),
        "km": float(asset.get("km", 0)),
    }

    df = pd.DataFrame([data], columns=FEATURES)

    # Apply the same preprocessing used during training
    processed = PREPROCESSOR.transform(df)

    # Predict probability of failure
    probability = float(MODEL.predict_proba(processed)[0][1])

    predicted_risk = probability * 100

    return {
        "assetId": asset["assetId"],
        "failureProbability": round(probability, 4),
        "predictedRisk": round(predicted_risk, 2),
        "riskLevel": risk_level(predicted_risk),
    }