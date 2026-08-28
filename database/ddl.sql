CREATE DATABASE IF NOT EXISTS parqueadero;

USE parqueadero;

CREATE TABLE IF NOT EXISTS estacionamientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(10) NOT NULL,
    fecha_hora_entrada DATETIME NOT NULL,
    fecha_hora_salida DATETIME NULL,
    monto DECIMAL(10,2) NULL,
    estado VARCHAR(20) NOT NULL
);