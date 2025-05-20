// ## Objetivos Específicos

// - Declarar variables, constantes y arrays.
// - Crear funciones que generen interacción con el usuario.
// - Implementar ciclos de iteración y condicionales necesarios para el funcionamiento del simulador.
// - Utilizar la consola de JavaScript y cuadros de diálogo (`Prompt`, `Confirm`, `Alert`).
//   Este proyecto se enfocara de la cotizacion de productos o servicios, facturacion y simulacion de inversiones 



document.addEventListener("DOMContentLoaded", () => {
    const cotizacionForm = document.getElementById("cotizacionForm");
    const resultadoDiv = document.getElementById("resultado");

    cotizacionForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const moneda = document.getElementById("moneda").value;
        const cantidad = Number(document.getElementById("cantidad").value);

        let cotizacionDolarBNA = 1160;
        let cotizacionDolarBlue = 1750;
        let cotizacionDolarTarjeta = 1508;
        let cotizacionDolarMep = 1151;
        let cotizacionEuro = 1289;
        let cotizacionRal = 201;
        let cotizacionPesoArgentino = 0;
 
        //Calculo de la cotizacion de las monedas seleccionadas usando la condicional if para su ejecucion 
        if (moneda === "dolar") {
            cotizacionPesoArgentino = cantidad * cotizacionDolarBNA;
            resultadoDiv.innerHTML = `<p>La cotización del dólar BNA es de ${cotizacionDolarBNA} pesos argentinos. La cotización de ${cantidad} dólares es de ${cotizacionPesoArgentino} pesos argentinos.</p>`;
        } else if (moneda === "euro") {
            cotizacionPesoArgentino = cantidad * cotizacionEuro;
            resultadoDiv.innerHTML = `<p>La cotización del euro es de ${cotizacionEuro} pesos argentinos. La cotización de ${cantidad} euros es de ${cotizacionPesoArgentino} pesos argentinos.</p>`;
        } else if (moneda === "dolarBlue") {
            cotizacionPesoArgentino = cantidad * cotizacionDolarBlue;
            resultadoDiv.innerHTML = `<p>La cotización del dólar blue es de ${cotizacionDolarBlue} pesos argentinos. La cotización de ${cantidad} dólares blue es de ${cotizacionPesoArgentino} pesos argentinos.</p>`;
        } else {
            resultadoDiv.innerHTML = `<p>La moneda ingresada no es válida. Por favor, seleccione una moneda válida.</p>`;
        }

        // Guardar en localStorage
        const cotizacion = {
            moneda,
            cantidad,
            resultado: cotizacionPesoArgentino,
        };
        localStorage.setItem("ultimaCotizacion", JSON.stringify(cotizacion));
    });
});