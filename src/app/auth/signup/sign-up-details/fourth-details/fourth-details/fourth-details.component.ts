import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../services/auth.service';
import { SignupStateService } from '../../../../../services/signup-state.service';


@Component({
  selector: 'app-fourth-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fourth-details.component.html',
  styleUrl: './fourth-details.component.scss',
})
export class FourthDetailsComponent {
  signupState = inject(SignupStateService);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  errorMessage = '';

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.signupState.data.photoFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.signupState.data.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.signupState.data.imagePreview = null;
    this.signupState.data.photoFile = null;
  }

  async finishSignup(): Promise<void> {
    this.errorMessage = '';

    const d = this.signupState.data;

    if (
      !d.email.trim() ||
      !d.password.trim() ||
      !d.firstName.trim() ||
      !d.lastName.trim() ||
      !d.age.trim() ||
      !d.nationality.trim() ||
      !d.residence.trim() ||
      !d.kids.trim() ||
      !d.favoriteMovie.trim() ||
      !d.hobby.trim() ||
      !d.smoker.trim()
    ) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    try {
      this.loading = true;

      await this.authService.register({
        email: d.email,
        password: d.password,
        firstName: d.firstName,
        lastName: d.lastName,
        age: d.age,
        nationality: d.nationality,
        residence: d.residence,
        kids: d.kids,
        favoriteMovie: d.favoriteMovie,
        hobby: d.hobby,
        smoker: d.smoker,
        photoFile: d.photoFile,
      });

      this.signupState.reset();
      await this.router.navigate(['/main']);
    } catch (error: any) {
      console.error('Signup error:', error);
      console.error('Signup error code:', error?.code);
      console.error('Signup error message:', error?.message);
      this.errorMessage = this.getFirebaseErrorMessage(error?.code);
    } finally {
      this.loading = false;
    }
  }

  private getFirebaseErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/operation-not-allowed':
        return 'Email/password signup is not enabled in Firebase.';
      case 'storage/unauthorized':
        return 'You do not have permission to upload images. Check Firebase Storage rules.';
      case 'storage/object-not-found':
        return 'Image upload failed because the storage path was not found.';
      case 'firestore/permission-denied':
      case 'permission-denied':
        return 'You do not have permission to save user data. Check Firestore rules.';
      default:
        return 'Signup failed. Please try again.';
    }
  }
}