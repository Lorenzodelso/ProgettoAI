export class StudentRequest {
    id: string;
    name: string;
    firstName: string;
    stato: string;

    constructor( id: string,name: string, firstName: string, stato: string) {
        this.id = id;
        this.name = name;
        this.firstName = firstName;
        this.stato = stato;
    }
}
