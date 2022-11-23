import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { AdminLayoutRoutes, AdminRoutingModule } from './admin-layout-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule } from '@ngneat/transloco';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { SharedModule } from 'src/app/shared/shared.module';
import { NameFormatPipe } from 'src/app/shared/pipes/name-format.pipe';
import { AdminHomeComponent } from '../../pages/admin/admin-home/admin-home.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AdminLayoutComponent } from './admin-layout.component';
import { AdminHeaderComponent } from '../../pages/admin/admin-home/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../pages/admin/admin-home/admin-footer/admin-footer.component';
import { ConfigurationComponent } from '../../pages/admin/configuration/configuration.component';

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
    SharedModule,
    SlickCarouselModule,
    AdminRoutingModule
  ],
  declarations: [
    AdminLayoutComponent,
    AdminHomeComponent,
    AdminHeaderComponent,
    AdminFooterComponent,
    ConfigurationComponent
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'always' } },
    NameFormatPipe,
  ],
  bootstrap: [AdminLayoutComponent]
})

export class AdminLayoutModule {}
