from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.estacionamientos import router as estacionamientos_router


app = FastAPI(
    title="Sistema de Parqueadero",
    description="API REST para la gestión de un parqueadero",
    version="1.0.0"
)


# Permitir la comunicación entre el frontend y la API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Registrar las rutas de estacionamientos
app.include_router(estacionamientos_router)


@app.get("/")
def inicio():
    return {
        "mensaje": "API del Sistema de Parqueadero funcionando"
    }