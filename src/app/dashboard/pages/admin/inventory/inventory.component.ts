import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Commons } from 'src/app/shared/Commons';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoresComponent } from './options/stores/stores.component';
import { ProductsComponent } from './options/products/products.component';
import { BuyOrderComponent } from './options/buy-order/buy-order.component';
import { ReportsComponent } from './options/reports/reports.component';
import { ActionHistoryComponent } from './options/action-history/action-history.component';
import { ScanProductComponent } from './options/scan-product/scan-product.component';
import { ProvidersComponent } from './options/providers/providers.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    SharedModule,
    TitleCasePipe,
    CommonModule,
    /* BEGIN - OPTIONS COMPONENTS */
    StoresComponent,
    ProductsComponent,
    BuyOrderComponent,
    ReportsComponent,
    ActionHistoryComponent,
    ScanProductComponent,
    ProvidersComponent,
    /* END - OPTIONS COMPONENTS */
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {

  getScreenWidth: any;
  selectedStore: any = null
  selectedOption: any = null
  options: any[] = []
  isViewer: boolean = true

  constructor(
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.isViewer = Commons.isInvViewer()
    this.options = this.optionsMenu
    this.getScreenWidth = window.innerWidth
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  onSelectOption(option: any) {
    this.selectedOption = option
  }

  onSelectedStore(store: any) {
    this.selectedStore = store
  }

  onSelectedOption(option: any) {
    this.selectedOption = option
  }

  get isMobile() {
    return this.getScreenWidth < Commons.MOBILE_WIDTH
  }

  get optionsMenu() {
    return [
      { menu: "Escanear producto", icon: "tf-ion-ios-barcode", router: "scan", enabled: true },
      { menu: "Productos", icon: "tf-ion-ios-pricetag", router: "products", enabled: true },
      { menu: "Administrar bodegas", icon: "tf-ion-ios-settings-strong", router: "stores", enabled: true },
      { menu: "Cotizacion", icon: "tf-ion-ios-list", router: "buy-order", enabled: this.isViewer ? false : true },
      { menu: "Reporte", icon: "tf-ion-monitor", router: "reports", enabled: true },
      { menu: "Historial de acciones", icon: "tf-ion-ios-stopwatch", router: "action-history", enabled: this.isViewer ? false : true },
      { menu: "Proveedores", icon: "tf-ion-help-buoy", router: "providers", enabled: true },
    ]
  }

}
