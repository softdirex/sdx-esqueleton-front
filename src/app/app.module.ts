import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './sdxFront/views/home/header/header.component';
import { FooterComponent } from './sdxFront/views/home/footer/footer.component';
import { HomeComponent } from './sdxFront/views/home/home.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ProductsingleComponent } from './sdxFront/views/home/productsingle/productsingle.component';
import { CartComponent } from './sdxFront/views/home/productsingle/cart/cart.component';
import { CheckoutComponent } from './sdxFront/views/home/productsingle/cart/checkout/checkout.component';
import { AboutComponent } from './sdxFront/views/about/about.component';
import { ContactComponent } from './sdxFront/views/contact/contact.component';
import { FaqsComponent } from './sdxFront/views/faqs/faqs.component';
import { PrivacyPolicyComponent } from './sdxFront/views/terms/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './sdxFront/views/terms/terms-and-conditions/terms-and-conditions.component';
import { CookiePolicyComponent } from './sdxFront/views/terms/cookie-policy/cookie-policy.component';
import { SalesTermsComponent } from './sdxFront/views/terms/sales-terms/sales-terms.component';
import { LoginComponent } from './sdxFront/views/user/login/login.component';
import { ProfileComponent } from './sdxFront/views/user/profile/profile.component';
import { OrdersComponent } from './sdxFront/views/user/orders/orders.component';
import { FavoritesComponent } from './sdxFront/views/user/favorites/favorites.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SlickCarouselModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
