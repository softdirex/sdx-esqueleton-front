import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertModalComponent } from './shared/modals/alert-modal/alert-modal.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { SharedModule } from './shared/shared.module';
import { AlertLinkModalComponent } from './shared/modals/alert-link-modal/alert-link-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { ConfirmModalComponent } from './shared/modals/confirm-modal/confirm-modal.component';
import { SelectCompanyComponent } from './shared/modals/select-company/select-company.component';
import { SelectLanguageModalComponent } from './shared/modals/select-language-modal/select-language-modal.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { environment } from 'src/environments/environment';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';

@NgModule({
  declarations: [
    AppComponent,
    AlertModalComponent,
    AlertLinkModalComponent,
    ConfirmModalComponent,
    SelectCompanyComponent,
    SelectLanguageModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatGridListModule,
    SharedModule,
    HttpClientModule,
    MdbModalModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    NgIdleKeepaliveModule.forRoot(),
    RecaptchaV3Module,
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
