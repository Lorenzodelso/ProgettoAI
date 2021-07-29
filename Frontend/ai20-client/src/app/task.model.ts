export class Task {
    id: number;
    dataRilascio: number;
    dataScadenza: number;
    description: any;



    constructor( id: number,
        dataRilascio: number,
        dataScadenza: number,
        description: any
    ) {
        this.id=id;
        this.dataRilascio= dataRilascio;
        this.dataScadenza= dataScadenza;
        this.description=description;
    }
}
