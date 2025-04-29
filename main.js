// ## Objetivos Específicos

// - Declarar variables, constantes y arrays.
// - Crear funciones que generen interacción con el usuario.
// - Implementar ciclos de iteración y condicionales necesarios para el funcionamiento del simulador.
// - Utilizar la consola de JavaScript y cuadros de diálogo (`Prompt`, `Confirm`, `Alert`).
//   Este proyecto se enfocara de la cotizacion de productos o servicios, facturacion y simulacion de inversiones 
alert("Bienvenido al simulador de cotizacion");

alert("Este simulador te ayudara a cotizar productos o servicios, facturacion y simulacion de inversiones");

alert("Por favor ingrese sus datos para poder permitirle realizar las diferentes operaciones que tenemos en nuestra pagina, de cotizacion, facturacion e inversiones");

let nombre = prompt("Por favor ingrese su nombre y apellido");

let pregunta = confirm("Si es mayor de edad, por favor presione aceptar, si es menor de edad presione cancelar");

let edad = Number(prompt("Por favor ingrese su edad"));


if(edad >= 18){
    alert("Bienvenido " + nombre + " a nuestro simulador de cotizacion, facturacion e inversiones");
}else{
    alert("Lo sentimos " + nombre + " no puede utilizar nuestro simulador de cotizacion, facturacion e inversiones, ya que es menor de edad");

}

let confirmar = prompt("Ingrese las opciones que desee realizar, cotizacion, facturacion o inversiones, para salir del simulador ingrese salir");

//cotizacion de monedas que ingrese el usario, en este caso el dolar y el euro a la moneda local, en este caso el peso argentino
let cotizacion = 0;
let cotizacionDolar = 0;
let cotizacionEuro = 0;
let cotizacionPesoArgentino = 0;

//ahora aca sera donde el usuario ingrese para saber la conversion de la moneda que elija, en este caso el dolar y el euro a la moneda local, en este caso el peso argentino
let moneda = prompt("Ingrese la moneda que desea cotizar, en este caso el dolar o el euro, para salir ingrese salir");

let cantidad = Number(prompt("Ingrese la cantidad de dinero que desea cotizar, en este caso el dolar o el euro, para salir ingrese salir"));

//ahora aca sera donde el usuario ingrese para saber la conversion de la moneda que elija, en este caso el dolar y el euro a la moneda local, en este caso el peso argentino
while(moneda != "salir"){
    if(moneda == "dolar"){
        cotizacionDolar = 350;
        cotizacionPesoArgentino = cantidad * cotizacionDolar;
        alert("La cotizacion del dolar es de " + cotizacionDolar + " pesos argentinos, por lo que la cotizacion de " + cantidad + " dolares es de " + cotizacionPesoArgentino + " pesos argentinos");
    }else if(moneda == "euro"){
        cotizacionEuro = 400;
        cotizacionPesoArgentino = cantidad * cotizacionEuro;
        alert("La cotizacion del euro es de " + cotizacionEuro + " pesos argentinos, por lo que la cotizacion de " + cantidad + " euros es de " + cotizacionPesoArgentino + " pesos argentinos");
    }else{
        alert("La moneda ingresada no es correcta, por favor ingrese una moneda valida, en este caso el dolar o el euro, para salir ingrese salir");
    }
    moneda = prompt("Ingrese la moneda que desea cotizar, en este caso el dolar o el euro, para salir ingrese salir");
}