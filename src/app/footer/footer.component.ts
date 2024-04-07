import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  
  currentYear: number | undefined
  email: string = 'bracha.developer\@gmail.com'
  constructor() { }

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }
}
