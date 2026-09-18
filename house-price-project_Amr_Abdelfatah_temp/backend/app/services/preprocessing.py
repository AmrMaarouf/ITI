# Amr Abdelfatah Mahmoud Abdelmonem
import json

import pandas as pd

from app.core.config import settings
from app.schemas.prediction import PredictionRequest

try:
    with open(settings.LOCATIONS_PATH) as f:
        ALLOWED_LOCATIONS = set(json.load(f))
except FileNotFoundError:
    ALLOWED_LOCATIONS = set()


def request_to_dataframe(payload: PredictionRequest) -> pd.DataFrame:
    location_grouped = payload.location if payload.location in ALLOWED_LOCATIONS else "other"

    row = {
        "carpet_area_sqft": payload.carpet_area_sqft,
        "floor_num": payload.floor_num,
        "bathroom": payload.bathroom,
        "balcony": payload.balcony,
        "location_grouped": location_grouped,
        "Furnishing": payload.furnishing,
        "Transaction": payload.transaction,
        "Ownership": payload.ownership,
        "facing": payload.facing,
    }
    return pd.DataFrame([row])
