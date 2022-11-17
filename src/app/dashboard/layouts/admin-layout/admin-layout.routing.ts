import { Routes } from '@angular/router';
import { Commons } from 'src/app/shared/Commons';
import { CustomerRWXGuard } from 'src/app/shared/guards/customer-rwx.guard';
import { CustomerGuard } from 'src/app/shared/guards/customer.guard';
import { MyCompanyComponent } from '../../pages/admin/my-company/my-company.component';
import { PaymentHistoryComponent } from '../../pages/admin/payment-history/payment-history.component';
import { PublicProductComponent } from '../../pages/admin/public-product/public-product.component';
import { SubscriptionsComponent } from '../../pages/admin/subscriptions/subscriptions.component';

export const AdminLayoutRoutes: Routes = [
    { path: Commons.PATH_MY_COMPANY, component: MyCompanyComponent, canActivate: [CustomerGuard] },
    { path: Commons.PATH_MY_PURCHASES, component: PaymentHistoryComponent, canActivate: [CustomerRWXGuard] },
    { path: Commons.PATH_PRODUCT, component: PublicProductComponent },
    { path: Commons.PATH_MY_LICENCES, component: SubscriptionsComponent, canActivate: [CustomerGuard] },
];