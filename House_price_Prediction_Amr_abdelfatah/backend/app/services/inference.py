# Amr Abdelfatah Mahmoud Abdelmonem
import joblib
import pandas as pd


class ModelRegistry:
    def __init__(self):
        self._model = None

    def load(self, path: str) -> None:
        self._model = joblib.load(path)

    @property
    def model(self):
        if self._model is None:
            raise RuntimeError("Model is not loaded yet")
        return self._model

    def predict(self, df: pd.DataFrame) -> float:
        prediction = self.model.predict(df)
        return float(prediction[0])


model_registry = ModelRegistry()
