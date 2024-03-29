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

let owner = (Commons.getOwner()) ? Commons.getOwner().config : Commons.getDefaultConfig()
let commonData = {
    title: owner.company_name,
    descrption: owner.about,
    ogTitle: owner.company_name,
    ogDescription: owner.about,
    content: owner.tags,
}

export const PublicLayoutRoutes: Routes = [
    {
        path: Commons.PATH_MAIN, component: HomeComponent,
        data: commonData
    },
    {
        path: Commons.PATH_ABOUT, component: AboutComponent,
        data: commonData
    },
    {
        path: Commons.PATH_CONTACT, component: ContactComponent,
        data: commonData
    },
    {
        path: Commons.PATH_TERMS + '/:code', component: TermsComponent,
        data: commonData
    },
    {
        path: Commons.PATH_MY_CUSTOMER, component: ProfileComponent,
        data: commonData
    },
    {
        path: Commons.PATH_LOGIN, component: LoginComponent,
        data: commonData
    },
    {
        path: Commons.PATH_PWD_REC, component: PasswordRecoveryComponent,
        data: commonData
    },
    {
        path: Commons.PATH_PWD_CHN + '/:transientAuth/:lang', component: PasswordChangeComponent,
        data: commonData
    },
    {
        path: Commons.PATH_REGISTER, component: RegisterComponent,
        data: commonData
    },
    {
        path: Commons.PATH_MAIL_VER + '/:transientAuth/:lang', component: VerifyEmailComponent,
        data: commonData
    }
];

@NgModule({
    imports: [RouterModule.forChild(PublicLayoutRoutes)],
    exports: [RouterModule]
  })
  export class PublicRoutingModule { }
