import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from 'ngx-clipboard';
import { PublicLayoutRoutes, PublicRoutingModule } from './public-layout-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HomeComponent } from '../../pages/public/home/home.component';
import { AboutComponent } from '../../pages/public/about/about.component';
import { ContactComponent } from '../../pages/public/contact/contact.component';
import { FaqsComponent } from '../../pages/public/faqs/faqs.component';
import { ProductsingleComponent } from '../../pages/public/home/productsingle/productsingle.component';
import { CartComponent } from '../../pages/public/home/productsingle/cart/cart.component';
import { CheckoutComponent } from '../../pages/public/home/productsingle/cart/checkout/checkout.component';
import { TermsAndConditionsComponent } from '../../pages/public/terms/terms-and-conditions/terms-and-conditions.component';
import { ProfileComponent } from '../../pages/public/user/profile/profile.component';
import { FavoritesComponent } from '../../pages/public/user/favorites/favorites.component';
import { LoginComponent } from '../../pages/public/user/login/login.component';
import { OrdersComponent } from '../../pages/public/user/orders/orders.component';
import { NameFormatPipe } from 'src/app/shared/pipes/name-format.pipe';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatGridListModule } from '@angular/material/grid-list';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { HeaderComponent } from '../../pages/public/home/header/header.component';
import { FooterComponent } from '../../pages/public/home/footer/footer.component';
import { PublicLayoutComponent } from './public-layout.component';
// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    SlickCarouselModule,
    MatGridListModule,
    MdbModalModule,
    PublicRoutingModule
  ],
  declarations: [
    PublicLayoutComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    FaqsComponent,
    ProductsingleComponent,
    CartComponent,
    CheckoutComponent,
    TermsAndConditionsComponent,
    ProfileComponent,
    FavoritesComponent,
    LoginComponent,
    OrdersComponent,
    HeaderComponent,
    FooterComponent,
  ],
  providers: [
    NameFormatPipe,
  ],
  bootstrap: [PublicLayoutComponent]
})

export class PublicLayoutModule { }
