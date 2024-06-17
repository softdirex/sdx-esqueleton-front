import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Commons } from 'src/app/shared/Commons';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { InputProductComponent } from '../../../../Modals/input-product/input-product.component';
import { NgbPagination, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { InventoryService } from '../../../../services/inventory.service';
import { lastValueFrom } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';

@Component({
  selector: 'app-list-items',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltipModule,
    NgbPagination,
  ],
  templateUrl: './list-items.component.html',
  styleUrl: './list-items.component.css'
})
export class ListItemsComponent implements OnInit {
  @Input() items: any[] = []
  @Input() meta: any = null
  getScreenWidth: any;
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
  page = 1
  limit: number = 4
  inputSearch = new UntypedFormControl('', [Validators.required, Validators.pattern(environment.aboutRegex), Validators.maxLength(200), Validators.minLength(2)]);
  area: any = []
  loading = false
  totalItems: number = 0
  paramStoreId: number | null = null
  paramAreaId: number | null = null
  confirmModal: MdbModalRef<ConfirmModalComponent> | null = null;
  modalTitle = 'Eliminando '
  alertModal: MdbModalRef<AlertModalComponent> | null = null;




  constructor(
    private modalService: MdbModalService,
    private inventoryService: InventoryService,
  ) {

  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth
    this.loadMeta()
  }

  openItem(item: any) {
    this.inputProductModal = this.modalService.open(InputProductComponent, { data: { product: item } })
  }

  createProduct(area: any) {

  }


  delete(item: any, items: any[]) {
    // Verifica si el estado de la tienda es igual o superior a STATUS_ACTIVE
    if (item.status >= Commons.STATUS_ACTIVE) {
      // Abre un modal de confirmación
      this.confirmModal = this.modalService.open(ConfirmModalComponent, {
        data: { title: this.modalTitle + item.name, message: 'label.item-remove', icon: Commons.ICON_WARNING },
      });

      // Se suscribe al cierre del modal de confirmación
      this.confirmModal.onClose.subscribe((accept: any) => {
        // Si el usuario acepta la confirmación
        if (accept) {
          this.loading = true;

          // Llama al servicio para eliminar la tienda en el backend
          this.inventoryService.deleteItem(item.id, Commons.sessionCredentials())
            .subscribe({
              next: (v) => {
                // Si la respuesta no es nula
                if (v != null) {
                  // Encuentra el índice de la tienda en el arreglo
                  const index = items.indexOf(item);
                  // Si la tienda está en el arreglo, la elimina
                  if (index !== -1) {
                    items.splice(index, 1);
                  }
                }
                this.loading = false;
              },
              error: (e) => {
                // Maneja el error y establece el estado de carga en falso
                this.mapServiceValidationResponse((e.error != null && e.error != undefined) ? e.error.detail : 'ERROR');
                this.loading = false;
              },
              complete: () => { }
            });
        }
      });
    }
  }

  private mapServiceValidationResponse(detail: any) {
    detail = (detail != undefined && detail != null) ? detail : 'ERROR'
    switch (detail) {
      case 'Unauthorized, wrong owner':
        this.openModal('validations.operation-not-success', 'validations.unauthorize-user', Commons.ICON_WARNING)
        break;
      case 'Item does not exist':
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

  async onPageChange() {
    await this.loadItems();
  }

  async loadItems() {
    try {
      const filters = null//this.inputSearch.value ? `name${Commons.F_EQUAL}${this.inputSearch.value}` : null
      this.loading = true
      this.buildParentIdFromUrl(this.meta.first_page_url)
      const response: any = await lastValueFrom(this.inventoryService.getItems(Commons.sessionCredentials(), filters, this.paramStoreId, this.paramAreaId, this.limit, this.page, null))
      this.meta = response.meta
      this.loadMeta()
      this.items = response.data
      this.loading = false
    } catch (error) {
      this.loading = false
    }
  }

  loadMeta() {
    if (this.meta) {
      this.limit = this.meta.per_page
      this.totalItems = this.meta.total
      this.page = this.meta.current_page
    }
  }

  buildParentIdFromUrl(url: string) {
    try {
      const parsedUrl = new URL(url, 'http://example.com'); // 'http://example.com' es un base URL para completar la URL en caso de que sea relativa
      const params = parsedUrl.searchParams;
      const stId = params.get('store_id');
      const arId = params.get('area_id');
      this.paramStoreId = stId ? Number.parseInt(stId) : null
      this.paramAreaId = arId ? Number.parseInt(arId) : null
    } catch (error) {
    }
  }

  get isMobile() {
    return this.getScreenWidth < Commons.MOBILE_WIDTH
  }
}
