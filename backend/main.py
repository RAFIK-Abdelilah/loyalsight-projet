from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routes.clients import router as clients_router
from routes.points import router as points_router
from routes.rgpd import router as rgpd_router

app = FastAPI(
    title="LoyalSight API",
    description="API de gestion du programme de fidélité client",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def gestionnaire_http(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "message": exc.detail},
    )


app.include_router(clients_router, prefix="/api/clients", tags=["Clients"])
app.include_router(points_router, prefix="/api/points", tags=["Points"])
app.include_router(rgpd_router, prefix="/api/rgpd", tags=["RGPD"])


@app.get("/")
def accueil():
    return {"success": True, "data": None, "message": "LoyalSight API opérationnelle"}
