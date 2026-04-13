import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-third-details',
  standalone: true,
  imports: [],
  templateUrl: './third-details.component.html',
  styleUrl: './third-details.component.scss'
})
export class ThirdDetailsComponent {
  constructor(private router: Router) {}

  next() {
    this.router.navigate(['/fourthDetails']);
  }
}
