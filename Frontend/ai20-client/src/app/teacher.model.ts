export class Teacher {
    id: string;
    name: string;
    firstName: string;
    photoDocente: any


    constructor( id: string,name: string, firstName: string, photoDocente: any) {
        this.id = id;
        this.name = name;
        this.firstName = firstName;
        this.photoDocente = photoDocente;
    }
};