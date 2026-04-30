import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
    email = '';
    password = '';
    loading = false;
    errorMessage = '';

    private authService = inject(AuthService);
    private router = inject(Router);

    async signIn(): Promise<void> {
      this.errorMessage = '';

      const email = this.email.trim();
      const password = this.password;

      if (!email || !password) {
        this.errorMessage = 'Please enter email and password.';
        return;
      }

      try {
        this.loading = true;
        const result = await this.authService.login(email, password);
        console.log('LOGIN SUCCESS:', result.user);
        await this.router.navigate(['/main']);
      } catch (error: any) {
        console.error('LOGIN ERROR:', error);
        console.error('ERROR CODE:', error?.code);
        console.error('ERROR MESSAGE:', error?.message);

        this.errorMessage = this.mapFirebaseError(error?.code);
      } finally {
        this.loading = false;
      }
    }

    private mapFirebaseError(code: string): string {
      switch (code) {
        case 'auth/invalid-email':
          return 'Invalid email address.';
        case 'auth/user-disabled':
          return 'This account has been disabled.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          return 'Wrong email or password.';
        case 'auth/too-many-requests':
          return 'Too many attempts. Try again later.';
        case 'auth/network-request-failed':
          return 'Network error. Check your internet connection.';
        default:
          return `Login failed (${code || 'unknown error'}).`;
      }
    }
}
