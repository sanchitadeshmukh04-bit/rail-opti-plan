from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from xgboost import XGBClassifier


BASE_DIR = Path(__file__).resolve().parent

DATA_FILE = BASE_DIR / "training_data.csv"
MODEL_FILE = BASE_DIR / "failure_model.pkl"


def train_model():
    print("Loading training data...")

    df = pd.read_csv(DATA_FILE)

    features = [
        "condition",
        "criticality",
        "availability",
        "failureRisk",
        "km",
    ]

    target = "failed"

    X = df[features]
    y = df[target]

    categorical_features = [
        "condition",
        "criticality",
    ]

    numerical_features = [
        "availability",
        "failureRisk",
        "km",
    ]

    preprocessor = ColumnTransformer(
        transformers=[
            (
                "categorical",
                OneHotEncoder(handle_unknown="ignore"),
                categorical_features,
            ),
            (
                "numerical",
                "passthrough",
                numerical_features,
            ),
        ]
    )

    X_processed = preprocessor.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_processed,
        y,
        test_size=0.25,
        random_state=42,
        stratify=y,
    )

    model = XGBClassifier(
        n_estimators=100,
        max_depth=3,
        learning_rate=0.08,
        subsample=0.9,
        colsample_bytree=0.9,
        objective="binary:logistic",
        eval_metric="logloss",
        random_state=42,
    )

    print("Training XGBoost model...")

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)

    print()
    print("Model training completed.")
    print(f"Test accuracy: {accuracy:.2%}")
    print()
    print("Classification report:")
    print(classification_report(y_test, predictions, zero_division=0))

    model_package = {
        "model": model,
        "preprocessor": preprocessor,
        "features": features,
    }

    joblib.dump(model_package, MODEL_FILE)

    print()
    print(f"Model saved to:")
    print(MODEL_FILE)


if __name__ == "__main__":
    train_model()