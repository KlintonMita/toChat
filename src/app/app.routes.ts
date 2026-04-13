import { Routes } from '@angular/router';
import { TopContainerComponent } from './top-container/top-container.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ChatComponent } from './sources/chat/chat.component';
import { HelpSourceComponent } from './sources/help-source/help-source.component';
import { ImpressumComponent } from './sources/impressum/impressum.component';
import { TermsAndConditionsComponent } from './sources/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './sources/privacy-policy/privacy-policy.component';
import { SignUpDetailsComponent } from './signup/sign-up-details/sign-up-details/sign-up-details.component';
import { SecondDetailsComponent } from './signup/sign-up-details/second-details/second-details/second-details.component';
import { ThirdDetailsComponent } from './signup/sign-up-details/third-details/third-details/third-details.component';
import { FourthDetailsComponent } from './signup/sign-up-details/fourth-details/fourth-details/fourth-details.component';
import { MainComponent } from './main/main/main.component';

export const routes: Routes = [
  {path: '', component: TopContainerComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signUp', component: SignupComponent},
  {path: 'chatSource', component: ChatComponent},
  {path: 'helpSource', component: HelpSourceComponent},
  {path: 'impressum', component: ImpressumComponent},
  {path: 'termsC', component: TermsAndConditionsComponent},
  {path: 'pPolicy', component:PrivacyPolicyComponent},
  {path: 'sDetails', component: SignUpDetailsComponent},
  {path: 'secondDetails', component: SecondDetailsComponent},
  {path: 'thirdDetails', component: ThirdDetailsComponent},
  {path: 'fourthDetails', component: FourthDetailsComponent},
  {path: 'main', component: MainComponent},
];
