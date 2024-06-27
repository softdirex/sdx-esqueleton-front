import { RouterModule, Routes } from '@angular/router';
import { Commons } from 'src/app/shared/Commons';
import { CustomerGuard } from 'src/app/shared/guards/customer.guard';
import { AdminHomeComponent } from '../../pages/admin/admin-home/admin-home.component';
import { NgModule } from '@angular/core';
import { ConfigurationComponent } from '../../pages/admin/configuration/configuration.component';
import { CustomerRWXGuard } from 'src/app/shared/guards/customer-rwx.guard';
import { InventoryComponent } from '../../pages/admin/inventory/inventory.component';
import { ClientsComponent } from '../../pages/admin/clients/clients.component';
import { OrdersComponent } from '../../pages/admin/orders/orders.component';
import { MarketComponent } from '../../pages/admin/market/market.component';

export const AdminLayoutRoutes: Routes = [
    { path: Commons.PATH_PRODUCT, component: AdminHomeComponent, canActivate: [CustomerGuard] },
    { path: Commons.PATH_CONFIG_WITH_LIC, component: ConfigurationComponent, canActivate: [CustomerRWXGuard] },
    { path: Commons.PATH_ADMIN_INVENTORY, component: InventoryComponent, canActivate: [CustomerRWXGuard] },
    { path: Commons.PATH_ADMIN_CLIENTS, component: ClientsComponent, canActivate: [CustomerRWXGuard] },
    { path: Commons.PATH_ADMIN_ORDERS, component: OrdersComponent, canActivate: [CustomerRWXGuard] },
    { path: Commons.PATH_ADMIN_MARKET, component: MarketComponent, canActivate: [CustomerRWXGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(AdminLayoutRoutes)],
    exports: [RouterModule]
  })
  export class AdminRoutingModule { }