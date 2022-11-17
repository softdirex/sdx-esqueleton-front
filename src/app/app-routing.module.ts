import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsingleComponent } from './public/views/home/productsingle/productsingle.component';
import { HomeComponent } from './public/views/home/home.component';
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