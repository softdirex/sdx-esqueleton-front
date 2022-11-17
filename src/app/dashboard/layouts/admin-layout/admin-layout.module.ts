import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule } from '@ngneat/transloco';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { SharedModule } from 'src/app/shared/shared.module';
import { MyCompanyComponent } from '../../pages/admin/my-company/my-company.component';
import { PaymentHistoryComponent } from '../../pages/admin/payment-history/payment-history.component';
import { PublicProductComponent } from '../../pages/admin/public-product/public-product.component';
import { SubscriptionsComponent } from '../../pages/admin/subscriptions/subscriptions.component';
import { NameFormatPipe } from 'src/app/shared/pipes/name-format.pipe';
// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    TranslocoModule,
    MatAutocompleteModule,
    SharedModule
  ],
  declarations: [
    MyCompanyComponent,
    PaymentHistoryComponent,
    PublicProductComponent,
    SubscriptionsComponent,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'always' } },
    NameFormatPipe,
  ]
})

export class AdminLayoutModule {}
