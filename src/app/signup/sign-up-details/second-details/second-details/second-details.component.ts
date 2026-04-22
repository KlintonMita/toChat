import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupStateService } from '../../../../services/signup-state.service';

@Component({
  selector: 'app-second-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './second-details.component.html',
  styleUrl: './second-details.component.scss'
})
export class SecondDetailsComponent {
  signupState = inject(SignupStateService);
  private router = inject(Router);

  errors = {
    nationality: '',
    residence: '',
    kids: '',
  };

  next(): void {
    this.clearErrors();

    let hasError = false;

    if (!this.signupState.data.nationality.trim()) {
      this.errors.nationality = 'Nationality is required.';
      hasError = true;
    }

    if (!this.signupState.data.residence.trim()) {
      this.errors.residence = 'Residence is required.';
      hasError = true;
    }

    if (!this.signupState.data.kids.trim()) {
      this.errors.kids = 'Kids field is required.';
      hasError = true;
    }

    if (hasError) return;

    this.router.navigate(['/thirdDetails']);
  }

  private clearErrors(): void {
    this.errors = {
      nationality: '',
      residence: '',
      kids: '',
    };
  }
}
