import {
  handlerCargar,
  handlerModificar,
  handlerEliminar,
  arrayObj,
  header,
  arrayToLocal
} from "./Datos.js";
import { Futbolista, Profesional } from "./Entidades.js";
import { generarTable} from "./TablaDinamica.js";

const seccionTabla = document.getElementById("seccionTable");
const formAbm = document.forms[0];
const formDatos = document.forms[1];
let seccionVisible = true;

const {
  txtId,
  txtNombre,
  txtApellido,
  txtEdad,
  txtEquipo,
  txtPosicion,
  txtCantidadGoles,
  txtTitulo,
  txtFacultad,
  txtAñoGraduacion,
  slcTipoAbm,
  btnGuardarAbm,
  btnModificarAbm,
  btnEliminarAbm,
  btnCancelarAbm

} = formAbm;

const {
  btnAgregarElemento
} = formDatos;

window.onload = () => {
    EnviarPeticionGET();
};

slcTipoAbm.addEventListener("change", (event) => {
  ocultarMostrarDiv();
});

formAbm.addEventListener("submit", (e) => {
  e.preventDefault();
  EnviarPeticionPUT(JSON.stringify(CrearPersona()));
  ocultarMostrarDiv();
  AlternarVistaForm();
  CambiarEstadoAbm();
});
btnCancelarAbm.addEventListener("click", (e) => {
  e.preventDefault();
  AlternarVistaForm();
  formAbm.reset();
  CambiarEstadoAbm();
});

btnModificarAbm.addEventListener("click", (e) => {
  e.preventDefault();
  EnviarPeticionPOST(JSON.stringify(CrearPersona()));
  CambiarEstadoAbm();
  AlternarVistaForm();
});

btnEliminarAbm.addEventListener("click", (e) => {
  EnviarPeticionDELETE(JSON.stringify(CrearPersona()));
  CambiarEstadoAbm();
  AlternarVistaForm();
});
btnAgregarElemento.addEventListener("click", (e) => {
  e.preventDefault();
  AlternarVistaForm();
  formAbm.reset();
  CambiarEstadoAbm();
  slcTipoAbm.disabled = false;
});

function AlternarVistaForm()
{
  if(seccionVisible)
  {
    formDatos.hidden = true;
    formAbm.hidden = false;
  }
  else
  {
    formDatos.hidden = false;
    formAbm.hidden = true;
  }
  seccionVisible = !seccionVisible;
}

function EnviarPeticionGET() {
  let xml = new XMLHttpRequest();

  ActivadorSpinner(true);
  xml.onreadystatechange = function () {
    if (xml.readyState === 4) {
      if (xml.status === 200) {
        var data = JSON.parse(xml.responseText);
        var personas = data.map(obj => {
          if ('equipo' in obj) {
              return new Futbolista(obj.id, obj.nombre, obj.apellido, obj.edad, obj.equipo, obj.posicion, obj.cantidadGoles);
          } else {
              return new Profesional(obj.id, obj.nombre, obj.apellido, obj.edad, obj.titulo, obj.facultad, obj.añoGraduacion);
          }
      });
      } else {
        console.log("Fallo la peticion PUT");
        console.log(xml.status);
      }
      arrayToLocal(personas);
      refrescarTabla(seccionTabla, arrayObj());
      ActivadorSpinner(false);
    }
  };
  xml.open("GET", "http://localhost/personasFutbolitasProfesionales.php", true);
  xml.setRequestHeader("Content-Type", "application/json");
  xml.send();

}

async function EnviarPeticionPUT(payload)
{
  ActivadorSpinner(true);
  try 
  {
      var respuesta = await fetch("http://localhost/personasFutbolitasProfesionales.php", {
          method: "PUT",
          headers: {
              "Content-Type": "application/json"
          }, 
          body: payload
      });
  } catch (error) {
      alert("Fallo la peticion PUT: ",error);
  }
  if (respuesta.status==200)
  {
    let persona = CrearPersona();
    var data = await respuesta.json();
    persona.id = data.id;
    handlerCargar(persona);
    refrescarTabla(seccionTabla,arrayObj());
    formAbm.reset();
    ocultarMostrarDiv();
  }
  else
  {
      alert("Error al realizar la peticion PUT.");
  }
  ActivadorSpinner(false);
}

function EnviarPeticionPOST(payload)
{
  ActivadorSpinner(true);
  fetch("http://localhost/personasFutbolitasProfesionales.php", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: payload
})
.then(respuesta => {
    if (respuesta.status === 200) {
      handlerModificar(CrearPersona());
      refrescarTabla(seccionTabla,arrayObj());
      formAbm.reset();
      ocultarMostrarDiv();
      ActivadorSpinner(false);
        return respuesta;
    } else {
        throw new Error("Fallo la peticion POST");
    }
})
.catch(error => {
    alert("Error al modificar los datos: " + error);
    ActivadorSpinner(false);
});
}

async function EnviarPeticionDELETE(payload)
{
  ActivadorSpinner(true);
  try 
  {
      var respuesta = await fetch("http://localhost/personasFutbolitasProfesionales.php", {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json"
          }, 
          body: payload
      });
  } catch (error) {
      alert("Fallo la peticion DELETE: ",error);
  }
  if (respuesta.status==200)
  {
    handlerEliminar(CrearPersona());
    refrescarTabla(seccionTabla,arrayObj());
    formAbm.reset();
    ocultarMostrarDiv();
  }
  else
  {
      alert("Error al realizar la peticion POST.");
  }
  ActivadorSpinner(false);
}

