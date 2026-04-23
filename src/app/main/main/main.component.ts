import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../services/auth.service';
import {
  AppUser,
  ChatMessage,
  ConversationItem,
  DashboardService,
  MatchItem,
} from '../../services/dashboard.service';

type DashboardTab = 'discover' | 'matches' | 'messages' | 'likes' | 'profile';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit, OnDestroy {
  private auth = inject(Auth);
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private router = inject(Router);

  private conversationsSub?: Subscription;
  private messagesSub?: Subscription;
  mobileMenuOpen = false;

  activeTab: DashboardTab = 'discover';

  loading = false;
  errorMessage = '';
  successMessage = '';

  currentUser: AppUser | null = null;
  discoverUsers: AppUser[] = [];
  matches: MatchItem[] = [];
  likes: MatchItem[] = [];
  conversations: ConversationItem[] = [];
  chatMessages: ChatMessage[] = [];

  selectedChatUser: AppUser | null = null;
  selectedConversationId = '';
  newMessage = '';

  editMode = false;

  profileForm = {
    firstName: '',
    lastName: '',
    age: '',
    nationality: '',
    residence: '',
    kids: '',
    favoriteMovie: '',
    hobby: '',
    smoker: '',
  };

  async ngOnInit(): Promise<void> {
    await this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.conversationsSub?.unsubscribe();
    this.messagesSub?.unsubscribe();
  }

  async loadDashboard(): Promise<void> {
    try {
      this.loading = true;
      this.errorMessage = '';

      const authUser = this.auth.currentUser;

      if (!authUser) {
        await this.router.navigate(['/login']);
        return;
      }

      const profile = await this.dashboardService.getUserById(authUser.uid);

      if (!profile) {
        this.errorMessage = 'User profile was not found.';
        return;
      }

      await this.dashboardService.seedBotProfiles();

      this.currentUser = profile;
      this.setProfileForm(profile);

      await Promise.all([
        this.loadDiscoverUsers(),
        this.loadMatches(),
      ]);

      this.subscribeToConversations();
    } catch (error) {
      console.error('Dashboard load error:', error);
      this.errorMessage = 'Failed to load dashboard data.';
    } finally {
      this.loading = false;
    }
  }

  setActiveTab(tab: DashboardTab): void {
    this.activeTab = tab;
  }

  private setProfileForm(user: AppUser): void {
    this.profileForm = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      age: user.age || '',
      nationality: user.nationality || '',
      residence: user.residence || '',
      kids: user.kids || '',
      favoriteMovie: user.favoriteMovie || '',
      hobby: user.hobby || '',
      smoker: user.smoker || '',
    };
  }

  async loadDiscoverUsers(): Promise<void> {
    if (!this.currentUser) return;
    this.discoverUsers = await this.dashboardService.getDiscoverUsers(this.currentUser.uid);
  }

  async loadMatches(): Promise<void> {
    if (!this.currentUser) return;

    this.matches = await this.dashboardService.getMatches(this.currentUser.uid);
    this.likes = [...this.matches];
  }

  subscribeToConversations(): void {
    if (!this.currentUser) return;

    this.conversationsSub?.unsubscribe();

    this.conversationsSub = this.dashboardService
      .watchConversations(this.currentUser.uid)
      .subscribe({
        next: (conversations) => {
          this.conversations = conversations;
        },
        error: (error) => {
          console.error('Realtime conversations error:', error);
          this.errorMessage = 'Failed to load conversations.';
        },
      });
  }

  subscribeToMessages(conversationId: string): void {
    this.messagesSub?.unsubscribe();

    this.messagesSub = this.dashboardService.watchMessages(conversationId).subscribe({
      next: (messages) => {
        this.chatMessages = messages;
      },
      error: (error) => {
        console.error('Realtime messages error:', error);
        this.errorMessage = 'Failed to load messages.';
      },
    });
  }

  async saveProfile(): Promise<void> {
    if (!this.currentUser) return;

    try {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      await this.dashboardService.updateUserProfile(this.currentUser.uid, {
        firstName: this.profileForm.firstName,
        lastName: this.profileForm.lastName,
        age: this.profileForm.age,
        nationality: this.profileForm.nationality,
        residence: this.profileForm.residence,
        kids: this.profileForm.kids,
        favoriteMovie: this.profileForm.favoriteMovie,
        hobby: this.profileForm.hobby,
        smoker: this.profileForm.smoker,
      });

      this.currentUser = {
        ...this.currentUser,
        ...this.profileForm,
      };

      this.successMessage = 'Profile updated successfully.';
      this.editMode = false;

      await this.loadDiscoverUsers();
      await this.loadMatches();
    } catch (error) {
      console.error('Profile update error:', error);
      this.errorMessage = 'Failed to update profile.';
    } finally {
      this.loading = false;
    }
  }

  async likeUser(user: AppUser, ): Promise<void> {
    if (!this.currentUser) return;

    try {
      const matched = await this.dashboardService.likeUser(this.currentUser.uid, user);

      if (matched) {
        await this.loadMatches();
      }
    } catch (error) {
      console.error('Like user error:', error);
      this.errorMessage = 'Failed to like user.';
    }
  }

  async openChatFromDiscover(user: AppUser): Promise<void> {
    if (!this.currentUser) return;

    try {
      this.selectedChatUser = user;
      this.selectedConversationId = await this.dashboardService.openConversation(
        this.currentUser,
        user
      );
      this.subscribeToMessages(this.selectedConversationId);
      this.activeTab = 'messages';
    } catch (error) {
      console.error('Open chat error:', error);
      this.errorMessage = 'Failed to open chat.';
    }
  }

  async openChatFromMatch(match: MatchItem): Promise<void> {
    if (!this.currentUser) return;

    const otherUser = await this.dashboardService.getUserById(match.uid);
    if (!otherUser) return;

    this.selectedChatUser = otherUser;
    this.selectedConversationId = await this.dashboardService.openConversation(
      this.currentUser,
      otherUser
    );
    this.subscribeToMessages(this.selectedConversationId);
    this.activeTab = 'messages';
  }

  async openConversation(conversation: ConversationItem): Promise<void> {
    if (!this.currentUser) return;

    const otherUserId = conversation.participantIds.find(
      (id) => id !== this.currentUser!.uid
    );

    if (!otherUserId) return;

    const otherUser = await this.dashboardService.getUserById(otherUserId);
    if (!otherUser) return;

    this.selectedConversationId = conversation.id;
    this.selectedChatUser = otherUser;
    this.subscribeToMessages(conversation.id);
    this.activeTab = 'messages';
  }

  getConversationName(conversation: ConversationItem): string {
    if (!this.currentUser) return 'Unknown User';

    const otherUserId = conversation.participantIds?.find(
      (id) => id !== this.currentUser!.uid
    );

    if (!otherUserId) return 'Unknown User';

    return conversation.participantMap?.[otherUserId]?.name || 'Unknown User';
  }

  getConversationImage(conversation: ConversationItem): string {
    if (!this.currentUser) return 'assets/profile-demo.jpg';

    const otherUserId = conversation.participantIds?.find(
      (id) => id !== this.currentUser!.uid
    );

    if (!otherUserId) return 'assets/profile-demo.jpg';

    return conversation.participantMap?.[otherUserId]?.image || 'assets/profile-demo.jpg';
  }

  async sendMessage(): Promise<void> {
    if (!this.currentUser || !this.selectedChatUser || !this.newMessage.trim()) return;

    const messageText = this.newMessage.trim();

    try {
      await this.dashboardService.sendMessage(
        this.currentUser,
        this.selectedChatUser,
        messageText
      );

      this.newMessage = '';

      if (this.selectedChatUser.isBot) {
        await this.dashboardService.triggerBotReply(
          this.selectedConversationId,
          this.selectedChatUser,
          this.currentUser,
          messageText
        );
      }
    } catch (error) {
      console.error('Send message error:', error);
      this.errorMessage = 'Failed to send message.';
    }
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }

  get fullName(): string {
    if (!this.currentUser) return '';
    return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  }

  get profileImage(): string {
    return this.currentUser?.photoURL || 'assets/profile-demo.jpg';
  }
}