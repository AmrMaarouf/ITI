# Amr Abdelfatah Mahmoud Abdelmonem
from fastapi import APIRouter

from app.schemas.prediction import HealthResponse, PredictionRequest, PredictionResponse
from app.services.inference import model_registry
from app.services.preprocessing import request_to_dataframe

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(status="ok")


@router.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest):
    df = request_to_dataframe(payload)
    price = model_registry.predict(df)
    return PredictionResponse(predicted_price=price)
