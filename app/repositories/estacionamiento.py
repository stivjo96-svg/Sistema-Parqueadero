from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.estacionamiento import Estacionamiento


class EstacionamientoRepository:

    def crear(
        self,
        db: Session,
        estacionamiento: Estacionamiento
    ) -> Estacionamiento:

        db.add(estacionamiento)
        db.commit()
        db.refresh(estacionamiento)

        return estacionamiento

    def listar(
        self,
        db: Session
    ) -> list[Estacionamiento]:

        resultado = db.execute(
            select(Estacionamiento).where(
                Estacionamiento.estado == "ACTIVO"
            )
        )

        return list(resultado.scalars().all())

    def buscar_por_id(
        self,
        db: Session,
        estacionamiento_id: int
    ) -> Estacionamiento | None:

        return db.get(
            Estacionamiento,
            estacionamiento_id
        )

    def actualizar(
        self,
        db: Session,
        estacionamiento: Estacionamiento
    ) -> Estacionamiento:

        db.commit()
        db.refresh(estacionamiento)

        return estacionamiento