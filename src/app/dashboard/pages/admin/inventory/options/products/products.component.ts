import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPagination, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Commons, FILTER, FilterType } from 'src/app/shared/Commons';
import { PaginatorConfig } from 'src/app/shared/config/paginator-config';
import { CommonFilterComponent } from '../../Shared/common-filter/common-filter.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { InputProductComponent } from '../../Modals/input-product/input-product.component';
import { lastValueFrom } from 'rxjs';
import { InventoryService } from '../../services/inventory.service';
import { StoreSelectModalComponent } from '../../Modals/store-select-modal/store-select-modal.component';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
import * as XLSX from 'xlsx';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltipModule,
    NgbPagination,
    FormsModule,
    CommonFilterComponent,
    CommonModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  @Output() selectedOption: EventEmitter<any> = new EventEmitter()
  products: any[] = []
  importResults: any = null;
  filterDate: any = { from: null, to: null }
  loading = false
  page: number = 1
  totalItems: number = 0
  limit: number = 4
  filtersInSelect: FILTER[] = [
    { label: 'label.name', field: 'name', value: '', enabled: false, type: FilterType.STRING },
    { label: 'Categoria', field: 'category', value: '', enabled: false, type: FilterType.STRING },
  ]
  paginator: PaginatorConfig = new PaginatorConfig()
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
  inputProductModal: MdbModalRef<InputProductComponent> | null = null;
  getScreenWidth: any;
  storeSelectModal: MdbModalRef<StoreSelectModalComponent> | null = null;
  confirmModal: MdbModalRef<ConfirmModalComponent> | null = null;
  selectedFile: File | null = null;
  storeId: number = 0;
  modalTitle = 'Producto'
  alertModal: MdbModalRef<AlertModalComponent> | null = null;

  constructor(
    private modalService: MdbModalService,
    private inventoryService: InventoryService,
  ) {

  }

  ngOnInit(): void {
    this.loadItems()
    this.paginator.page = 1
    this.paginator.status = this.paginator.statusActive
    this.getScreenWidth = window.innerWidth
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  get isMobile() {
    return this.getScreenWidth < Commons.MOBILE_WIDTH
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

  close() {
    this.selectedOption.emit(null);
  }

  openItem(item: any) {
    this.inputProductModal = this.modalService.open(InputProductComponent, { data: { product: item } })
  }

  openModalExcel() {
    this.storeSelectModal = this.modalService.open(StoreSelectModalComponent)
  }

  onFilterSelected(paginator: PaginatorConfig) {
    this.paginator = paginator
    //this.loadData()
  }

  async loadItems() {
    try {
      this.limit = this.isMobile ? 4 : 16
      const filters = null//this.inputSearch.value ? `name${Commons.F_EQUAL}${this.inputSearch.value}` : null
      this.loading = true
      const response: any = await lastValueFrom(this.inventoryService.getItems(Commons.sessionCredentials(), filters, null, null, this.limit, this.page, null))
      this.totalItems = response.meta.total
      this.page = response.meta.current_page
      this.products = response.data
      this.loading = false
    } catch (error) {
      this.loading = false
    }
  }

  addItem() {

    this.confirmModal = this.modalService.open(ConfirmModalComponent, {
      data: { title: 'Productos', message: 'Para agregar artículos serás redirigido a Bodegas para que selecciones la ubicación del nuevo artículo', icon: Commons.ICON_WARNING },
    })
    this.confirmModal.onClose.subscribe((accept: any) => {
      if (accept) {
        this.selectedOption.emit({ menu: "Administrar bodegas", icon: "tf-ion-ios-settings-strong", router: "stores", enabled: true });
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.extractStoreIdAndUpload(this.selectedFile);
    } else {
      this.selectedFile = null;

    }
  }

  onUpload(): void {
    if (this.selectedFile && this.storeId !== 0) { // Asegurarse de que storeId no sea el valor predeterminado
      this.loading = true
      this.inventoryService.importExcel(this.storeId, this.selectedFile, Commons.sessionCredentials()).subscribe(
      
        response => {
          this.importResults = response;
          this.loadItems();
          this.loading = false;
        },
        error => {
          this.mapServiceValidationResponse(error.message || 'An error occurred during the import process.');
          this.loading = false;
        }
      );
    } else {
      this.mapServiceValidationResponse('No file selected or storeId missing');
    }
  }

  extractStoreIdAndUpload(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target && e.target.result) {
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const sheetData: (string | number)[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        // Supongamos que el storeId está en la segunda columna y segunda fila
        if (sheetData.length > 1 && sheetData[1].length > 1) {
          const extractedValue = sheetData[1][1];
          this.storeId = typeof extractedValue === 'number' ? extractedValue : Number(extractedValue);
          this.onUpload(); // Llama a onUpload después de extraer el storeId
        } else {
          this.mapServiceValidationResponse('No storeId found in the specified location in the Excel file');
        }
      }
    };
    reader.readAsArrayBuffer(file);
  }

  private mapServiceValidationResponse(detail: any) {
    detail = (detail != undefined && detail != null) ? detail : 'ERROR'
    switch (detail) {
      case 'Exceed the maximum number of filters':
        this.openModal('validations.filters', 'validations.filters-exceed', Commons.ICON_WARNING)
        break;
      case 'Unauthorized, wrong owner':
        this.openModal('validations.operation-not-success', 'validations.unauthorize-user', Commons.ICON_WARNING)
        break;
      case 'Product does not exist':
        this.openModal(this.modalTitle, 'label.resource-not-found', Commons.ICON_WARNING)
        break
      default:
        this.openModal('label.response-error-detail', detail, Commons.ICON_ERROR)
        break;
    }
  }

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }
}


