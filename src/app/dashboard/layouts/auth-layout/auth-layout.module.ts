import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutRoutes } from './auth-layout.routing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LoginComponent } from '../../pages/auth/login/login.component';
import { RegisterComponent } from '../../pages/auth/register/register.component';
import { TranslocoModule } from '@ngneat/transloco';
import { SharedModule } from 'src/app/shared/shared.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { RutPipe } from 'src/app/shared/utils/pipes/rut.pipe';
import { NameFormatPipe } from 'src/app/shared/utils/pipes/name-format.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VerifyEmailComponent } from 'src/app/pages/auth/register/verify-email/verify-email.component';
import { PwdRecoveryComponent } from 'src/app/pages/auth/login/pwd-recovery/pwd-recovery.component';
import { PwdChangeComponent } from 'src/app/pages/auth/login/pwd-recovery/pwd-change/pwd-change.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatAutocompleteModule,
    SharedModule,
    MatDatepickerModule,
    NgbModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyEmailComponent,
    PwdRecoveryComponent,
    PwdChangeComponent,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'always' } },
    RutPipe,
    NameFormatPipe,
    DatePipe
  ]
})
export class AuthLayoutModule { }
