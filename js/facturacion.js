document.addEventListener('DOMContentLoaded', () => {
    // Recuperar datos de la cotización del localStorage
    const cotizacionData = JSON.parse(localStorage.getItem('cotizacionActual'));
    const datosCliente = JSON.parse(localStorage.getItem('datosCliente'));

    if (!cotizacionData || !datosCliente) {
        Swal.fire({
            title: 'Error',
            text: 'No hay datos de cotización disponibles',
            icon: 'error',
            confirmButtonText: 'Volver a Servicios'
        }).then(() => {
            window.location.href = 'servicios.html';
        });
        return;
    }

    // Actualizar tipo de factura
    const facturaLetra = document.getElementById('facturaLetra');
    facturaLetra.textContent = datosCliente.tipoFactura || 'B';

    // Actualizar datos del cliente
    document.getElementById('clienteNombre').textContent = `Nombre: ${datosCliente.nombre}`;
    document.getElementById('clienteDocumento').textContent = `${datosCliente.tipoDocumento}: ${datosCliente.numeroDocumento}`;
    document.getElementById('clienteDireccion').textContent = `Dirección: ${datosCliente.direccion}`;

    // Función para formatear moneda
    const formatearMoneda = (valor) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(valor);
    };

    // Mostrar detalles del servicio
    const detallesServicio = document.getElementById('detallesServicio');
    const ambientes = cotizacionData.ambientes || [];
    const vidrios = cotizacionData.vidrios || [];

    // Agregar ambientes a la factura
    ambientes.forEach(ambiente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>Limpieza de ${ambiente.tipo}</td>
            <td>${ambiente.cantidad}</td>
            <td>${formatearMoneda(ambiente.precioUnitario)}</td>
            <td>${formatearMoneda(ambiente.subtotal)}</td>
        `;
        detallesServicio.appendChild(tr);
    });

    // Agregar vidrios a la factura
    vidrios.forEach(vidrio => {
        const tr = document.createElement('tr');
        const dimension = `${vidrio.ancho}${vidrio.unidad} x ${vidrio.alto}${vidrio.unidad}`;
        tr.innerHTML = `
            <td>Limpieza de vidrio (${dimension})</td>
            <td>${vidrio.cantidad}</td>
            <td>${formatearMoneda(vidrio.precioUnitario)}</td>
            <td>${formatearMoneda(vidrio.subtotal)}</td>
        `;
        detallesServicio.appendChild(tr);
    });

    // Calcular y mostrar totales
    const subtotal = cotizacionData.subtotal;
    const iva = datosCliente.tipoFactura === 'A' ? subtotal * 0.21 : 0;
    const iibb = datosCliente.tipoFactura === 'A' ? subtotal * 0.035 : 0;
    const total = subtotal + iva + iibb;

    document.getElementById('subtotalFactura').textContent = formatearMoneda(subtotal);
    document.getElementById('ivaFactura').textContent = formatearMoneda(iva);
    document.getElementById('iibbFactura').textContent = formatearMoneda(iibb);
    document.getElementById('totalFactura').textContent = formatearMoneda(total);

    // Mostrar/ocultar impuestos según tipo de factura
    const ivaContainer = document.getElementById('ivaContainer');
    const iibbContainer = document.getElementById('iibbContainer');
    ivaContainer.style.display = datosCliente.tipoFactura === 'A' ? 'flex' : 'none';
    iibbContainer.style.display = datosCliente.tipoFactura === 'A' ? 'flex' : 'none';

    // Función para formatear números como moneda
    function formatCurrency(amount, currency = 'ARS') {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    // Función para formatear la fecha
    function formatDate(date) {
        return new Intl.DateTimeFormat('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    }

    // Función para generar un número de factura aleatorio
    function generarNumeroFactura() {
        return String(Math.floor(Math.random() * 900000) + 100000).padStart(8, '0');
    }

    // Función para cargar los datos de la factura
    function cargarDatosFactura() {
        // Recuperar datos del localStorage
        const datosFactura = JSON.parse(localStorage.getItem('datosFactura'));

        if (!datosFactura) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se encontraron datos para generar la factura',
                confirmButtonText: 'Volver a Servicios'
            }).then(() => {
                window.location.href = './servicios.html';
            });
            return;
        }

        // Cargar datos del cliente
        document.getElementById('nombreClienteDisplay').textContent = datosFactura.nombreCliente;
        document.getElementById('tipoDocumentoDisplay').textContent = datosFactura.tipoDocumento;
        document.getElementById('numeroDocumentoDisplay').textContent = datosFactura.numeroDocumento;
        document.getElementById('direccionClienteDisplay').textContent = datosFactura.direccionCliente;

        // Cargar tipo de factura y número
        document.getElementById('tipoFacturaDisplay').textContent = `TIPO ${datosFactura.tipoFactura}`;
        document.getElementById('numeroFactura').textContent = generarNumeroFactura();
        document.getElementById('fechaFactura').textContent = formatDate(new Date());

        // Mostrar u ocultar contenedores de impuestos según el tipo de factura
        const ivaContainer = document.getElementById('ivaContainer');
        const iibbContainer = document.getElementById('iibbContainer');

        if (datosFactura.tipoFactura === 'C') {
            ivaContainer.style.display = 'none';
            iibbContainer.style.display = 'none';
        }

        // Cargar detalles del servicio
        const detallesServicioBody = document.getElementById('detallesServicioBody');
        detallesServicioBody.innerHTML = ''; // Limpiar contenido previo

        // Agregar fila para el servicio base
        const filaServicio = document.createElement('tr');
        filaServicio.innerHTML = `
            <td>Servicio de Limpieza - ${datosFactura.tipoPropiedad}</td>
            <td>${datosFactura.horasServicio} horas</td>
            <td>${formatCurrency(datosFactura.precioBase)}</td>
            <td>${formatCurrency(datosFactura.precioBase * datosFactura.horasServicio)}</td>
        `;
        detallesServicioBody.appendChild(filaServicio);

        // Agregar filas para ambientes adicionales si existen
        if (datosFactura.ambientes && datosFactura.ambientes.length > 0) {
            datosFactura.ambientes.forEach(ambiente => {
                const filaAmbiente = document.createElement('tr');
                filaAmbiente.innerHTML = `
                    <td>Limpieza ${ambiente.tipo}</td>
                    <td>1</td>
                    <td>${formatCurrency(ambiente.precio)}</td>
                    <td>${formatCurrency(ambiente.precio)}</td>
                `;
                detallesServicioBody.appendChild(filaAmbiente);
            });
        }

        // Agregar filas para ventanas si existen
        if (datosFactura.ventanas && datosFactura.ventanas.length > 0) {
            datosFactura.ventanas.forEach(ventana => {
                const filaVentana = document.createElement('tr');
                filaVentana.innerHTML = `
                    <td>Limpieza de Ventana ${ventana.tipo}</td>
                    <td>${ventana.cantidad}</td>
                    <td>${formatCurrency(ventana.precio)}</td>
                    <td>${formatCurrency(ventana.precio * ventana.cantidad)}</td>
                `;
                detallesServicioBody.appendChild(filaVentana);
            });
        }

        // Actualizar totales
        document.getElementById('subtotalDisplay').textContent = formatCurrency(datosFactura.subtotal);

        if (datosFactura.tipoFactura !== 'C') {
            document.getElementById('ivaDisplay').textContent = formatCurrency(datosFactura.iva);
            document.getElementById('iibbDisplay').textContent = formatCurrency(datosFactura.iibb);
        }

        document.getElementById('totalDisplay').textContent = formatCurrency(datosFactura.total);
    }

    // Función para imprimir la factura
    function imprimirFactura() {
        window.print();
    }

    // Función para volver a la página de servicios
    function volverAServicios() {
        window.location.href = './servicios.html';
    }

    // Cargar datos de la factura al iniciar
    cargarDatosFactura();

    // Event Listeners
    document.getElementById('btnImprimir').addEventListener('click', imprimirFactura);
    document.getElementById('btnVolver').addEventListener('click', volverAServicios);
});
