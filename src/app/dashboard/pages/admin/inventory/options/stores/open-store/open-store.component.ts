import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output } from '@angular/core';
import { InputAreaComponent } from '../../../Modals/input-area/input-area.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalOptionEnum } from '../../../Enums/ModalOptionEnum';
import { ListItemsComponent } from './list-items/list-items.component';
import { NgbAccordionButton, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InputProductComponent } from '../../../Modals/input-product/input-product.component';
import { Commons } from 'src/app/shared/Commons';
import { InputStoreComponent } from '../../../Modals/input-store/input-store.component';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
import { InventoryService } from '../../../services/inventory.service';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';
import { lastValueFrom } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';
import { ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Items } from 'src/app/shared/models/Items';

@Component({
  selector: 'app-open-store',
  standalone: true,
  imports: [
    CommonModule,
    InputAreaComponent,
    InputProductComponent,
    ListItemsComponent,
    NgbTooltipModule,
    NgbModule,
    NgbAccordionButton,
    TranslocoModule,
    ReactiveFormsModule
  ],
  templateUrl: './open-store.component.html',
  styleUrl: './open-store.component.css'
})
export class OpenStoreComponent implements OnChanges, OnInit {

  @Input() store: any = null
  @Output() closed = new EventEmitter<any>();
  inputAreaModal: MdbModalRef<InputAreaComponent> | null = null;
  inputProductModal: MdbModalRef<InputProductComponent> | null = null;
  areas: any[] = []
  getScreenWidth: any;
  inputStoreModal: MdbModalRef<InputStoreComponent> | undefined;
  area: any = null
  confirmModal: MdbModalRef<ConfirmModalComponent> | null = null;
  modalTitle = 'Areas'
  loading = false
  alertModal: MdbModalRef<AlertModalComponent> | null = null;
  page: number = 1
  totalItems: number = 0
  limit: number = 4
  inputSearch = new UntypedFormControl('', [Validators.required, Validators.pattern(environment.aboutRegex), Validators.maxLength(200), Validators.minLength(2)]);
  itemsToLoad: Items[] = []
  metaToLoad: any = null
  loadingItems: boolean = false

  constructor(
    private modalService: MdbModalService,
    private inventoryService: InventoryService,
  ) {

  }
  async ngOnInit(): Promise<void> {
    this.getScreenWidth = window.innerWidth
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  async loadAreas() {
    try {
      this.limit = this.isMobile ? 4 : 16
      const filters = this.inputSearch.value ? `name${Commons.F_EQUAL}${this.inputSearch.value}` : null
      if (this.store && this.store.id) {
        this.loading = true
        const response: any = await lastValueFrom(this.inventoryService.getAreas(Commons.sessionCredentials(), filters, this.store.id, null, this.limit, this.page))
        this.totalItems = response.meta.total
        this.page = response.meta.current_page
        this.areas = response.data
        this.store.areas = this.areas
        this.loading = false
      }
    } catch (error) {
      this.loading = false
    }

  }

  async search() {
    await this.loadAreas()
  }

  async ngOnChanges(): Promise<void> {
    await this.loadAreas()
    await this.seeStoreItems(this.store)
  }

  async onPageChange() {
    await this.loadAreas();
  }

  addSubarea(area: any) {
    this.inputAreaModal = this.modalService.open(InputAreaComponent, { data: { area: area, modalOption: ModalOptionEnum.OPTION_ADD } },)
  }

  addArea() {
    this.inputAreaModal = this.modalService.open(InputAreaComponent, { data: { store: this.store, modalOption: ModalOptionEnum.OPTION_ADD } },)
  }

  edit(store_id: any, area_id: any, area: any) {
    this.inputAreaModal = this.modalService.open(InputAreaComponent, { data: { area: area, areaId: area_id, storeId: store_id, modalOption: ModalOptionEnum.OPTION_EDIT } },)
  }

  editStore() {
    this.inputStoreModal = this.modalService.open(InputStoreComponent, { data: { store: this.store, modalOption: ModalOptionEnum.OPTION_EDIT } },)
  }

  createProduct(area: any) {
    this.inputProductModal = this.modalService.open(InputProductComponent, { data: { area: area } })

    this.inputProductModal.onClose.subscribe(async (result: any) => {
      await this.seeStoreItems(this.store)
    });
  }

  remove(area: any, areas: any[]) {
    // Verifica si el estado de la tienda es igual o superior a STATUS_ACTIVE
    if (area.status >= Commons.STATUS_ACTIVE) {
      // Abre un modal de confirmación
      this.confirmModal = this.modalService.open(ConfirmModalComponent, {
        data: { title: this.modalTitle, message: 'label.item-remove', icon: Commons.ICON_WARNING },
      });

      // Se suscribe al cierre del modal de confirmación
      this.confirmModal.onClose.subscribe((accept: any) => {
        // Si el usuario acepta la confirmación
        if (accept) {
          this.loading = true;

          // Llama al servicio para eliminar la tienda en el backend
          this.inventoryService.deleteArea(area.id, Commons.sessionCredentials())
            .subscribe({
              next: (v) => {
                // Si la respuesta no es nula
                if (v != null) {
                  // Encuentra el índice de la tienda en el arreglo
                  const index = areas.indexOf(area);
                  // Si la tienda está en el arreglo, la elimina
                  if (index !== -1) {
                    areas.splice(index, 1);
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
      case 'Exceed the maximum number of filters':
        this.openModal('validations.filters', 'validations.filters-exceed', Commons.ICON_WARNING)
        break;
      case 'Unauthorized, wrong owner':
        this.openModal('validations.operation-not-success', 'validations.unauthorize-user', Commons.ICON_WARNING)
        break;
      case 'Areas does not exist':
        this.openModal(this.modalTitle, 'label.resource-not-found', Commons.ICON_WARNING)
        break
      case 'Area contains subareas and cannot be deleted':
        this.openModal(this.modalTitle, 'El area contiene subareas, no se puede eliminar', Commons.ICON_WARNING)
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

  async openSelected(area: any) {
    this.loadingItems = true
    const getAll: any = await lastValueFrom(this.inventoryService.getItems(Commons.sessionCredentials(), null, null, area.id, 10, null, null))
    this.itemsToLoad = getAll.data
    this.metaToLoad = getAll.meta
    this.loadingItems = false
  }

  async seeStoreItems(store: any) {
    try {
      this.loadingItems = true
      if (store) {
        const getAll: any = await lastValueFrom(this.inventoryService.getItems(Commons.sessionCredentials(), null, store.id, null, 10, null, null))
        this.itemsToLoad = getAll.data
        this.metaToLoad = getAll.meta
      }
      this.loadingItems = false
    } catch (error) {
      this.loadingItems = false
    }

  }

  close() {
    this.store = null
    this.closed.emit(this.store);
  }

  get isMobile() {
    return this.getScreenWidth < Commons.MOBILE_WIDTH
  }

  get isSmallScreen() {
    return this.getScreenWidth >= Commons.MOBILE_WIDTH && this.getScreenWidth < 1100
  }


}
