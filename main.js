// ## Objetivos Específicos

// - Declarar variables, constantes y arrays.
// - Crear funciones que generen interacción con el usuario.
// - Implementar ciclos de iteración y condicionales necesarios para el funcionamiento del simulador.
// - Utilizar la consola de JavaScript y cuadros de diálogo (`Prompt`, `Confirm`, `Alert`).
//   Este proyecto se enfocara de la cotizacion de productos o servicios, facturacion y simulacion de inversiones 



// Clase para manejar las cotizaciones
class CotizadorMonedas {
    constructor() {
        this.cotizaciones = {};
        this.historial = [];
    }

    async inicializar() {
        try {
            const response = await fetch('./data/cotizaciones.json');
            const data = await response.json();
            this.cotizaciones = data.cotizaciones;
            this.historial = data.historial;
            this.mostrarUltimasActualizaciones();
        } catch (error) {
            console.error('Error al cargar las cotizaciones:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar las cotizaciones'
            });
        }
    }

    calcularCotizacion(moneda, cantidad) {
        const cotizacion = this.cotizaciones[moneda];
        if (!cotizacion) return null;
        
        const resultado = cantidad * cotizacion.valor;
        this.guardarEnHistorial(moneda, cantidad, resultado);
        return {
            ...cotizacion,
            cantidadOriginal: cantidad,
            resultado: resultado
        };
    }

    guardarEnHistorial(moneda, cantidad, resultado) {
        const cotizacion = {
            fecha: new Date().toISOString(),
            moneda: this.cotizaciones[moneda].nombre,
            cantidad: cantidad,
            resultado: resultado
        };
        this.historial.unshift(cotizacion);
        if (this.historial.length > 10) this.historial.pop();
        
        localStorage.setItem('historialCotizaciones', JSON.stringify(this.historial));
        this.mostrarHistorial();
    }

    mostrarUltimasActualizaciones() {
        const cotizacionesDiv = document.createElement('div');
        cotizacionesDiv.className = 'cotizaciones-actuales';
        cotizacionesDiv.innerHTML = Object.values(this.cotizaciones)
            .map(c => `
                <div class="cotizacion-item">
                    <h3>${c.nombre}</h3>
                    <p>Valor: $${c.valor}</p>
                    <p class="variacion ${c.variacion.startsWith('+') ? 'positiva' : 'negativa'}">
                        ${c.variacion}
                    </p>
                </div>
            `).join('');
        
        const mainSection = document.querySelector('main section');
        mainSection.insertBefore(cotizacionesDiv, document.getElementById('cotizacionForm'));
    }

    mostrarHistorial() {
        const historialDiv = document.getElementById('historial');
        if (!historialDiv) return;

        historialDiv.innerHTML = `
            <h3>Últimas Cotizaciones</h3>
            <ul>
                ${this.historial.map(h => `
                    <li>
                        ${h.moneda}: ${h.cantidad} = $${h.resultado}
                        <small>(${new Date(h.fecha).toLocaleString()})</small>
                    </li>
                `).join('')}
            </ul>
        `;
    }
}

// Inicialización
document.addEventListener("DOMContentLoaded", async () => {
    const cotizador = new CotizadorMonedas();
    await cotizador.inicializar();

    const cotizacionForm = document.getElementById("cotizacionForm");
    const resultadoDiv = document.getElementById("resultado");

    // Cargar último valor usado
    const ultimaCotizacion = localStorage.getItem('ultimaCotizacion');
    if (ultimaCotizacion) {
        const { moneda, cantidad } = JSON.parse(ultimaCotizacion);
        document.getElementById('moneda').value = moneda;
        document.getElementById('cantidad').value = cantidad;
    }

    cotizacionForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const moneda = document.getElementById("moneda").value;
        const cantidad = Number(document.getElementById("cantidad").value);        if (!cantidad || cantidad <= 0) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor ingrese una cantidad válida'
            });
            return;
        }

        const resultado = cotizador.calcularCotizacion(moneda, cantidad);
        
        if (!resultado) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Moneda no válida'
            });
            return;
        }

        // Guardar en localStorage
        localStorage.setItem("ultimaCotizacion", JSON.stringify({
            moneda,
            cantidad
        }));

        // Mostrar resultado con animación
        resultadoDiv.innerHTML = `
            <div class="resultado-cotizacion">
                <h3>Resultado de la Cotización</h3>
                <p>Moneda: ${resultado.nombre}</p>
                <p>Cantidad: ${resultado.cantidadOriginal}</p>
                <p>Cotización actual: $${resultado.valor}</p>
                <p class="resultado-final">Total: $${resultado.resultado}</p>
                <p class="variacion ${resultado.variacion.startsWith('+') ? 'positiva' : 'negativa'}">
                    Variación: ${resultado.variacion}
                </p>
                <small>Última actualización: ${new Date(resultado.ultimaActualizacion).toLocaleString()}</small>
            </div>
        `;
    });
});