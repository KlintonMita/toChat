import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupStateService } from '../../../services/signup-state.service';

@Component({
  selector: 'app-sign-up-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-up-details.component.html',
  styleUrl: './sign-up-details.component.scss'
})
export class SignUpDetailsComponent {
  signupState = inject(SignupStateService);
  private router = inject(Router);

  errors = {
    firstName: '',
    lastName: '',
    age: '',
  };

  next(): void {
    this.clearErrors();

    let hasError = false;

    if (!this.signupState.data.firstName.trim()) {
      this.errors.firstName = 'Name is required.';
      hasError = true;
    }

    if (!this.signupState.data.lastName.trim()) {
      this.errors.lastName = 'Last name is required.';
      hasError = true;
    }

    if (!this.signupState.data.age.trim()) {
      this.errors.age = 'Age is required.';
      hasError = true;
    }

    if (hasError) return;

    this.router.navigate(['/secondDetails']);
  }

  private clearErrors(): void {
    this.errors = {
      firstName: '',
      lastName: '',
      age: '',
    };
  }

}
