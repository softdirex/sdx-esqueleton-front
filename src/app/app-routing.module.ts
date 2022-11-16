import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsingleComponent } from './sdxFront/views/home/productsingle/productsingle.component';
import { HomeComponent } from './sdxFront/views/home/home.component';
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
const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "product-single/:id", component: ProductsingleComponent },
  { path: "cart", component: CartComponent },
  { path: "checkout", component: CheckoutComponent },
  { path: "about", component: AboutComponent },
  { path: "contact", component: ContactComponent },
  { path: "terms/privacy-policy", component: PrivacyPolicyComponent },
  { path: "terms/conditions-terms", component: TermsAndConditionsComponent },
  { path: "terms/cookie-policy", component: CookiePolicyComponent },
  { path: "terms/sales-terms", component: SalesTermsComponent },
  { path: "faqs", component: FaqsComponent },
  { path: "login", component: LoginComponent },
  { path: "user/profile", component: ProfileComponent },
  { path: "user/orders", component: OrdersComponent },
  { path: "user/favorites", component: FavoritesComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }