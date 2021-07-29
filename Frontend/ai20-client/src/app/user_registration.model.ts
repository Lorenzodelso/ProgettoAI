export class User_registration {
    nome: string;
    cognome: string;
    email: string;
    username: string; //matricola
    password: string;
    role: string;

    
    constructor(
        email:string,
        username:string,
        password:string,
        role:string,
        nome:string,
        cognome: string
    ) {
        this.username=username;
        this.email=email;
        this.role=role;
        this.password=password;
        this.nome=nome;
        this.cognome=cognome;
    }
    
}
