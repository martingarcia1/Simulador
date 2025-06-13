class CleanProCotizador {    constructor() {
        this.PRECIO_HORA = 8000; // Precio base por hora de trabajo
        this.MT2_POR_HORA = 10;  // Metros cuadrados que se pueden limpiar en una hora
        this.TIEMPO_MINIMO = 3;   // Tiempo mínimo de servicio en horas
        this.TIEMPO_MAXIMO = 8;   // Tiempo máximo de servicio en horas
        this.HORARIO_LABORAL = {
            inicio: 8, // 8:00 AM
            fin: 17    // 5:00 PM
        };
          // Rangos de tiempo (en horas) para cada tipo de ambiente
        this.tiempoAmbientes = {
            baño: { min: 0.5, max: 1 },          // 30min - 1h por baño (según suciedad y tamaño)
            cocina: { min: 0.5, max: 1 },        // 30min - 1h por cocina (según equipamiento)
            dormitorio: { min: 0.5, max: 1 },    // 30min - 1h por dormitorio (según tamaño y desorden)
            living: { min: 0.5, max: 1 },        // 30min - 1h por living (según muebles)
            oficina: { min: 0.5, max: 1 },       // 30min - 1h por oficina (según equipos)
            consultorio: { min: 0.5, max: 1 },   // 30min - 1h por consultorio (sanitización)
            sala_espera: { min: 0.5, max: 1 }    // 30min - 1h por sala (según tamaño)
        };
        
        // Tiempo base para cálculos iniciales (usamos el promedio)
        this.tiempoBaseAmbientes = {
            baño: 0.75,          
            cocina: 0.75,      
            dormitorio: 0.75,    
            living: 0.75,     
            oficina: 0.75,     
            consultorio: 0.75,   
            sala_espera: 0.75    
        };

        // Factor de complejidad según el tipo de propiedad
        this.factorComplejidad = {
            casa: 1.2,        // 20% más de tiempo por desplazamiento entre ambientes
            departamento: 1,   // Tiempo base
            oficina: 1.1,     // 10% más por mobiliario específico
            consultorio: 1.3,  // 30% más por requerimientos de higiene
            edificio: 1.4     // 40% más por áreas comunes y desplazamiento
        };
        
        // Calculamos los precios basados en el tiempo y el precio por hora
        this.precios = {            baño: this.PRECIO_HORA * this.tiempoBaseAmbientes.baño,
            cocina: this.PRECIO_HORA * this.tiempoBaseAmbientes.cocina,
            dormitorio: this.PRECIO_HORA * this.tiempoBaseAmbientes.dormitorio,
            living: this.PRECIO_HORA * this.tiempoBaseAmbientes.living,
            oficina: this.PRECIO_HORA * this.tiempoBaseAmbientes.oficina,
            consultorio: this.PRECIO_HORA * this.tiempoBaseAmbientes.consultorio,
            sala_espera: this.PRECIO_HORA * this.tiempoBaseAmbientes.sala_espera,
            precioPorMetro: this.PRECIO_HORA / this.MT2_POR_HORA, // Precio por metro cuadrado
            precioPorVidrio: this.PRECIO_HORA / 4 // 15 minutos (1/4 hora) por metro cuadrado de vidrio
        };
        this.ambientesSeleccionados = [];
        this.metrosCuadrados = 0;
        this.vidrios = [];
        this.fechaServicio = null;
        this.horaServicio = null;
        this.horasRequeridas = this.TIEMPO_MINIMO;
    }

    setFechaHoraServicio(fecha, hora) {
        this.fechaServicio = new Date(fecha + 'T' + hora);
    }

    validarHorarioServicio(tiempoTotal) {
        if (!this.fechaServicio) {
            throw new Error('Debe seleccionar una fecha y hora para el servicio');
        }        const horaInicio = this.fechaServicio.getHours() + (this.fechaServicio.getMinutes() / 60);
        const horaFin = horaInicio + tiempoTotal;

        // Validar que el servicio finalice dentro del horario laboral
        if (horaFin > this.HORARIO_LABORAL.fin) {
            const minutosPasados = Math.round((horaFin - this.HORARIO_LABORAL.fin) * 60);
            throw new Error(`El servicio excedería el horario laboral por ${minutosPasados} minutos. Por favor seleccione un horario más temprano o reduzca los servicios solicitados.`);
        }

        return {
            inicio: this.fechaServicio,
            fin: new Date(this.fechaServicio.getTime() + (tiempoTotal * 60 * 60 * 1000))
        };
    }

    agregarAmbiente(tipo, cantidad = 1) {
        this.ambientesSeleccionados.push({
            tipo,
            cantidad,
            precio: Math.ceil((this.precios[tipo] * cantidad) / 500) * 500 // Redondear a múltiplos de 500
        });
    }    agregarVidrio(ancho, alto, cantidad = 1, unidad = 'cm') {
        // Convertir todas las medidas a metros cuadrados
        let metros;
        if (unidad === 'cm') {
            metros = (ancho * alto) / 10000; // convertir cm² a m²
        } else {
            metros = ancho * alto; // ya está en metros cuadrados
        }
        
        this.vidrios.push({
            ancho,
            alto,
            unidad,
            cantidad,
            metros: metros * cantidad,
            precio: Math.ceil((this.precios.precioPorVidrio * metros * cantidad) / 500) * 500 // Redondear a múltiplos de 500
        });
    }

    setMetrosCuadrados(metros) {
        this.metrosCuadrados = metros;
    }    setHorasRequeridas(horas) {
        if (horas < this.TIEMPO_MINIMO || horas > this.TIEMPO_MAXIMO) {
            throw new Error(`El servicio debe ser entre ${this.TIEMPO_MINIMO} y ${this.TIEMPO_MAXIMO} horas`);
        }
        this.horasRequeridas = horas;
    }

    calcularTotal() {
        // Obtener tipo de propiedad del localStorage o usar valor por defecto
        const tipoPropiedad = localStorage.getItem('tipoPropiedad') || 'departamento';
        const factorTiempo = this.factorComplejidad[tipoPropiedad];

        // Calcular tiempo base por ambientes        // Calcular tiempo mínimo y máximo para ambientes
        const tiempoMinAmbientes = this.ambientesSeleccionados.reduce((total, ambiente) => 
            total + (this.tiempoAmbientes[ambiente.tipo].min * ambiente.cantidad), 0);
        const tiempoMaxAmbientes = this.ambientesSeleccionados.reduce((total, ambiente) => 
            total + (this.tiempoAmbientes[ambiente.tipo].max * ambiente.cantidad), 0);
        
        // Usar el tiempo promedio para los cálculos iniciales
        const tiempoAmbientes = this.ambientesSeleccionados.reduce((total, ambiente) => 
            total + (this.tiempoBaseAmbientes[ambiente.tipo] * ambiente.cantidad), 0);
        
        // Calcular tiempo por metros cuadrados
        const tiempoMetros = this.metrosCuadrados / this.MT2_POR_HORA;
        
        // Calcular tiempo por vidrios
        const metrosVidrios = this.vidrios.reduce((total, vidrio) => total + vidrio.metros, 0);
        const tiempoVidrios = metrosVidrios * 0.25; // 15 minutos (0.25 horas) por metro cuadrado

        // Tiempo total estimado según los servicios
        const tiempoEstimado = (tiempoAmbientes + tiempoMetros + tiempoVidrios) * factorTiempo;

        // Ajustar el precio según las horas requeridas por el cliente
        const tiempoAjustado = Math.max(this.horasRequeridas, tiempoEstimado);

        if (tiempoAjustado > this.TIEMPO_MAXIMO) {
            throw new Error(`El servicio requiere ${tiempoAjustado.toFixed(1)} horas. Excede el máximo de ${this.TIEMPO_MAXIMO} horas por día. Por favor, divida el servicio en múltiples días o reduzca los servicios solicitados.`);
        }

        // Validar y obtener horario del servicio
        const horario = this.validarHorarioServicio(tiempoAjustado);

        // Calcular precios proporcionalmente al tiempo ajustado
        const factor = tiempoAjustado / tiempoEstimado;        // Redondear precios a múltiplos de 500 pesos
        const redondearPrecio = (precio) => Math.ceil(precio / 500) * 500;
        
        const precioAmbientes = redondearPrecio(this.PRECIO_HORA * tiempoAjustado * (tiempoAmbientes / (tiempoAmbientes + tiempoMetros + tiempoVidrios)));
        const precioMetros = redondearPrecio(this.PRECIO_HORA * tiempoAjustado * (tiempoMetros / (tiempoAmbientes + tiempoMetros + tiempoVidrios)));
        const precioVidrios = redondearPrecio(this.PRECIO_HORA * tiempoAjustado * (tiempoVidrios / (tiempoAmbientes + tiempoMetros + tiempoVidrios)));

        return {
            detalles: {
                ambientes: this.ambientesSeleccionados.map(ambiente => ({
                    ...ambiente,
                    tiempoMin: this.tiempoAmbientes[ambiente.tipo].min * ambiente.cantidad * factor,
                    tiempoMax: this.tiempoAmbientes[ambiente.tipo].max * ambiente.cantidad * factor,
                    tiempo: this.tiempoBaseAmbientes[ambiente.tipo] * ambiente.cantidad * factor
                })),
                vidrios: this.vidrios.map(vidrio => ({
                    ...vidrio,
                    tiempo: vidrio.metros * 0.25 * factor
                })),
                metrosCuadrados: this.metrosCuadrados,
                tiempoMetrosCuadrados: tiempoMetros * factor,
                tiempoEstimado: tiempoEstimado,
                tiempoRequerido: this.horasRequeridas,
                tiempoFinal: tiempoAjustado,
                horarioServicio: {
                    inicio: horario.inicio,
                    fin: horario.fin
                },
                rangoTiempo: {
                    minimo: tiempoMinAmbientes * factorTiempo,
                    maximo: tiempoMaxAmbientes * factorTiempo,
                    promedio: tiempoEstimado
                }
            },
            precios: {
                ambientes: precioAmbientes,
                vidrios: precioVidrios,
                metros: precioMetros,
                total: precioAmbientes + precioVidrios + precioMetros
            }
        };
    }

    async convertirMoneda(monto, monedaDestino) {
        try {
            const response = await fetch('../data/cotizaciones.json');
            const data = await response.json();
            const cotizaciones = data.cotizaciones;
            
            switch(monedaDestino) {
                case 'usd':
                    return {
                        monto: monto / cotizaciones.dolar.valor,
                        simbolo: 'USD'
                    };
                case 'usdblue':
                    return {
                        monto: monto / cotizaciones.dolarBlue.valor,
                        simbolo: 'USD'
                    };
                case 'eur':
                    return {
                        monto: monto / cotizaciones.euro.valor,
                        simbolo: '€'
                    };
                default:
                    return {
                        monto,
                        simbolo: '$'
                    };
            }
        } catch (error) {
            console.error('Error al convertir moneda:', error);
            throw error;
        }
    }

    limpiar() {
        this.ambientesSeleccionados = [];
        this.metrosCuadrados = 0;
        this.vidrios = [];
        this.fechaServicio = null;
        this.horaServicio = null;
        this.horasRequeridas = this.TIEMPO_MINIMO;
    }
}
