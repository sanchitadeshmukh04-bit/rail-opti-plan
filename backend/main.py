from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.health import router as health_router
from api.prediction import router as prediction_router
from api.optimization import router as optimization_router


app = FastAPI(
    title="RailOpt AI Backend",
    description="AI-assisted railway maintenance planning and block optimization API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://rail-opti-plan.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:8081",
        "http://127.0.0.1:8081",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api")
app.include_router(prediction_router, prefix="/api")
app.include_router(optimization_router, prefix="/api")


@app.get("/")
def root():
    return {
        "name": "RailOpt AI Backend",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs",
    }