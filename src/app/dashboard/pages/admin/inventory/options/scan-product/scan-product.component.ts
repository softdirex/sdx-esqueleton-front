import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { InputProductComponent } from '../../Modals/input-product/input-product.component';
import { Commons } from 'src/app/shared/Commons';
import { InventoryService } from '../../services/inventory.service';
import { lastValueFrom } from 'rxjs';
import { Product } from '../../Models/Product';
import { InputStockComponent } from '../../Modals/input-stock/input-stock.component';

@Component({
  selector: 'app-scan-product',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltipModule,
    FormsModule
  ],
  templateUrl: './scan-product.component.html',
  styleUrl: './scan-product.component.css'
})
export class ScanProductComponent implements OnInit {
  @Output() selectedOption: EventEmitter<any> = new EventEmitter()
  barcode: string = ''
  //products: any[] = []
  product: any = null
  DUESTOCK_ALERT: string = `<div class="alert-danger border-0">
  <h6 class="mt-2 text-center"><i class="tf-ion-ios-information"></i> Expiración</h6>
</div>`
  MINSTOCK_ALERT: string = `<div class="alert-danger border-0">
  <h6 class="mt-2 text-center"><i class="tf-ion-ios-information"></i> Stock mínimo</h6>
</div>`
  MAXSTOCK_ALERT: string = `<div class="alert-warning border-0">
  <h6 class="mt-2 text-center"><i class="tf-ion-ios-information"></i> Stock máximo</h6>
</div>`
  EMPTYSTOCK_ALERT: string = `<div class="alert-warning border-0">
  <h6 class="mt-2 text-center"><i class="tf-ion-ios-information"></i> Sin stock</h6>
</div>`
  options: any[] = []
  inputProductModal: MdbModalRef<InputProductComponent> | null = null;
  inputStockModal: MdbModalRef<InputStockComponent> | null = null;
  getScreenWidth: any;
  errorMessage: string = ''
  loading: boolean = false
  itemsToSelect: any[] = []

  constructor(
    private modalService: MdbModalService,
    private inventoryService: InventoryService
  ) {

  }

  ngOnInit(): void {
    this.options = this.optionsMenu
    this.getScreenWidth = window.innerWidth
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  openItem() {
    this.inputProductModal = this.modalService.open(InputProductComponent, { data: { product: this.product } })
  }

  onAction(option: any) {
    switch (option.router) {
      case 'product-edit':
        this.openItem();
        break;
      case 'product-add':
        this.increaseStock();
        break;
      case 'product-discount':
        this.decreaseStock();
        break;
      default:
        console.warn(`No action defined for router: ${option.router}`);
        break;
    }
  }

  close() {
    this.selectedOption.emit(null);
  }

  async searchProduct() {
    this.itemsToSelect = []
    this.errorMessage = ''
    try {
      const apiRS: any = await lastValueFrom(this.inventoryService.getItems(Commons.sessionCredentials(), `bar_code${Commons.F_EQUAL}${this.barcode}`, null, null, null, 1, null))
      if (apiRS.data && apiRS.data.length > 0) {
        if (apiRS.data.length == 1) return apiRS.data[0]
        this.itemsToSelect = apiRS.data
        return null
      }
      this.errorMessage = 'Producto no encontrado'
    } catch (error: any) {
      this.errorMessage = error.error ? error.error.detail : error.message
      if (this.errorMessage === 'Error in POST login service') this.errorMessage = 'Error temporal, intente nuevamente'
    }
    return null
  }

  async gbc() {
    this.loading = true
    this.product = await this.searchProduct()
    this.loading = false
  }

  cbc() {
    this.barcode = ''
    this.product = null
  }

  select(item: Product) {
    this.itemsToSelect = []
    this.product = item
  }

  getAlert(item: any) {
    let alert = `<div class="alert-success border-0">
    <h6 class="mt-2 text-center"><i class="tf-ion-ios-checkmark"></i> Stock óptimo</h6>
  </div>`
    alert = (item.stock_max > 0 && item.stock_max <= item.stock) ? this.MAXSTOCK_ALERT : alert;
    alert = (item.stock_min >= item.stock) ? this.MINSTOCK_ALERT : alert;
    alert = (item.stock == 0) ? this.EMPTYSTOCK_ALERT : alert;
    if (item.due_date) {
      let due_date = new Date(item.due_date)
      alert = (due_date.getTime() === (new Date()).getTime() || due_date.getTime() < (new Date()).getTime()) ? this.DUESTOCK_ALERT : alert;
    }
    return alert
  }

  getProducts(stores: any[]): any[] {
    let list: any[] = [];
    stores.forEach((store: any) => {
      let subList = this.listProducts(store.areas);
      if (subList && subList.length > 0) {
        list.push(...subList);
      }
    })
    return list
  }

  listProducts(areas: any[]): any[] {
    let list: any[] = [];
    areas.forEach((area: any) => {
      // Agregar los elementos del área actual a la lista
      if (area.items) {
        list.push(...area.items);
      }
      // Si hay subáreas, llamar recursivamente a listProducts para obtener sus elementos
      if (area.subareas) {
        let subList = this.listProducts(area.subareas);
        if (subList && subList.length > 0) {
          list.push(...subList);
        }
      }
    });
    return list;
  }

  get isMobile() {
    return this.getScreenWidth < Commons.MOBILE_WIDTH
  }

  get optionsMenu() {
    return [
      { menu: "Añadir stock", icon: "tf-ion-ios-plus", router: "product-add" },
      { menu: "Descontar stock", icon: "tf-ion-minus-circled", router: "product-discount" },
      { menu: "Imprimir código", icon: "tf-ion-ios-printer", router: "product-print" },
      { menu: "Editar Producto", icon: "tf-ion-edit", router: "product-edit" },
    ]
  }

  increaseStock() {
    this.inputStockModal = this.modalService.open(InputStockComponent, { data: { product: this.product, option: Commons.INCREASE } })
    this.inputStockModal.onClose.subscribe(async (data: any) => {
      if (data) {
        this.product = data
      }
    });
  }

  decreaseStock() {
    this.inputStockModal = this.modalService.open(InputStockComponent, { data: { product: this.product, option: Commons.DECREASE } })
    this.inputStockModal.onClose.subscribe(async (data: any) => {
      if (data) {
        this.product = data
      }
    });
  }
}
