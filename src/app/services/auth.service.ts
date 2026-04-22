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

import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { BOT_PROFILES } from './bot-profiles';

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
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private router = inject(Router);

  async seedBotProfiles(): Promise<void> {
    for (const bot of BOT_PROFILES) {
      const ref = doc(this.firestore, `users/${bot.uid}`);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, bot);
      }
    }
  }

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
    let photoURL = '';

    if (data.photoFile) {
      const filePath = `profile-images/${uid}/${Date.now()}_${data.photoFile.name}`;
      const storageRef = ref(this.storage, filePath);

      await uploadBytes(storageRef, data.photoFile);
      photoURL = await getDownloadURL(storageRef);
    }

    await updateProfile(userCredential.user, {
      displayName: `${data.firstName} ${data.lastName}`,
      photoURL: photoURL || '',
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
}