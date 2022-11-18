import { RouterModule, Routes } from '@angular/router';
import { Commons } from 'src/app/shared/Commons';
import { CustomerRWXGuard } from 'src/app/shared/guards/customer-rwx.guard';
import { CustomerGuard } from 'src/app/shared/guards/customer.guard';
import { MyCompanyComponent } from '../../pages/admin/my-company/my-company.component';
import { PaymentHistoryComponent } from '../../pages/admin/payment-history/payment-history.component';
import { SubscriptionsComponent } from '../../pages/admin/subscriptions/subscriptions.component';
import { HomeComponent } from '../../pages/admin/home/home.component';
import { NgModule } from '@angular/core';

export const AdminLayoutRoutes: Routes = [
    { path: Commons.PATH_PRODUCT, component: HomeComponent, canActivate: [CustomerGuard] },
    { path: Commons.PATH_MY_COMPANY, component: MyCompanyComponent, canActivate: [CustomerGuard] },
    { path: Commons.PATH_MY_PURCHASES, component: PaymentHistoryComponent, canActivate: [CustomerRWXGuard] },
    //{ path: Commons.PATH_PRODUCT, component: PublicProductComponent },
    { path: Commons.PATH_MY_LICENCES, component: SubscriptionsComponent, canActivate: [CustomerGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(AdminLayoutRoutes)],
    exports: [RouterModule]
  })
  export class AdminRoutingModule { }