document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cotizacionLimpiezaForm');
    const ambientesContainer = document.getElementById('ambientesContainer');
    const vidriosContainer = document.getElementById('vidriosContainer');
    const resultadoDiv = document.getElementById('resultadoLimpieza');
    const cotizador = new CleanProCotizador();

    // Configurar fecha mínima como hoy
    const fechaInput = document.getElementById('fechaServicio');
    const today = new Date();
    const fechaMinima = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
        .toISOString().split('T')[0];
    fechaInput.min = fechaMinima;

    // Guardar tipo de propiedad en localStorage
    document.getElementById('tipoPropiedad').addEventListener('change', (e) => {
        localStorage.setItem('tipoPropiedad', e.target.value);
    });

    // Agregar ambiente o vidrio
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-agregar-ambiente')) {
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
            ambientesContainer.appendChild(nuevoAmbiente);
        } else if (e.target.classList.contains('btn-agregar-vidrio')) {
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
            vidriosContainer.appendChild(nuevoVidrio);
        } else if (e.target.classList.contains('btn-eliminar')) {
            e.target.parentElement.remove();
        }
    });

    // Manejar la cotización
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const moneda = document.getElementById('monedaCotizacion').value;
        const metrosCuadrados = Number(document.getElementById('metrosCuadrados').value);
        const horasServicio = Number(document.getElementById('horasServicio').value);
        const fecha = document.getElementById('fechaServicio').value;
        const hora = document.getElementById('horaServicio').value;
        
        if (!metrosCuadrados || metrosCuadrados <= 0) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor ingrese los metros cuadrados totales'
            });
            return;
        }

        if (!fecha || !hora) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor seleccione fecha y hora para el servicio'
            });
            return;
        }

        // Limpiar cotizador
        cotizador.limpiar();
        
        try {
            // Establecer horas requeridas
            cotizador.setHorasRequeridas(horasServicio);
            
            // Establecer fecha y hora del servicio
            cotizador.setFechaHoraServicio(fecha, hora);
            
            // Agregar metros cuadrados
            cotizador.setMetrosCuadrados(metrosCuadrados);

            // Procesar ambientes
            const ambientes = document.querySelectorAll('.ambiente-item');
            for (const ambiente of ambientes) {
                const tipo = ambiente.querySelector('.ambiente-tipo').value;
                const cantidad = Number(ambiente.querySelector('.ambiente-cantidad').value);
                
                if (tipo && cantidad > 0) {
                    cotizador.agregarAmbiente(tipo, cantidad);
                }
            }

            // Procesar vidrios
            const vidrios = document.querySelectorAll('.vidrio-item');
            for (const vidrio of vidrios) {
                const ancho = Number(vidrio.querySelector('.vidrio-ancho').value);
                const alto = Number(vidrio.querySelector('.vidrio-alto').value);
                const cantidad = Number(vidrio.querySelector('.vidrio-cantidad').value);
                const unidad = vidrio.querySelector('.vidrio-unidad').value;
                
                if (ancho > 0 && alto > 0 && cantidad > 0) {
                    cotizador.agregarVidrio(ancho, alto, cantidad, unidad);
                }
            }

            // Calcular totales
            const resultado = cotizador.calcularTotal();
            const { monto: precioFinal, simbolo } = await cotizador.convertirMoneda(
                resultado.precios.total,
                moneda
            );

            // Formatear las fechas
            const formatoFecha = new Intl.DateTimeFormat('es-AR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Mostrar resultado detallado
            resultadoDiv.innerHTML = `
                <h3>Cotización del Servicio</h3>
                <div class="detalles-cotizacion">
                    <h4>Detalles del Trabajo</h4>
                    <div class="tiempo-estimado">
                        <p><strong>Tiempo Estimado según Servicios:</strong> ${resultado.detalles.tiempoEstimado.toFixed(1)} horas</p>
                        <p><strong>Tiempo Requerido por Cliente:</strong> ${resultado.detalles.tiempoRequerido.toFixed(1)} horas</p>
                        <p><strong>Tiempo Final Ajustado:</strong> ${resultado.detalles.tiempoFinal.toFixed(1)} horas</p>
                        <p><strong>Fecha del Servicio:</strong> ${formatoFecha.format(resultado.detalles.horarioServicio.inicio)}</p>
                        <p><strong>Finalización Estimada:</strong> ${formatoFecha.format(resultado.detalles.horarioServicio.fin)}</p>
                    </div>
                </div>
                <div class="detalles-cotizacion">
                    <h4>Detalles de Superficie</h4>
                    <p class="precio-item">
                        <span>Metros Cuadrados Totales: ${resultado.detalles.metrosCuadrados}m²</span>
                        <span>${resultado.detalles.tiempoMetrosCuadrados.toFixed(1)} horas</span>
                        <span>$${resultado.precios.metros.toLocaleString('es-AR')}</span>
                    </p>
                </div>
                ${resultado.detalles.ambientes.length > 0 ? `
                    <div class="detalles-cotizacion">
                        <h4>Detalles de Ambientes</h4>
                        <ul>
                            ${resultado.detalles.ambientes.map(a => `
                                <li class="precio-item">
                                    <span>${a.cantidad} ${a.tipo}(s)</span>
                                    <span>${a.tiempo.toFixed(1)} horas</span>
                                    <span>$${a.precio.toLocaleString('es-AR')}</span>
                                </li>
                            `).join('')}
                        </ul>
                        <p class="precio-item">
                            <strong>Subtotal Ambientes:</strong>
                            <span>$${resultado.precios.ambientes.toLocaleString('es-AR')}</span>
                        </p>
                    </div>
                ` : ''}
                ${resultado.detalles.vidrios.length > 0 ? `
                    <div class="detalles-cotizacion">
                        <h4>Detalles de Ventanas</h4>
                        <ul>
                            ${resultado.detalles.vidrios.map(v => `
                                <li class="precio-item">
                                    <span>${v.cantidad} ventana(s) de ${v.ancho}${v.unidad} x ${v.alto}${v.unidad} (${v.metros.toFixed(2)}m²)</span>
                                    <span>${v.tiempo.toFixed(1)} horas</span>
                                    <span>$${v.precio.toLocaleString('es-AR')}</span>
                                </li>
                            `).join('')}
                        </ul>
                        <p class="precio-item">
                            <strong>Subtotal Ventanas:</strong>
                            <span>$${resultado.precios.vidrios.toLocaleString('es-AR')}</span>
                        </p>
                    </div>
                ` : ''}
                <div class="detalles-cotizacion">
                    <p class="precio-item precio-total">
                        <strong>TOTAL:</strong>
                        <strong>${simbolo}${precioFinal.toLocaleString('es-AR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}</strong>
                    </p>
                </div>
            `;
            resultadoDiv.style.display = 'block';

            // Guardar en localStorage
            const cotizacion = {
                fecha: new Date().toISOString(),
                fechaServicio: resultado.detalles.horarioServicio.inicio,
                metrosCuadrados,
                horasRequeridas: resultado.detalles.tiempoRequerido,
                horasFinales: resultado.detalles.tiempoFinal,
                ambientes: resultado.detalles.ambientes,
                vidrios: resultado.detalles.vidrios,
                moneda,
                precioFinal
            };
            const historial = JSON.parse(localStorage.getItem('historialLimpieza') || '[]');
            historial.unshift(cotizacion);
            if (historial.length > 10) historial.pop();
            localStorage.setItem('historialLimpieza', JSON.stringify(historial));

        } catch (error) {
            console.error('Error al calcular cotización:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo calcular la cotización'
            });
        }
    });
});
