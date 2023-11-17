import {Futbolista, Profesional} from "./Entidades.js";
export const header = {"id":"Id", "nombre":"Nombre", "apellido":"Apellido", "edad":"Edad", "equipo":"Equipo", "posicion":"Posicion", "cantidadGoles":"Cantidad de goles", "titulo":"Titulo", "facultad":"Facultad", "añoGraduacion":"Año de graduacion", "modificar":"Modificar", "eliminar":"Eliminar"};

function localToArray()
{
    return JSON.parse(localStorage.getItem("personas"));
}

export function arrayToLocal(array)
{
    localStorage.setItem("personas", JSON.stringify(array));
}

export function arrayObj()
{
    const array = localToArray();
    return array.map(obj => {
        if('equipo' in obj) 
        {
            return new Futbolista(obj.id, obj.nombre, obj.apellido, obj.edad, obj.equipo, obj.posicion, obj.cantidadGoles);
        }
        else
        {
            return new Profesional(obj.id, obj.nombre, obj.apellido, obj.edad, obj.titulo, obj.facultad, obj.añoGraduacion);
        }
    });
}

export function handlerCargar(obj)
{
    if(obj != null)
    {
    const array = arrayObj();
    array.push(obj);
    arrayToLocal(array);
    }
}

export function handlerEliminar(obj)
{
    if(obj != null)
    {
    var array = arrayObj();
    array = array.filter(objDelete =>
    objDelete.id != obj.id);
    arrayToLocal(array);
    }
}

export function handlerModificar(obj)
{
    if(obj != null)
    {
    handlerEliminar(obj);
    handlerCargar(obj);
    }
}
