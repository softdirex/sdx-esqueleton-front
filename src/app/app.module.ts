import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertModalComponent } from './shared/modals/alert-modal/alert-modal.component';4
import { MatGridListModule } from '@angular/material/grid-list';
import { SharedModule } from './shared/shared.module';
import { AlertLinkModalComponent } from './shared/modals/alert-link-modal/alert-link-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { ConfirmModalComponent } from './shared/modals/confirm-modal/confirm-modal.component';
import { SelectCompanyComponent } from './shared/modals/select-company/select-company.component';
import { SelectLanguageModalComponent } from './shared/modals/select-language-modal/select-language-modal.component';

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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
