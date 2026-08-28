from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.estacionamiento import (
    EstacionamientoCreate,
    EstacionamientoResponse
)
from app.services.estacionamiento import EstacionamientoService


router = APIRouter(
    prefix="/estacionamientos",
    tags=["Estacionamientos"]
)

service = EstacionamientoService()


@router.post(
    "/",
    response_model=EstacionamientoResponse
)
def registrar_entrada(
    datos: EstacionamientoCreate,
    db: Session = Depends(get_db)
):
    return service.registrar_entrada(
        db,
        datos.placa
    )


@router.get(
    "/",
    response_model=list[EstacionamientoResponse]
)
def listar_estacionamientos(
    db: Session = Depends(get_db)
):
    return service.listar(db)

@router.post(
    "/{estacionamiento_id}/salida",
    response_model=EstacionamientoResponse
)
def registrar_salida(
    estacionamiento_id: int,
    db: Session = Depends(get_db)
):
    try:
        return service.registrar_salida(
            db,
            estacionamiento_id
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )