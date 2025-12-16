from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router

app = FastAPI(
    title="Sublify API",
    description="Backend for Sublify Subtitle Downloader",
    version="2.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:4321",
    "http://localhost:3000",
    "*"  # Allow all for local dev ease, restrict in prod
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Sublify Backend",
        "version": "2.0.0",
        "docs": "/docs"
    }
