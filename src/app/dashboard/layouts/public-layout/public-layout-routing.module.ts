import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Commons } from 'src/app/shared/Commons';
import { AboutComponent } from '../../pages/public/about/about.component';
import { ContactComponent } from '../../pages/public/contact/contact.component';
import { FaqsComponent } from '../../pages/public/faqs/faqs.component';
import { HomeComponent } from '../../pages/public/home/home.component';
import { CartComponent } from '../../pages/public/home/productsingle/cart/cart.component';
import { CheckoutComponent } from '../../pages/public/home/productsingle/cart/checkout/checkout.component';
import { ProductsingleComponent } from '../../pages/public/home/productsingle/productsingle.component';
import { TermsAndConditionsComponent } from '../../pages/public/terms/terms-and-conditions/terms-and-conditions.component';
import { FavoritesComponent } from '../../pages/public/user/favorites/favorites.component';
import { LoginComponent } from '../../pages/public/user/login/login.component';
import { OrdersComponent } from '../../pages/public/user/orders/orders.component';
import { PasswordChangeComponent } from '../../pages/public/user/password-change/password-change.component';
import { PasswordRecoveryComponent } from '../../pages/public/user/password-recovery/password-recovery.component';
import { ProfileComponent } from '../../pages/public/user/profile/profile.component';
import { RegisterComponent } from '../../pages/public/user/register/register.component';
import { VerifyEmailComponent } from '../../pages/public/user/register/verify-email/verify-email.component';

export const PublicLayoutRoutes: Routes = [
    { path: Commons.PATH_MAIN, component: HomeComponent },
    { path: Commons.PATH_ABOUT, component: AboutComponent },
    { path: Commons.PATH_CONTACT, component: ContactComponent },
    { path: Commons.PATH_FACTS, component: FaqsComponent },
    { path: Commons.PATH_PRODUCT_SINGLE + '/:id', component: ProductsingleComponent },
    { path: Commons.PATH_CART, component: CartComponent },
    { path: Commons.PATH_CHECKOUT, component: CheckoutComponent },
    { path: Commons.PATH_TERMS + '/:code', component: TermsAndConditionsComponent },
    { path: Commons.PATH_MY_CUSTOMER, component: ProfileComponent },
    { path: Commons.PATH_FAVORITES, component: FavoritesComponent },
    { path: Commons.PATH_LOGIN, component: LoginComponent },
    { path: Commons.PATH_ORDERS, component: OrdersComponent },
    { path: Commons.PATH_PWD_REC, component: PasswordRecoveryComponent },
    { path: Commons.PATH_PWD_CHN, component: PasswordChangeComponent },
    { path: Commons.PATH_REGISTER, component: RegisterComponent },
    { path: Commons.PATH_MAIL_VER, component: VerifyEmailComponent },
];

@NgModule({
    imports: [RouterModule.forChild(PublicLayoutRoutes)],
    exports: [RouterModule]
  })
  export class PublicRoutingModule { }
