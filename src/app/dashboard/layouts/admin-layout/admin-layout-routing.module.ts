import { RouterModule, Routes } from '@angular/router';
import { Commons } from 'src/app/shared/Commons';
import { CustomerGuard } from 'src/app/shared/guards/customer.guard';
import { AdminHomeComponent } from '../../pages/admin/admin-home/admin-home.component';
import { NgModule } from '@angular/core';

export const AdminLayoutRoutes: Routes = [
    { path: Commons.PATH_PRODUCT, component: AdminHomeComponent, canActivate: [CustomerGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(AdminLayoutRoutes)],
    exports: [RouterModule]
  })
  export class AdminRoutingModule { }