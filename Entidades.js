class Persona {
    id;
    nombre;
    apellido;
    edad;

    constructor(id, nombre, apellido, edad) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
    }

    toString() {
        return "Id: " + this.id + ", Nombre: " + this.nombre + ", Apellido: " + this.apellido + ", Edad: " + this.edad;
    }
}

class Futbolista extends Persona {
    equipo;
    posicion;
    cantidadGoles;

    constructor(id, nombre, apellido, edad, equipo, posicion, cantidadGoles) {
        super(id, nombre, apellido, edad);
        this.equipo = equipo;
        this.posicion = posicion;
        this.cantidadGoles = cantidadGoles;
    }

    toString() {
        return super.toString(this.id, this.nombre, this.apellido, this.edad) + ", Equipo: " + this.equipo + ", Posicion: " + this.posicion+ ", Cantidad de goles: " + this.cantidadGoles;
    }
}

class Profesional extends Persona {
    titulo;
    facultad;
    añoGraduacion;

    constructor(id, nombre, apellido, edad, titulo, facultad, añoGraduacion) {
        super(id, nombre, apellido, edad);
        this.titulo = titulo;
        this.facultad = facultad;
        this.añoGraduacion = añoGraduacion;
    }

    toString() {
        return super.toString(this.id, this.nombre, this.apellido, this.edad) +", Titulo: " + this.titulo + ", Facultad: " + this.facultad + ", Año de Graduación: " + this.añoGraduacion;
    }
}

export {Persona, Futbolista, Profesional};