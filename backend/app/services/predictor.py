from pathlib import Path

import joblib
import pandas as pd


class Predictor:
    """Loads XGBoost model and predicts candidate match probability."""

    def __init__(self):

        model_dir = (
            Path(__file__).resolve().parent.parent
            / "models"
        )

        self.model = joblib.load(
            model_dir / "xgboost_model.pkl"
        )

        self.feature_columns = joblib.load(
            model_dir / "feature_columns.pkl"
        )

    # -----------------------------------------------------

    def _build_dataframe(
        self,
        features: dict
    ) -> pd.DataFrame:

        missing = [
            column
            for column in self.feature_columns
            if column not in features
        ]

        if missing:

            raise ValueError(
                f"Missing feature(s): {missing}"
            )

        dataframe = pd.DataFrame(
            [
                {
                    column: features[column]
                    for column in self.feature_columns
                }
            ]
        )

        return dataframe

    # -----------------------------------------------------

    def predict(
        self,
        features: dict
    ) -> dict:

        dataframe = self._build_dataframe(
            features
        )

        probability = float(

            self.model.predict_proba(
                dataframe
            )[0][1]

        )

        prediction = int(

            self.model.predict(
                dataframe
            )[0]

        )

        return {

            "prediction": prediction,

            "match_probability": round(
                probability,
                4
            ),

            "recommendation": (
                "Recommended"
                if prediction == 1
                else "Not Recommended"
            )
        }