function CrearPersona()
{

  let nuevaPersona = null;
  if (slcTipoAbm.value === "Futbolista") {
    nuevaPersona = new Futbolista(
      txtId.value,
      txtNombre.value,
      txtApellido.value,
      txtEdad.value,
      txtEquipo.value,
      txtPosicion.value,
      txtCantidadGoles.value
    );
  } else if (slcTipoAbm.value === "Profesional") {
    nuevaPersona = new Profesional(
      txtId.value,
      txtNombre.value,
      txtApellido.value,
      txtEdad.value,
      txtTitulo.value,
      txtFacultad.value,
      txtAñoGraduacion.value
    );
  }
  return nuevaPersona;
}

function ocultarMostrarDiv() {
  const tipoFutbolista = document.getElementById("fieldFutbolista");
  const tipoProfesional = document.getElementById("fieldProfesional");
  const mostrarFutbolista = slcTipoAbm.value === "Futbolista";
  const mostrarProfesional = slcTipoAbm.value === "Profesional";

  tipoFutbolista.style.display = mostrarFutbolista ? "block" : "none";
  tipoProfesional.style.display = mostrarProfesional ? "block" : "none";

  txtEquipo.required = mostrarFutbolista;
  txtPosicion.required = mostrarFutbolista;
  txtCantidadGoles.required = mostrarFutbolista;
  txtTitulo.required = mostrarProfesional;
  txtFacultad.required = mostrarProfesional;
  txtAñoGraduacion.required = mostrarProfesional;

  btnGuardarAbm.disabled = false;
}

function CargarEventListenerTabla()
{
  const btnModificar = document.querySelectorAll(".btnModificar");
  btnModificar.forEach((unBtn)=>
            {
              unBtn.addEventListener('click', (e) =>
                {
                    CargarInput((e.target.parentElement).parentElement, 'Modificacion');
                    AlternarVistaForm();
                });
            });
  const btnEliminar = document.querySelectorAll(".btnEliminar");
  btnEliminar.forEach((unBtn)=>
            {
              unBtn.addEventListener('click', (e) =>
                {
                    CargarInput((e.target.parentElement).parentElement, 'Eliminacion');
                    AlternarVistaForm();
                });
            });
}

function CargarInput(elemento, accion)
{
  if(elemento.getElementsByTagName("td")[5].textContent != "N/A")
        {
          console.log('esFutbolista');
            cambiarSeleccion("Futbolista", slcTipoAbm);
        }
        else
        {
          console.log('esProfesional');
            cambiarSeleccion("Profesional", slcTipoAbm);
        }
        txtId.value = elemento.getElementsByTagName("td")[0].textContent;
        txtNombre.value = elemento.getElementsByTagName("td")[1].textContent;
        txtApellido.value = elemento.getElementsByTagName("td")[2].textContent;
        txtEdad.value = elemento.getElementsByTagName("td")[3].textContent;
        txtEquipo.value = elemento.getElementsByTagName("td")[4].textContent;
        txtPosicion.value = elemento.getElementsByTagName("td")[5].textContent;
        txtCantidadGoles.value = elemento.getElementsByTagName("td")[6].textContent;
        txtTitulo.value = elemento.getElementsByTagName("td")[7].textContent;
        txtFacultad.value = elemento.getElementsByTagName("td")[8].textContent;
        txtAñoGraduacion.value = elemento.getElementsByTagName("td")[9].textContent;

        CambiarEstadoAbm(accion);  
        ocultarMostrarDiv();
}

function CambiarEstadoAbm(accion = '')
{
  switch (accion)
  {
    case 'Modificacion':
      EstablecerEstado('Modificacion', true, false, true);
      break;
    case 'Eliminacion':
      EstablecerEstado('Eliminacion', true, true, false);
      break;
    default:
      EstablecerEstado('Alta', false, true, true);
  }
}

function EstablecerEstado(legend, btnGuardarOculto, btnModificarOculto, btnEliminarOculto)
{
  const legendAbm = document.getElementById("legendAbm");
  legendAbm.textContent = legend;
  btnGuardarAbm.hidden = btnGuardarOculto;
  btnModificarAbm.hidden = btnModificarOculto;
  btnEliminarAbm.hidden = btnEliminarOculto;
}

function cambiarSeleccion(tipo, select)
{
    const opciones = Array.from(select.options);
    const opcionSeleccionar = opciones.find(item => item.text === tipo);

    opcionSeleccionar.selected = true;
    select.disabled = true;
}

function refrescarTabla(seccionTabla, arrayObj) {
  if (seccionTabla.hasChildNodes) {
    while(seccionTabla.firstChild) seccionTabla.removeChild(seccionTabla.firstChild);
    
    seccionTabla.appendChild(generarTable(arrayObj, header));
  } else {
    seccionTabla.appendChild(generarTable(arrayObj, header));
  }
  CargarEventListenerTabla();
}

function ActivadorSpinner(activar) {
  const spinnerContainer = document.getElementById('contenedorSpinner');

  if (activar) {
      spinnerContainer.style.display = 'flex';
  } else {
      spinnerContainer.style.display = 'none';
  }
}

