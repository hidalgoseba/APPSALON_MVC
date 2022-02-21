let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp()

});

function iniciarApp() {
    mostrarSeccion(); //muestra y oculta las secciones
    tabs(); // cambia seccion cando se presiona tabs
    botonesPaginador(); // agrega o quita los botones de paginacion
    paginaSiguiente();
    paginaAnterior();
    consultarAPI(); //consulta la API en backend PHP
    idCliente();
    nombreCliente();    //añade el nombre del cliente al objeto cita
    seleccionarFecha(); //agrega la fecha al objeto de cita
    seleccionarHora();  //agrega la hora al objeto de cita
    mostrarResumen();  //muestra el resumen del turno

}

function mostrarSeccion() {

    //ocultar la seccion
    const seccionAnterior =  document.querySelector('.mostrar');
    if(seccionAnterior) {
       seccionAnterior.classList.remove("mostrar");
    }

    // seleccionar la seccion con el paso
    const seccion = document.querySelector(`#paso-${paso}`);
    seccion.classList.add('mostrar');

    //quita el tab actual al anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior) {
        tabAnterior.classList.remove("actual");
    }

    //resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach( boton => {
        boton.addEventListener('click', function(e) {
            paso = parseInt( e.target.dataset.paso );
            mostrarSeccion();
            botonesPaginador();

        });
    });
}
 function botonesPaginador() {
     const paginaAnterior =  document.querySelector('#anterior');
     const paginaSiguiente = document.querySelector('#siguiente');

     if(paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
     } else if(paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
     } else {
        paginaAnterior.classList.remove("ocultar");
        paginaSiguiente.classList.remove("ocultar");
     }
     mostrarSeccion();
 }

 function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function() {
        if(paso <= pasoInicial) return;
        paso--;
        botonesPaginador();
    })
 }
 function paginaSiguiente() {
    const paginaSiguiente = document.querySelector("#siguiente");
    paginaSiguiente.addEventListener("click", function () {
      if (paso >= pasoFinal) return;
      paso++;
      botonesPaginador();
    });
 }
 const server = window.location.origin;
 async function consultarAPI() {
   try {
     const url = `${server}/api/servicios`;
     const resultado = await fetch(url);
     const servicios = await resultado.json();
     mostrarServicios(servicios);
   } catch (error) {
     console.log(error);
   }
 }
// async  function consultarAPI() {

//     try {
//       const url = "http://localhost:3000/api/servicios"; 
      
//       const resultado = await fetch(url);
//       const servicios = await resultado.json();

//       mostrarServicios(servicios);
//     } catch (error) {
//         console.log(error);
//     }
//  }
 function mostrarServicios(servicios){
    servicios.forEach( servicio => {
       const { id, nombre, precio } = servicio;

       const nombreServicio = document.createElement('P');
       nombreServicio.classList.add('nombre-servicio');
       nombreServicio.textContent = nombre;

       const precioServicio = document.createElement('P');
       precioServicio.classList.add('precio-servicio');
       precioServicio.textContent = `$${precio}`;

       const servicioDiv = document.createElement('DIV');
       servicioDiv.classList.add('servicio');
       servicioDiv.dataset.idServicio = id;
       servicioDiv.onclick = function() {
           seleccionarServicio(servicio);
       };

       servicioDiv.appendChild(nombreServicio);
       servicioDiv.appendChild(precioServicio);
       document.querySelector('#servicios').appendChild(servicioDiv);
       
    });
 }

 function seleccionarServicio(servicio) {
       const { id } = servicio;
       const { servicios } = cita;
       //identifico el elemento que se le da click
       const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    //comprobar si un servicio esta agregado o quitarlo
    if( servicios.some( agregado => agregado.id === id) )  {
        //eliminarlo
        cita.servicios = servicios.filter( agregado => agregado.id !== id);
        divServicio.classList.remove("seleccionado");

    } else {
        // agregarlo
       cita.servicios = [...servicios, servicio];
       divServicio.classList.add("seleccionado");
    }

 }

 function idCliente() {
    cita.id = document.querySelector("#id").value;

 }

 function nombreCliente() {
     cita.nombre = document.querySelector('#nombre').value;

 }

 function seleccionarFecha() {
     const inputFecha = document.querySelector('#fecha');
     inputFecha.addEventListener('input', function(e) {
         const dia = new Date(e.target.value).getUTCDay();
         if( [1, 0].includes(dia)) {
            e.target.value = '';
            mostrarAlerta('Domingos y Lunes Cerrados', 'error', '.formulario');
         } else {
             cita.fecha = e.target.value;
         }

     })
 }

  function seleccionarHora() {
      const inputHora = document.querySelector('#hora');
      inputHora.addEventListener('input', function(e) {
        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];

        if( hora < 09 || hora > 19) {
            e.target.value = '';
            mostrarAlerta('Hora no valida', 'error', '.formulario');
        } else {
            cita.hora = e.target.value;
        }

      });
  }

 function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
    //previene que se genere mas de una alerta
    const alertaPrevia = document.querySelector('alerta');
    if(alertaPrevia) {
        alertaPrevia.remove();
    }

        //scripting para crear la alerta
     const alerta = document.createElement('DIV');
     alerta.textContent = mensaje;
     alerta.classList.add('alerta');
     alerta.classList.add(tipo);

     const referencia = document.querySelector(elemento);
     referencia.appendChild(alerta);

     if(desaparece) {
       //eliminar la alerta
       setTimeout(() => {
         alerta.remove();
       }, 3000);
     }
 }

