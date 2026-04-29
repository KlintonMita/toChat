import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  UserCredential,
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  setDoc,
  getDoc,
} from '@angular/fire/firestore';

export interface SignUpData {
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
  photoFile?: File | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router = inject(Router);

  async login(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(data: SignUpData): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      data.email,
      data.password
    );

    const uid = userCredential.user.uid;

    const photoURL = data.photoFile
      ? await this.fileToBase64(data.photoFile)
      : '';

      await updateProfile(userCredential.user, {
        displayName: `${data.firstName} ${data.lastName}`,
      });

    await setDoc(doc(this.firestore, 'users', uid), {
      uid,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age,
      nationality: data.nationality,
      residence: data.residence,
      kids: data.kids,
      favoriteMovie: data.favoriteMovie,
      hobby: data.hobby,
      smoker: data.smoker,
      photoURL,
      createdAt: new Date().toISOString(),
    });
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    await this.router.navigate(['/login']);
  }

  async getCurrentUserProfile() {
    const user = this.auth.currentUser;
    if (!user) return null;

    const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
    return userDoc.exists() ? userDoc.data() : null;
  }

  // ✅ Base64 helper
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}