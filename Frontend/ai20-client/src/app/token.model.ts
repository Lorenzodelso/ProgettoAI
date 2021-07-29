export class Token {
    id: string;
    teamId: number;
    expiryDate: string;

    constructor( id: string,
        teamId: number,
        expiryDate: string
    ) {
        this.id=id;
        this.teamId= teamId;
        this.expiryDate= expiryDate;
    }
}
