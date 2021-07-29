import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home-component',
  template: `
    
      <h2>Home</h2>
      <p>Welcome in Virtual Labs</p>
    
  `,
  styles: [
  ]
})
export class HomeComponentComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
