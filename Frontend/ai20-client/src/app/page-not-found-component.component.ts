import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-not-found-component',
  template: `
    <div style="text-align: center;"> 
    <h1>
    <br>Errore!<br>
    Pagina non disponibile.
    </h1>
   
    </div>
    
  `,
  styles: [
  ]
})
export class PageNotFoundComponentComponent implements OnInit {

  
  constructor() { 
  }

  ngOnInit(): void {
    
  }

}
