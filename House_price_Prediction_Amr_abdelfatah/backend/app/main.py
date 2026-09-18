# Amr Abdelfatah Mahmoud Abdelmonem
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.prediction import router as prediction_router
from app.core.config import settings
from app.services.inference import model_registry
from app.utils.logging_config import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Loading model from %s", settings.MODEL_PATH)
    model_registry.load(settings.MODEL_PATH)
    yield
    logger.info("Shutting down")


app = FastAPI(title="House Price Prediction API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction_router)
