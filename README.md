# Entregable 1 - CotizaYa

## Estructura del Simulador

Este proyecto es un simulador básico enfocado en la cotización de productos o servicios, facturación y simulación de inversiones. La interacción se realiza íntegramente a través de la consola de JavaScript, utilizando cuadros de diálogo como `Prompt`, `Confirm` y `Alert`.

--- 

## Objetivos Generales

- Armar la estructura base del simulador.
- Integrar las herramientas de JavaScript aprendidas hasta el momento.

## Objetivos Específicos

- Declarar variables, constantes y arrays.
- Crear funciones que generen interacción con el usuario.
- Implementar ciclos de iteración y condicionales necesarios para el funcionamiento del simulador.
- Utilizar la consola de JavaScript y cuadros de diálogo (`Prompt`, `Confirm`, `Alert`).

---

## Entregable 2 - CotizaYa

### Estructura del Simulador

En esta segunda etapa, el simulador evoluciona para interactuar directamente con el HTML mediante el uso del DOM y eventos, eliminando la dependencia de la consola de JavaScript.

---

### Objetivos Generales

- Mostrar el simulador JS interactuando con HTML.
- Integrar las herramientas de JavaScript aprendidas hasta el momento.

### Objetivos Específicos

- Modificar la estructura anterior, integrando JavaScript con HTML mediante el uso de DOM y eventos.
- Programar el circuito de interacción completo de la lógica de la aplicación web, agregando las nuevas herramientas de JavaScript aprendidas.
- Guardar objetos o arrays de objetos en `localStorage` para dejar disponibles los datos agregados por el usuario (por ejemplo, los productos en un carrito de compras).

---

### Se debe entregar

- Documento HTML + CSS (al menos uno).
- Archivo(s) JS referenciado(s) en el HTML.

---

### Formato

- Archivo en formato `.ZIP` con la carpeta y los archivos del proyecto.
- El nombre del archivo debe ser: `Entregable2+Apellido`.
- Los archivos JS, CSS y JSON deben estar organizados en subcarpetas.

---

### Sugerencias

- En esta etapa, debes integrar JavaScript con HTML y/o CSS.
- Diseña la estética visual necesaria en tu webapp con CSS y/o un framework CSS.
- Los algoritmos de JavaScript deben ser invocados desde HTML e interactuar con el contenido web, creando HTML dinámico, leyendo y procesando datos ingresados desde formularios, inputs, etc.
- Elimina toda interacción con la consola de JavaScript, convirtiendo esta interacción en el DOM del HTML.

---

### Criterios de Evaluación

#### Funcionalidad
- Se simula uno o más flujos de trabajo en términos de entrada, proceso y salida.
- La funcionalidad es apropiada al contexto del simulador.
- Carece de errores de cómputo durante el procesamiento.

#### Interactividad
- Se capturan entradas ingresadas por el usuario mediante eventos.
- Se efectúan una o más salidas por HTML modificando el DOM.
- Existe un control de ingreso de entradas y las salidas son coherentes en relación a los datos ingresados.

#### Escalabilidad
- Se declaran funciones con parámetros para definir instrucciones con una tarea específica.
- Se emplean arrays para agrupar valores relacionados.
- Se definen objetos con propiedades y métodos relevantes al contexto.
- Se establece un criterio homogéneo para la detección de eventos.
- Se almacena en `localStorage` datos relevantes generados durante la simulación.

#### Integridad
- Se define el código JavaScript en un archivo `.js`, referenciándolo correctamente desde el HTML.
- Se evitan métodos `prompt()` y `alert()` para evitar interrupciones durante el procesamiento y actualización del DOM.
- La información estática del proyecto se emplea adecuadamente.

#### Legibilidad
- Los nombres de variables, funciones y objetos son significativos para el contexto.
- Las instrucciones se escriben de forma legible y se emplean comentarios oportunos.
- El código fuente es ordenado en términos de declaración y secuencia.