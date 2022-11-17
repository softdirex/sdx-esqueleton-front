import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './public/views/home/header/header.component';
import { FooterComponent } from './public/views/home/footer/footer.component';
import { HomeComponent } from './public/views/home/home.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ProductsingleComponent } from './public/views/home/productsingle/productsingle.component';
import { CartComponent } from './public/views/home/productsingle/cart/cart.component';
import { CheckoutComponent } from './public/views/home/productsingle/cart/checkout/checkout.component';
import { AboutComponent } from './public/views/about/about.component';
import { ContactComponent } from './public/views/contact/contact.component';
import { FaqsComponent } from './public/views/faqs/faqs.component';
import { PrivacyPolicyComponent } from './public/views/terms/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './public/views/terms/terms-and-conditions/terms-and-conditions.component';
import { CookiePolicyComponent } from './public/views/terms/cookie-policy/cookie-policy.component';
import { SalesTermsComponent } from './public/views/terms/sales-terms/sales-terms.component';
import { LoginComponent } from './public/views/user/login/login.component';
import { ProfileComponent } from './public/views/user/profile/profile.component';
import { OrdersComponent } from './public/views/user/orders/orders.component';
import { FavoritesComponent } from './public/views/user/favorites/favorites.component';
import { AlertModalComponent } from './shared/modals/alert-modal/alert-modal.component';4
import { MatGridListModule } from '@angular/material/grid-list';
import { SharedModule } from './shared/shared.module';
import { AlertLinkModalComponent } from './shared/modals/alert-link-modal/alert-link-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { ConfirmModalComponent } from './shared/modals/confirm-modal/confirm-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProductsingleComponent,
    CartComponent,
    CheckoutComponent,
    AboutComponent,
    ContactComponent,
    FaqsComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    CookiePolicyComponent,
    SalesTermsComponent,
    LoginComponent,
    ProfileComponent,
    OrdersComponent,
    FavoritesComponent,
    AlertModalComponent,
    AlertLinkModalComponent,
    ConfirmModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SlickCarouselModule,
    MatGridListModule,
    SharedModule,
    HttpClientModule,
    MdbModalModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
