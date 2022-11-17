import { Routes } from '@angular/router';
import { HomeComponent } from 'src/app/public/views/home/home.component';
import { Commons } from 'src/app/shared/Commons';
import { AboutComponent } from '../../pages/public/about/about.component';
import { ContactComponent } from '../../pages/public/contact/contact.component';
import { FaqsComponent } from '../../pages/public/faqs/faqs.component';
import { CartComponent } from '../../pages/public/home/productsingle/cart/cart.component';
import { CheckoutComponent } from '../../pages/public/home/productsingle/cart/checkout/checkout.component';
import { ProductsingleComponent } from '../../pages/public/home/productsingle/productsingle.component';
import { TermsAndConditionsComponent } from '../../pages/public/terms/terms-and-conditions/terms-and-conditions.component';
import { FavoritesComponent } from '../../pages/public/user/favorites/favorites.component';
import { LoginComponent } from '../../pages/public/user/login/login.component';
import { OrdersComponent } from '../../pages/public/user/orders/orders.component';
import { ProfileComponent } from '../../pages/public/user/profile/profile.component';

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
];
