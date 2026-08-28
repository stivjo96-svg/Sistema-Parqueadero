from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class EstacionamientoCreate(BaseModel):
    placa: str


class EstacionamientoResponse(BaseModel):
    id: int
    placa: str
    fecha_hora_entrada: datetime
    fecha_hora_salida: datetime | None
    monto: Decimal | None
    estado: str

    model_config = ConfigDict(from_attributes=True)