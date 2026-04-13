import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-second-details',
  standalone: true,
  imports: [],
  templateUrl: './second-details.component.html',
  styleUrl: './second-details.component.scss'
})
export class SecondDetailsComponent {
  constructor(private router: Router) {}

  next() {
    this.router.navigate(['/thirdDetails']);
  }
}
