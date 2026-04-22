import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SignupStateService } from '../services/signup-state.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  constructor() {}

  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';

  private router = inject(Router);
  private signupState = inject(SignupStateService);

  continueWithEmail(): void {
    this.errorMessage = '';

    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.signupState.data.email = this.email;
    this.signupState.data.password = this.password;

    this.router.navigate(['/sDetails']);
  }
}
