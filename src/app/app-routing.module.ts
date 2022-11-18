import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './dashboard/layouts/admin-layout/admin-layout.component';
import { PublicLayoutComponent } from './dashboard/layouts/public-layout/public-layout.component';
import { Commons } from './shared/Commons';

const routes: Routes = [
  {
    path: '',
    redirectTo: Commons.PATH_MAIN,
    pathMatch: 'full',
  },
  //UNAUTH COMPONENT
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/dashboard/layouts/public-layout/public-layout.module').then(m => m.PublicLayoutModule)
      }
    ]
  },
  /*{
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/dashboard/layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
      }
    ]
  },*/
  {
    path: '**',
    redirectTo: Commons.PATH_MAIN
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: false
    })
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }

