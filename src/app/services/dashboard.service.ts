import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  collectionData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { BOT_PROFILES } from './bot-profiles';

export interface MatchItem {
  uid: string;
  name: string;
  image: string;
  residence: string;
  age: string;
}

export interface ConversationItem {
  id: string;
  participantIds: string[];
  participantMap: {
    [uid: string]: {
      uid: string;
      name: string;
      image: string;
    };
  };
  lastMessage: string;
  updatedAt: any;
  createdAt?: any;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: any;
}

export interface AppUser {
  uid: string;
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  nationality: string;
  residence: string;
  kids: string;
  favoriteMovie: string;
  hobby: string;
  smoker: string;
  photoURL?: string;

  isBot?: boolean;
  botPersonality?: string;
  botReplyDelayMs?: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private firestore: Firestore = inject(Firestore);

  private pendingBotReplies = new Map<string, boolean>();

  private botReplyTemplates: string[] = [
    'Hey, nice to hear from you 😊',
    'That sounds interesting. Tell me more.',
    'Aww, I like that.',
    'You seem really fun to talk to.',
    'Haha, that made me smile.',
    'Really? I want to know more about that.',
    'That is cute 😄',
    'I was hoping you would message me.',
    'You have my attention now 👀',
    'Sounds like we could have a great conversation.',
  ];

