import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Commons } from 'src/app/shared/Commons';
import { AboutComponent } from '../../pages/public/about/about.component';
import { ContactComponent } from '../../pages/public/contact/contact.component';
import { HomeComponent } from '../../pages/public/home/home.component';
import { TermsComponent } from '../../pages/public/terms/terms.component';
import { LoginComponent } from '../../pages/public/user/login/login.component';
import { PasswordChangeComponent } from '../../pages/public/user/password-change/password-change.component';
import { PasswordRecoveryComponent } from '../../pages/public/user/password-recovery/password-recovery.component';
import { ProfileComponent } from '../../pages/public/user/profile/profile.component';
import { RegisterComponent } from '../../pages/public/user/register/register.component';
import { VerifyEmailComponent } from '../../pages/public/user/register/verify-email/verify-email.component';

export const PublicLayoutRoutes: Routes = [
    { path: Commons.PATH_MAIN, component: HomeComponent },
    { path: Commons.PATH_ABOUT, component: AboutComponent },
    { path: Commons.PATH_CONTACT, component: ContactComponent },
    { path: Commons.PATH_TERMS + '/:code', component: TermsComponent },
    { path: Commons.PATH_MY_CUSTOMER, component: ProfileComponent },
    //{ path: Commons.PATH_FAVORITES, component: FavoritesComponent },
    { path: Commons.PATH_LOGIN, component: LoginComponent },
    //{ path: Commons.PATH_ORDERS, component: OrdersComponent },
    { path: Commons.PATH_PWD_REC, component: PasswordRecoveryComponent },
    { path: Commons.PATH_PWD_CHN, component: PasswordChangeComponent },
    { path: Commons.PATH_REGISTER, component: RegisterComponent },
    { path: Commons.PATH_MAIL_VER, component: VerifyEmailComponent },
];

@NgModule({
    imports: [RouterModule.forChild(PublicLayoutRoutes)],
    exports: [RouterModule]
  })
  export class PublicRoutingModule { }
