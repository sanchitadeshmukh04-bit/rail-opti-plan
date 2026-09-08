# RailOpt AI Backend

FastAPI backend for the RailOpt AI railway maintenance planning system.

## Features

- Health API
- Asset failure-risk prediction
- Maintenance block optimization
- Train movement conflict detection
- Resource conflict detection
- REST API for React frontend

## Setup

Open a terminal inside the backend folder.

Create a virtual environment:

Windows:

    python -m venv venv

Activate it:

    venv\Scripts\activate

Install dependencies:

    pip install -r requirements.txt

Run the server:

    uvicorn main:app --reload --port 8000

## API

Health:

    GET /api/health

Risk prediction:

    POST /api/predict-risk

Optimization:

    POST /api/optimize

Interactive API documentation:

    http://127.0.0.1:8000/docs