import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fourth-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fourth-details.component.html',
  styleUrl: './fourth-details.component.scss'
})
export class FourthDetailsComponent {
  constructor(private router: Router) {}

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile!: File;

  next() {
    if (!this.imagePreview) {
      alert('Please add a profile photo before proceeding!');
      return;
    }
    this.router.navigate(['/main']);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imagePreview = null;
    this.selectedFile = undefined as any;
  }
}
