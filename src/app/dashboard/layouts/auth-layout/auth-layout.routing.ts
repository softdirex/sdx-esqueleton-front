import { Routes } from '@angular/router';
import { PwdChangeComponent } from 'src/app/pages/auth/login/pwd-recovery/pwd-change/pwd-change.component';
import { PwdRecoveryComponent } from 'src/app/pages/auth/login/pwd-recovery/pwd-recovery.component';
import { VerifyEmailComponent } from 'src/app/pages/auth/register/verify-email/verify-email.component';
import { Commons } from 'src/app/shared/utils/commons';

import { LoginComponent } from '../../pages/auth/login/login.component';
import { RegisterComponent } from '../../pages/auth/register/register.component';

export const AuthLayoutRoutes: Routes = [
    { path: Commons.PATH_LOGIN, component: LoginComponent },
    { path: Commons.PATH_REGISTER, component: RegisterComponent },
    { path: Commons.PATH_MAIL_VER, component: VerifyEmailComponent },
    { path: Commons.PATH_PWD_REC, component: PwdRecoveryComponent },
    { path: Commons.PATH_PWD_CHN, component: PwdChangeComponent }
];
