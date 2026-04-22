import { Injectable } from '@angular/core';

export interface SignupState {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: string;
  nationality: string;
  residence: string;
  kids: string;
  favoriteMovie: string;
  hobby: string;
  smoker: string;
  imagePreview: string | null;
  photoFile: File | null;
}

@Injectable({
  providedIn: 'root',
})
export class SignupStateService {
  data: SignupState = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    age: '',
    nationality: '',
    residence: '',
    kids: '',
    favoriteMovie: '',
    hobby: '',
    smoker: '',
    imagePreview: null,
    photoFile: null,
  };

  reset(): void {
    this.data = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      age: '',
      nationality: '',
      residence: '',
      kids: '',
      favoriteMovie: '',
      hobby: '',
      smoker: '',
      imagePreview: null,
      photoFile: null,
    };
  }
}