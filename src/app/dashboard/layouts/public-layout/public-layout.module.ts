import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from 'ngx-clipboard';
import { PublicRoutingModule } from './public-layout-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HomeComponent } from '../../pages/public/home/home.component';
import { AboutComponent } from '../../pages/public/about/about.component';
import { ContactComponent } from '../../pages/public/contact/contact.component';
import { ProductsingleComponent } from '../../pages/public/home/productsingle/productsingle.component';
import { CartComponent } from '../../pages/public/home/productsingle/cart/cart.component';
import { CheckoutComponent } from '../../pages/public/home/productsingle/cart/checkout/checkout.component';
import { TermsComponent } from '../../pages/public/terms/terms.component';
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
import { PasswordRecoveryComponent } from '../../pages/public/user/password-recovery/password-recovery.component';
import { PasswordChangeComponent } from '../../pages/public/user/password-change/password-change.component';
import { VerifyEmailComponent } from '../../pages/public/user/register/verify-email/verify-email.component';
import { RegisterComponent } from '../../pages/public/user/register/register.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
    PublicRoutingModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [
    PublicLayoutComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    ProductsingleComponent,
    CartComponent,
    CheckoutComponent,
    TermsComponent,
    ProfileComponent,
    FavoritesComponent,
    LoginComponent,
    OrdersComponent,
    HeaderComponent,
    FooterComponent,
    PasswordRecoveryComponent,
    PasswordChangeComponent,
    RegisterComponent,
    VerifyEmailComponent
  ],
  providers: [
    NameFormatPipe,
  ],
  exports: [
    MatFormFieldModule,
  ],
  bootstrap: [PublicLayoutComponent]
})

export class PublicLayoutModule { }
