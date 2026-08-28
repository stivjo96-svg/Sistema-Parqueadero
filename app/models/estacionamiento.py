from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Numeric, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Estacionamiento(Base):
    __tablename__ = "estacionamientos"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )

    placa: Mapped[str] = mapped_column(
        String(10),
        nullable=False
    )

    fecha_hora_entrada: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False
    )

    fecha_hora_salida: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )

    monto: Mapped[Decimal | None] = mapped_column(
        Numeric(10, 2),
        nullable=True
    )

    estado: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )