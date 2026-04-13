import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-details',
  standalone: true,
  imports: [],
  templateUrl: './sign-up-details.component.html',
  styleUrl: './sign-up-details.component.scss'
})
export class SignUpDetailsComponent {
  constructor(private router: Router) {}

  next() {
    this.router.navigate(['/secondDetails']);
  }

}
