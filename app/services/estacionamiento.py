from datetime import datetime
import math

from sqlalchemy.orm import Session

from app.models.estacionamiento import Estacionamiento
from app.repositories.estacionamiento import EstacionamientoRepository


class EstacionamientoService:

    def __init__(self):
        self.repository = EstacionamientoRepository()

    def registrar_entrada(
        self,
        db: Session,
        placa: str
    ) -> Estacionamiento:

        estacionamiento = Estacionamiento(
            placa=placa,
            fecha_hora_entrada=datetime.now(),
            estado="ACTIVO"
        )

        return self.repository.crear(
            db,
            estacionamiento
        )

    def listar(
        self,
        db: Session
    ) -> list[Estacionamiento]:

        return self.repository.listar(db)

    def registrar_salida(
        self,
        db: Session,
        estacionamiento_id: int
    ) -> Estacionamiento:

        estacionamiento = self.repository.buscar_por_id(
            db,
            estacionamiento_id
        )

        if estacionamiento is None:
            raise ValueError("Estacionamiento no encontrado")

        if estacionamiento.estado != "ACTIVO":
            raise ValueError("El vehículo ya tiene registrada su salida")

        fecha_salida = datetime.now()

        tiempo_transcurrido = (
            fecha_salida - estacionamiento.fecha_hora_entrada
        )

        horas = tiempo_transcurrido.total_seconds() / 3600

        fracciones = math.ceil(horas)

        monto = fracciones * 0.50

        estacionamiento.fecha_hora_salida = fecha_salida
        estacionamiento.monto = monto
        estacionamiento.estado = "FINALIZADO"

        return self.repository.actualizar(
            db,
            estacionamiento
        )