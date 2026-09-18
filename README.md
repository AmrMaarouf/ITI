<!-- Amr Abdelfatah Mahmoud Abdelmonem -->
# House Price Prediction — End-to-End ML Web App

An end-to-end machine learning product: a Jupyter notebook that cleans a messy real-estate
dataset and trains a regression model, a FastAPI backend that serves the model, and a
React + TypeScript frontend where a user enters property details and gets a predicted price.

## Overview

1. `notebooks/house_price_model.ipynb` loads the raw dataset, cleans it, engineers features,
   trains and compares several regression models, and exports the winning model as a
   scikit-learn `Pipeline` (`house_price.pkl`).
2. `backend/` is a FastAPI service that loads that pipeline once at startup and exposes it
   through a `/predict` endpoint.
3. `frontend/` is a React + TypeScript (Vite) single-page app with a form that calls the
   backend and shows the predicted price.

## Architecture

```
 ┌────────────┐      HTTP (JSON)      ┌────────────────┐      joblib.load      ┌──────────────────┐
 │   React    │  ───────────────────▶ │    FastAPI      │ ────────────────────▶ │ house_price.pkl   │
 │  Frontend  │ ◀─────────────────────│    Backend      │                       │ (sklearn Pipeline) │
 └────────────┘   predicted_price     └────────────────┘                       └──────────────────┘
       ▲                                                                                 ▲
       │ reads                                                                            │ produced by
       ▼                                                                                 │
  locations.json                                                          notebooks/house_price_model.ipynb
```

## Tech stack

- **Notebook / modeling:** Python, pandas, numpy, scikit-learn, matplotlib, seaborn, joblib
- **Backend:** FastAPI, Pydantic v2, pydantic-settings, uvicorn, pytest, httpx
- **Frontend:** React 18, TypeScript, Vite, react-router-dom

## Project structure

```
house-price-project/
├── notebooks/
│   ├── data/house_prices.csv
│   ├── house_price_model.ipynb
│   ├── house_price.pkl
│   ├── locations.json
│   └── metrics.json
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/routes/prediction.py
│   │   ├── core/config.py
│   │   ├── schemas/prediction.py
│   │   ├── services/preprocessing.py
│   │   ├── services/inference.py
│   │   └── utils/logging_config.py
│   ├── models/house_price.pkl
│   ├── models/locations.json
│   ├── tests/test_prediction.py
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/predictionClient.ts
│   │   ├── components/PredictionForm.tsx
│   │   ├── pages/HomePage.tsx | ResultPage.tsx | NotFoundPage.tsx
│   │   ├── types/prediction.ts
│   │   ├── locations.json
│   │   └── App.tsx
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## Dataset

**House Price** by Juhi Bhojani — Kaggle:
https://www.kaggle.com/datasets/juhibhojani/house-price

> Note: `notebooks/data/house_prices.csv` in this repository is a **synthetic stand-in**
> with the same column names/format as the real Kaggle file (`Amount(in rupees)` like
> `"42 Lac"`, `Carpet Area` like `"1200 sqft"`, `Floor` like `"3 out of 10"`, etc.), used
> because this environment had no internet access to download the real dataset. Replace it
> with the real file before submitting, then re-run the notebook to regenerate the model.

### Download the real dataset

**Option A — manual:** open the dataset page, click **Download**, unzip, and place the CSV
at `notebooks/data/house_prices.csv`.

**Option B — Kaggle CLI:**

```bash
pip install kaggle
# Get your API token: Kaggle → Settings → API → "Create New Token"
# Place kaggle.json in ~/.kaggle/ (macOS/Linux) or C:\Users\<you>\.kaggle\ (Windows)
kaggle datasets download -d juhibhojani/house-price -p notebooks/data --unzip
```

## Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
# open http://localhost:8000/docs
```

Run the tests:

```bash
pytest
```

### Backend environment variables

| Variable        | Description                              | Default                    |
|-----------------|-------------------------------------------|-----------------------------|
| `MODEL_PATH`    | Path to the exported pipeline (.pkl)      | `models/house_price.pkl`    |
| `LOCATIONS_PATH`| Path to the allowed-locations JSON file   | `models/locations.json`     |
| `CORS_ORIGINS`  | Allowed frontend origins                  | `["http://localhost:5173"]` |

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
# open http://localhost:5173
```

### Frontend environment variables

| Variable              | Description                    | Default                  |
|------------------------|---------------------------------|---------------------------|
| `VITE_API_BASE_URL`    | Base URL of the FastAPI backend | `http://localhost:8000`  |

## API reference

### `GET /health`

```bash
curl http://localhost:8000/health
```

```json
{ "status": "ok" }
```

### `POST /predict`

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
        "location": "other",
        "carpet_area_sqft": 1200,
        "floor_num": 3,
        "bathroom": 2,
        "balcony": 1,
        "furnishing": "Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "East"
      }'
```

```json
{ "predicted_price": 8234567.12 }
```

## Model metrics (on the held-out test set, synthetic data)

| Model                      | MAE          | RMSE         | R²      |
|-----------------------------|--------------|--------------|---------|
| **LinearRegression (chosen)** | 5,530,566   | 8,366,692    | 0.307   |
| RandomForestRegressor        | 6,082,265   | 9,016,087    | 0.195   |
| GradientBoostingRegressor    | 5,571,364   | 8,464,328    | 0.291   |

`LinearRegression` was selected because it had the highest R² and the lowest RMSE/MAE on the
test set among the three models compared. Re-run the notebook on the real Kaggle dataset to
get metrics that reflect the actual data.

## Screenshots

_Add screenshots of the running form and result page here after running the app locally._

## Verifying like a stranger

```bash
git clone <your-repo-url> && cd house-price-project
# follow "Backend setup" then "Frontend setup" above, in two terminals
```
