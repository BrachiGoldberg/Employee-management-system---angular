import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss'
})
export class ErrorPageComponent {

  massege: string = "An error occurred, please try again later"

  constructor(private _activated: ActivatedRoute) { }

  ngOnInit() {
    this._activated.paramMap.subscribe(params => {
      let mes = params.get('mess')
      if (mes)
        this.massege = mes
    })
  }
}
