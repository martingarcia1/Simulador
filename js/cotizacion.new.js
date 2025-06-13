// Funciones de ayuda
function crearAmbiente() {
    const nuevoAmbiente = document.createElement('div');
    nuevoAmbiente.className = 'ambiente-item';
    nuevoAmbiente.innerHTML = `
        <select class="ambiente-tipo">
            <option value="">Seleccione ambiente</option>
            <option value="baño">Baño</option>
            <option value="cocina">Cocina</option>
            <option value="dormitorio">Dormitorio</option>
            <option value="living">Living</option>
            <option value="oficina">Oficina</option>
            <option value="consultorio">Consultorio</option>
            <option value="sala_espera">Sala de Espera</option>
        </select>
        <input type="number" class="ambiente-cantidad" min="1" value="1">
        <button type="button" class="btn-eliminar">-</button>
    `;
    return nuevoAmbiente;
}

function crearVidrio() {
    const nuevoVidrio = document.createElement('div');
    nuevoVidrio.className = 'vidrio-item';
    nuevoVidrio.innerHTML = `
        <select class="vidrio-unidad">
            <option value="cm">Centímetros</option>
            <option value="m">Metros</option>
        </select>
        <input type="number" class="vidrio-ancho" placeholder="Ancho" min="1" step="0.01">
        <input type="number" class="vidrio-alto" placeholder="Alto" min="1" step="0.01">
        <input type="number" class="vidrio-cantidad" placeholder="Cantidad" min="1" value="1">
        <button type="button" class="btn-eliminar">-</button>
    `;
    return nuevoVidrio;
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Cargado');
    
    // Referencias a elementos del DOM
    const form = document.getElementById('cotizacionLimpiezaForm');
    const ambientesContainer = document.getElementById('ambientesContainer');
    const vidriosContainer = document.getElementById('vidriosContainer');
    const resultadoDiv = document.getElementById('resultadoLimpieza');
    const cotizador = new CleanProCotizador();

    console.log('Elementos encontrados:', {
        form: !!form,
        ambientesContainer: !!ambientesContainer,
        vidriosContainer: !!vidriosContainer
    });

    // Event handlers para agregar elementos
    const btnAgregarAmbiente = document.getElementById('btnAgregarAmbiente');
    if (btnAgregarAmbiente) {
        console.log('Botón agregar ambiente encontrado');
        btnAgregarAmbiente.onclick = () => {
            console.log('Agregando ambiente');
            ambientesContainer.appendChild(crearAmbiente());
        };
    }

    const btnAgregarVidrio = document.getElementById('btnAgregarVidrio');
    if (btnAgregarVidrio) {
        console.log('Botón agregar vidrio encontrado');
        btnAgregarVidrio.onclick = () => {
            console.log('Agregando vidrio');
            vidriosContainer.appendChild(crearVidrio());
        };
    }

    // Event handler para eliminar elementos
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-eliminar')) {
            console.log('Eliminando elemento');
            const item = e.target.closest('.ambiente-item, .vidrio-item');
            if (item) item.remove();
        }
    });

    // Manejar el envío del formulario
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            
            // Obtener datos de ambientes
            const ambientes = [];
            document.querySelectorAll('.ambiente-item').forEach(item => {
                const tipo = item.querySelector('.ambiente-tipo').value;
                const cantidad = Number(item.querySelector('.ambiente-cantidad').value);
                if (tipo && cantidad) {
                    const precioUnitario = cotizador.calcularPrecioAmbiente(tipo);
                    ambientes.push({
                        tipo,
                        cantidad,
                        precioUnitario,
                        subtotal: precioUnitario * cantidad
                    });
                }
            });

            // Obtener datos de vidrios
            const vidrios = [];
            document.querySelectorAll('.vidrio-item').forEach(item => {
                const unidad = item.querySelector('.vidrio-unidad').value;
                const ancho = Number(item.querySelector('.vidrio-ancho').value);
                const alto = Number(item.querySelector('.vidrio-alto').value);
                const cantidad = Number(item.querySelector('.vidrio-cantidad').value);
                if (ancho && alto && cantidad) {
                    const precioUnitario = cotizador.calcularPrecioVidrio(ancho, alto, unidad);
                    vidrios.push({
                        unidad,
                        ancho,
                        alto,
                        cantidad,
                        precioUnitario,
                        subtotal: precioUnitario * cantidad
                    });
                }
            });

            // Calcular subtotal
            const subtotal = [...ambientes, ...vidrios].reduce((sum, item) => sum + item.subtotal, 0);

            // Guardar datos de la cotización
            const cotizacionData = {
                ambientes,
                vidrios,
                subtotal,
                fecha: new Date().toISOString()
            };

            // Guardar datos del cliente
            const datosCliente = {
                nombre: document.getElementById('nombreCliente')?.value || '',
                tipoDocumento: document.getElementById('tipoDocumento')?.value || '',
                numeroDocumento: document.getElementById('numeroDocumento')?.value || '',
                direccion: document.getElementById('direccionCliente')?.value || '',
                tipoFactura: document.getElementById('tipoFactura')?.value || ''
            };

            // Guardar en localStorage
            localStorage.setItem('cotizacionActual', JSON.stringify(cotizacionData));
            localStorage.setItem('datosCliente', JSON.stringify(datosCliente));

            // Redirigir a la página de facturación
            window.location.href = 'facturacion.html';
        };
    }
});
