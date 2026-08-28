const API_URL = "http://127.0.0.1:8000";


// ==========================================
// CARGAR VEHÍCULOS ESTACIONADOS
// ==========================================

async function cargarVehiculos() {

    try {

        const respuesta = await fetch(
            `${API_URL}/estacionamientos/`
        );

        if (!respuesta.ok) {
            throw new Error("Error al consultar los vehículos");
        }

        const vehiculos = await respuesta.json();

        mostrarVehiculos(vehiculos);

    } catch (error) {

        console.error("Error:", error);

        const lista = document.getElementById("listaVehiculos");

        lista.innerHTML = `
            <p class="error">
                No se pudieron cargar los vehículos.
            </p>
        `;
    }
}


// ==========================================
// FORMATEAR FECHA Y HORA
// ==========================================

function formatearFechaHora(fecha) {

    if (!fecha) {
        return "-";
    }

    const fechaObj = new Date(fecha);

    if (isNaN(fechaObj.getTime())) {
        return fecha;
    }

    return fechaObj.toLocaleString("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}


// ==========================================
// CALCULAR TIEMPO ESTACIONADO
// ==========================================

function calcularTiempo(fechaEntrada) {

    const entrada = new Date(fechaEntrada);
    const ahora = new Date();

    if (isNaN(entrada.getTime())) {
        return "-";
    }

    let diferencia = ahora - entrada;

    if (diferencia < 0) {
        diferencia = 0;
    }

    const totalMinutos = Math.floor(diferencia / 60000);

    const dias = Math.floor(totalMinutos / 1440);

    const horas = Math.floor(
        (totalMinutos % 1440) / 60
    );

    const minutos = totalMinutos % 60;

    let resultado = "";

    if (dias > 0) {
        resultado += `${dias} día${dias !== 1 ? "s" : ""} `;
    }

    if (horas > 0) {
        resultado += `${horas} h `;
    }

    resultado += `${minutos} min`;

    return resultado.trim();
}


// ==========================================
// MOSTRAR VEHÍCULOS
// ==========================================

function mostrarVehiculos(vehiculos) {

    const lista = document.getElementById("listaVehiculos");

    lista.innerHTML = "";

    if (vehiculos.length === 0) {

        lista.innerHTML = `
            <div class="sin-vehiculos">
                <p>🚗 No hay vehículos estacionados actualmente.</p>
            </div>
        `;

        return;
    }


    vehiculos.forEach(vehiculo => {

        const elemento = document.createElement("div");

        elemento.classList.add("vehiculo");


        elemento.innerHTML = `
            <div class="vehiculo-info">

                <div class="vehiculo-placa">
                    ${vehiculo.placa}
                </div>

                <div class="vehiculo-detalle">
                    <strong>Entrada:</strong>
                    ${formatearFechaHora(
                        vehiculo.fecha_hora_entrada
                    )}
                </div>

                <div class="vehiculo-detalle">
                    <strong>Tiempo:</strong>
                    <span class="tiempo-estacionado"
                          data-entrada="${vehiculo.fecha_hora_entrada}">
                        ${calcularTiempo(
                            vehiculo.fecha_hora_entrada
                        )}
                    </span>
                </div>

                <div class="vehiculo-estado">
                    <span class="estado-activo">
                        ● Estacionado
                    </span>
                </div>

            </div>

            <button
                class="btn-salida"
                onclick="registrarSalida(${vehiculo.id})">
                Registrar salida
            </button>
        `;


        lista.appendChild(elemento);

    });


    // Iniciar actualización del tiempo
    actualizarTiempos();
}


// ==========================================
// ACTUALIZAR TIEMPOS
// ==========================================

function actualizarTiempos() {

    const tiempos = document.querySelectorAll(
        ".tiempo-estacionado"
    );

    tiempos.forEach(elemento => {

        const entrada = elemento.dataset.entrada;

        elemento.textContent = calcularTiempo(entrada);

    });
}


// Actualizar el tiempo cada minuto
setInterval(actualizarTiempos, 60000);


// ==========================================
// REGISTRAR INGRESO
// ==========================================

async function registrarIngreso(event) {

    event.preventDefault();

    const placaInput = document.getElementById("placa");
    const mensaje = document.getElementById("mensaje");

    const placa = placaInput.value.trim();


    if (placa === "") {

        mensaje.textContent =
            "Por favor, ingrese la placa.";

        return;
    }


    try {

        const respuesta = await fetch(
            `${API_URL}/estacionamientos/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    placa: placa
                })
            }
        );


        if (!respuesta.ok) {

            const error = await respuesta.json();

            throw new Error(
                error.detail ||
                "No se pudo registrar el ingreso"
            );
        }


        const vehiculo = await respuesta.json();


        mensaje.textContent =
            `Vehículo ${vehiculo.placa} registrado correctamente.`;


        placaInput.value = "";


        // Actualizar la lista automáticamente
        cargarVehiculos();


    } catch (error) {

        console.error("Error:", error);

        mensaje.textContent = error.message;
    }
}


// ==========================================
// REGISTRAR SALIDA
// ==========================================

async function registrarSalida(estacionamientoId) {

    try {

        const respuesta = await fetch(
            `${API_URL}/estacionamientos/${estacionamientoId}/salida`,
            {
                method: "POST"
            }
        );


        if (!respuesta.ok) {

            const error = await respuesta.json();

            throw new Error(
                error.detail ||
                "No se pudo registrar la salida"
            );
        }


        const vehiculo = await respuesta.json();


        alert(
            `Salida registrada correctamente.\n\n` +
            `Placa: ${vehiculo.placa}\n` +
            `Monto a pagar: $${Number(vehiculo.monto).toFixed(2)}`
        );


        // Actualizar la lista sin recargar la página
        cargarVehiculos();


    } catch (error) {

        console.error("Error:", error);

        alert(error.message);
    }
}


// ==========================================
// EVENTO DEL FORMULARIO
// ==========================================

document
    .getElementById("formIngreso")
    .addEventListener(
        "submit",
        registrarIngreso
    );


// ==========================================
// INICIAR LA PÁGINA
// ==========================================

cargarVehiculos();