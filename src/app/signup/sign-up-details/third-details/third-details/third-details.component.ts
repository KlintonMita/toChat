import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupStateService } from '../../../../services/signup-state.service';

@Component({
  selector: 'app-third-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './third-details.component.html',
  styleUrl: './third-details.component.scss'
})
export class ThirdDetailsComponent {
  signupState = inject(SignupStateService);
  private router = inject(Router);

  errors = {
    favoriteMovie: '',
    hobby: '',
    smoker: '',
  };

  next(): void {
    this.clearErrors();

    let hasError = false;

    if (!this.signupState.data.favoriteMovie.trim()) {
      this.errors.favoriteMovie = 'Favorite movie is required.';
      hasError = true;
    }

    if (!this.signupState.data.hobby.trim()) {
      this.errors.hobby = 'Hobby is required.';
      hasError = true;
    }

    if (!this.signupState.data.smoker.trim()) {
      this.errors.smoker = 'Smoker field is required.';
      hasError = true;
    }

    if (hasError) return;

    this.router.navigate(['/fourthDetails']);
  }

  private clearErrors(): void {
    this.errors = {
      favoriteMovie: '',
      hobby: '',
      smoker: '',
    };
  }
}