function mostrarResumen() {
  const resumen = document.querySelector(".contenido-resumen");
  //limpia el contenido de resumen
  while (resumen.firstChild) {
    resumen.removeChild(resumen.firstChild);
  }

  if (Object.values(cita).includes("") || cita.servicios.length === 0) {
    mostrarAlerta(
      "Faltan datos de carga en servicios, fecha u hora",
      "error",
      ".contenido-resumen",
      false
    );
    return;
  }
  //formatear el div del resumen
  const { nombre, fecha, hora, servicios } = cita;

  //heading para los servicios de resumen
  const headingServicios = document.createElement("H3");
  headingServicios.textContent = "Resumen de Servicios";
  resumen.appendChild(headingServicios);

  //iterando y mostrando los servicios
  servicios.forEach((servicio) => {
    const { id, precio, nombre } = servicio;
    const contenedorServicio = document.createElement("DIV");
    contenedorServicio.classList.add("contenedor-servicio");

    const textoServicio = document.createElement("P");
    textoServicio.textContent = nombre;

    const precioServicio = document.createElement("P");
    precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

    contenedorServicio.appendChild(textoServicio);
    contenedorServicio.appendChild(precioServicio);

    resumen.appendChild(contenedorServicio);
  });
  //heading para los turnos de resumen
  const headingCita = document.createElement("H3");
  headingCita.textContent = "Resumen de Turnos";
  resumen.appendChild(headingCita);

  const nombreCliente = document.createElement("P");
  nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

  //formatear la fecha en español
  const fechaObj = new Date(fecha);
  const mes = fechaObj.getMonth();
  const dia = fechaObj.getDate() +2;
  const year = fechaObj.getFullYear();

  const fechaUTC = new Date( Date.UTC(year, mes, dia) );

  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  const fechaFormateada = fechaUTC.toLocaleDateString('es-AR', opciones);

  const fechaCita = document.createElement("P");
  fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

  const horaCita = document.createElement("P");
  horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

  //boton para crear un turno
  const botonReservar = document.createElement('BUTTON');
  botonReservar.classList.add('boton');
  botonReservar.textContent = 'Reservar Turno';
  botonReservar.onclick = reservarCita;

  resumen.appendChild(nombreCliente);
  resumen.appendChild(fechaCita);
  resumen.appendChild(horaCita);

  resumen.appendChild(botonReservar);
}

const server = window.location.origin;
async function reservarCita() {
    const { nombre, fecha, hora, servicios, id } = cita;

    const idServicios = servicios.map( servicio => servicio.id);
   // console.log(idServicios);
    
    const datos = new FormData();
    datos.append('fecha', fecha);
    datos.append("hora", hora);
    datos.append("usuarioId", id);
    datos.append("servicios", idServicios);

    //console.log([...datos]);
    //return;
    try {
      //PETICION HACIA LA API
      const url = `${server}/api/citas`; 
      const respuesta = await fetch(url, {
        method: "POST",
        body: datos
      });

      const resultado = await respuesta.json();

      console.log(resultado.resultado);

      if (resultado.resultado) {
        Swal.fire({
          icon: "success",
          title: "Turno Creado",
          text: "El turno se creó correctamente!",
          button: "OK",
        }).then(() => {
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        });
      }
    } catch (error) {
        Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Hubo un error al cargar la cita!",
        });        
    }

    //console.log([...datos]);// spreed operators son los 3 puntos seguido del nombre datos que es el arreglo para ver lo que vamos a enviar al servidor para guardar
}