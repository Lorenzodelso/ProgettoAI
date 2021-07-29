export class Essay {
    id: number;
    voto: number;
    stato: string;
    data: any;
    idStudente: string;
    nome_studente: string;
    lastModified: number;

    constructor( id: number,
        voto: number,
        stato: string,
        data: any,
        idStudente: string,
        nome_studente: string,
        lastModified: number

    ) {
        this.id=id;
        this.voto= voto;
        this.stato= stato;
        this.data=data;
        this.idStudente=idStudente;
        this.nome_studente=nome_studente;
        this.lastModified=lastModified;
    }
}