  async seedBotProfiles(): Promise<void> {
    for (const bot of BOT_PROFILES) {
      const ref = doc(this.firestore, `users/${bot.uid}`);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, bot);
      }
    }
  }

  private capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  private buildBotReply(bot: AppUser, userMessage: string): string {
    const text = userMessage.toLowerCase().trim();

    if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
      return `Hey, I’m ${this.capitalize(bot.firstName)} 😊 How’s your day going?`;
    }

    if (text.includes('how are you')) {
      return `I’m doing really well. What about you?`;
    }

    if (text.includes('where are you from')) {
      return `I’m from ${bot.residence}. What about you?`;
    }

    if (text.includes('movie')) {
      return `My favorite movie is ${bot.favoriteMovie}. What’s yours?`;
    }

    if (text.includes('hobby') || text.includes('do you like')) {
      return `I really enjoy ${bot.hobby}. What do you like doing for fun?`;
    }

    if (text.includes('bye')) {
      return `Aww okay, talk soon 😌`;
    }

    return this.botReplyTemplates[
      Math.floor(Math.random() * this.botReplyTemplates.length)
    ];
  }

  async triggerBotReply(
    conversationId: string,
    botUser: AppUser,
    humanUser: AppUser,
    userMessage: string
  ): Promise<void> {
    if (!botUser.isBot) return;
    if (this.pendingBotReplies.get(conversationId)) return;

    this.pendingBotReplies.set(conversationId, true);

    const delay = botUser.botReplyDelayMs ?? 1500;
    const replyText = this.buildBotReply(botUser, userMessage);

    setTimeout(async () => {
      try {
        const messagesRef = collection(
          this.firestore,
          `conversations/${conversationId}/messages`
        );

        await addDoc(messagesRef, {
          senderId: botUser.uid,
          receiverId: humanUser.uid,
          text: replyText,
          createdAt: serverTimestamp(),
        });

        const conversationRef = doc(this.firestore, `conversations/${conversationId}`);

        await updateDoc(conversationRef, {
          lastMessage: replyText,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        console.error('Bot reply error:', error);
      } finally {
        this.pendingBotReplies.delete(conversationId);
      }
    }, delay);
  }

  async getUserById(uid: string): Promise<AppUser | null> {
    const snap = await getDoc(doc(this.firestore, 'users', uid));
    return snap.exists() ? (snap.data() as AppUser) : null;
  }

  async updateUserProfile(uid: string, data: Partial<AppUser>): Promise<void> {
    await updateDoc(doc(this.firestore, 'users', uid), {
      ...data,
    });
  }

  async updateProfilePhoto(uid: string, file: File): Promise<string> {
    const photoURL = await this.fileToBase64(file);

    await updateDoc(doc(this.firestore, 'users', uid), {
      photoURL,
    });

    return photoURL;
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  }

  async getDiscoverUsers(currentUid: string): Promise<AppUser[]> {
    const snap = await getDocs(collection(this.firestore, 'users'));

    return snap.docs
      .map((d) => d.data() as AppUser)
      .filter((user) => user.uid !== currentUid);
  }

  async likeUser(currentUid: string, targetUser: AppUser): Promise<boolean> {
    const sentLikeRef = doc(
      this.firestore,
      'likes',
      currentUid,
      'sent',
      targetUser.uid
    );

    await setDoc(sentLikeRef, {
      fromUid: currentUid,
      toUid: targetUser.uid,
      createdAt: serverTimestamp(),
    });

    const currentUser = await this.getUserById(currentUid);
    if (!currentUser) return false;

    if (targetUser.isBot) {
      await this.createMatch(currentUser, targetUser);
      return true;
    }

    const reverseLikeRef = doc(
      this.firestore,
      'likes',
      targetUser.uid,
      'sent',
      currentUid
    );

    const reverseLikeSnap = await getDoc(reverseLikeRef);

    if (reverseLikeSnap.exists()) {
      await this.createMatch(currentUser, targetUser);
      return true;
    }

    return false;
  }

  private async createMatch(currentUser: AppUser, targetUser: AppUser): Promise<void> {
    const currentName = `${currentUser.firstName} ${currentUser.lastName}`;
    const targetName = `${targetUser.firstName} ${targetUser.lastName}`;

    await setDoc(doc(this.firestore, 'matches', currentUser.uid, 'items', targetUser.uid), {
      uid: targetUser.uid,
      name: targetName,
      image: targetUser.photoURL || 'assets/profile-demo.jpg',
      residence: targetUser.residence || '',
      age: targetUser.age || '',
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(this.firestore, 'matches', targetUser.uid, 'items', currentUser.uid), {
      uid: currentUser.uid,
      name: currentName,
      image: currentUser.photoURL || 'assets/profile-demo.jpg',
      residence: currentUser.residence || '',
      age: currentUser.age || '',
      createdAt: serverTimestamp(),
    });
  }

  async getMatches(uid: string): Promise<MatchItem[]> {
    const snap = await getDocs(collection(this.firestore, 'matches', uid, 'items'));
    return snap.docs.map((d) => d.data() as MatchItem);
  }

  watchConversations(uid: string): Observable<ConversationItem[]> {
    const q = query(
      collection(this.firestore, 'conversations'),
      where('participantIds', 'array-contains', uid),
      orderBy('updatedAt', 'desc')
    );

    return collectionData(q, { idField: 'id' }) as Observable<ConversationItem[]>;
  }

  watchMessages(conversationId: string): Observable<ChatMessage[]> {
    const q = query(
      collection(this.firestore, 'conversations', conversationId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    return collectionData(q, { idField: 'id' }) as Observable<ChatMessage[]>;
  }

  async openConversation(currentUser: AppUser, otherUser: AppUser): Promise<string> {
    const conversationId = [currentUser.uid, otherUser.uid].sort().join('_');
    const conversationRef = doc(this.firestore, 'conversations', conversationId);
    const conversationSnap = await getDoc(conversationRef);

    if (!conversationSnap.exists()) {
      await setDoc(conversationRef, {
        participantIds: [currentUser.uid, otherUser.uid],
        participantMap: {
          [currentUser.uid]: {
            uid: currentUser.uid,
            name: `${currentUser.firstName} ${currentUser.lastName}`,
            image: currentUser.photoURL || 'assets/profile-demo.jpg',
          },
          [otherUser.uid]: {
            uid: otherUser.uid,
            name: `${otherUser.firstName} ${otherUser.lastName}`,
            image: otherUser.photoURL || 'assets/profile-demo.jpg',
          },
        },
        lastMessage: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    return conversationId;
  }

  async sendMessage(
    currentUser: AppUser,
    otherUser: AppUser,
    text: string
  ): Promise<void> {
    const trimmed = text.trim();
    if (!trimmed) return;

    const conversationId = await this.openConversation(currentUser, otherUser);
    const conversationRef = doc(this.firestore, 'conversations', conversationId);

    await addDoc(collection(this.firestore, 'conversations', conversationId, 'messages'), {
      senderId: currentUser.uid,
      receiverId: otherUser.uid,
      text: trimmed,
      createdAt: serverTimestamp(),
    });

    await updateDoc(conversationRef, {
      lastMessage: trimmed,
      updatedAt: serverTimestamp(),
      participantIds: [currentUser.uid, otherUser.uid],
      participantMap: {
        [currentUser.uid]: {
          uid: currentUser.uid,
          name: `${currentUser.firstName} ${currentUser.lastName}`,
          image: currentUser.photoURL || 'assets/profile-demo.jpg',
        },
        [otherUser.uid]: {
          uid: otherUser.uid,
          name: `${otherUser.firstName} ${otherUser.lastName}`,
          image: otherUser.photoURL || 'assets/profile-demo.jpg',
        },
      },
    });
  }
}