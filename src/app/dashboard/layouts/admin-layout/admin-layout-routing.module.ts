import { RouterModule, Routes } from '@angular/router';
import { Commons } from 'src/app/shared/Commons';
import { CustomerRWXGuard } from 'src/app/shared/guards/customer-rwx.guard';
import { CustomerGuard } from 'src/app/shared/guards/customer.guard';
import { HomeComponent } from '../../pages/admin/home/home.component';
import { NgModule } from '@angular/core';

export const AdminLayoutRoutes: Routes = [
    { path: Commons.PATH_PRODUCT, component: HomeComponent, canActivate: [CustomerGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(AdminLayoutRoutes)],
    exports: [RouterModule]
  })
  export class AdminRoutingModule { }