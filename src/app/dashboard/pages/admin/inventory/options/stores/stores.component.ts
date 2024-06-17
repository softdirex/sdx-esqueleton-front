import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { AlertTypeEnum } from '../../Enums/Alerts';
import { Commons } from 'src/app/shared/Commons';
import { CommonModule } from '@angular/common';
import { OpenStoreComponent } from './open-store/open-store.component';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalOptionEnum } from '../../Enums/ModalOptionEnum';
import { InputStoreComponent } from '../../Modals/input-store/input-store.component';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
import { InventoryService } from '../../services/inventory.service';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';
import { lastValueFrom } from 'rxjs';
import { ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-stores',
  standalone: true,
  imports: [
    CommonModule,
    OpenStoreComponent,
    NgbTooltipModule,
    ReactiveFormsModule,
    NgbModule,
    TranslocoModule
  ],
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.css'
})
export class StoresComponent implements OnInit {
  getScreenWidth: any;
  DUESTOCK_ALERT: string = AlertTypeEnum.DUESTOCK_ALERT.toString()
  MINSTOCK_ALERT: string = AlertTypeEnum.MINSTOCK_ALERT.toString()
  MAXSTOCK_ALERT: string = AlertTypeEnum.MAXSTOCK_ALERT.toString()
  EMPTYSTOCK_ALERT: string = AlertTypeEnum.EMPTYSTOCK_ALERT.toString()
  stores: any[] = []
  @Output() selectedOption: EventEmitter<any> = new EventEmitter()
  @Output() selectedStore: EventEmitter<any> = new EventEmitter()
  store: any = null
  showMore: boolean = true
  inputStoreModal: MdbModalRef<InputStoreComponent> | null = null;
  inputProductModal: MdbModalRef<unknown> | undefined;
  items: any[] | undefined;
  confirmModal: MdbModalRef<ConfirmModalComponent> | null = null;
  alertModal: MdbModalRef<AlertModalComponent> | null = null;
  loading = false
  modalTitle = 'Bodegas'
  page: number = 1
  totalItems: number = 0
  limit: number = 4
  inputSearch = new UntypedFormControl('', [Validators.required, Validators.pattern(environment.aboutRegex), Validators.maxLength(200), Validators.minLength(2)]);

  constructor(
    private modalService: MdbModalService,
    private inventoryService: InventoryService
  ) {

  }
  async ngOnInit(): Promise<void> {
    this.loading = true
    await this.loadStores()
    this.getScreenWidth = window.innerWidth
    this.checkStores()
  }

  async loadStores() {
    try {
      this.limit = this.isMobile ? 4 : 16
      const filters = this.inputSearch.value ? `name${Commons.F_EQUAL}${this.inputSearch.value}` : null
      this.loading = true
      const response: any = await lastValueFrom(this.inventoryService.getStores(Commons.sessionCredentials(), null, filters, this.limit, this.page))
      this.totalItems = response.meta.total
      this.page = response.meta.current_page
      this.stores = response.data
      this.loading = false
    } catch (error) {
      this.loading = false
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  checkStores() {
    if (this.stores) {
      this.stores.forEach((store: any) => {
        let summary = { total_items: 0, total_price: 0, alerts: '' };
        this.calculateSubAreas(store.areas, summary);
        store.summary = summary;
        store.summary.alerts = (!store.summary.alerts && store.summary.total_items == 0) ? this.EMPTYSTOCK_ALERT : store.summary.alerts;
      });
    }
  }

  calculateSubAreas(areas: any[], summary: { total_items: number, total_price: number, alerts: string }) {
    if (areas) {
      areas.forEach((area: any) => {
        area.items.forEach((item: any) => {
          summary.total_items++;
          summary.total_price += (item.price * item.stock);
          summary.alerts = (!summary.alerts && item.stock_max > 0 && item.stock_max <= item.stock) ? this.MAXSTOCK_ALERT : summary.alerts;
          if (item.due_date) {
            let due_date = new Date(item.due_date)
            summary.alerts = (due_date.getTime() === (new Date()).getTime() || due_date.getTime() < (new Date()).getTime()) ? this.DUESTOCK_ALERT : summary.alerts;
          }
          summary.alerts = (item.stock_min >= item.stock) ? this.MINSTOCK_ALERT : summary.alerts;
        });
        if (area.subareas) {
          this.calculateSubAreas(area.subareas, summary);
        }
      });
    }
  }


  async select(storeToOpen: any) {
    this.store = storeToOpen
    this.showMore = false
    this.loading = false
    this.selectedStore.emit(storeToOpen);
  }

  onChangedStore(store: any) {
    this.store = store
    this.showMore = true
    this.selectedStore.emit(store);
  }

  close() {
    this.store = null
    this.showMore = false
    this.selectedStore.emit(this.store);
    this.selectedOption.emit(null)
  }

  async add() {
    this.inputStoreModal = this.modalService.open(InputStoreComponent, { data: { stores: this.stores, modalOption: ModalOptionEnum.OPTION_ADD } },)
    this.inputStoreModal.onClose.subscribe(async () => {
      await this.loadStores()
    })
  }

  remove(store: any, stores: any[]) {
    if (store.status >= Commons.STATUS_ACTIVE) {
      this.confirmModal = this.modalService.open(ConfirmModalComponent, {
        data: { title: this.modalTitle, message: 'label.item-remove', icon: Commons.ICON_WARNING },
      })
      this.confirmModal.onClose.subscribe((accept: any) => {
        if (accept) {
          this.loading = true
          this.inventoryService.deleteSore(store.id, Commons.sessionCredentials())
            .subscribe(
              {
                next: (v) => {
                  if (v != null) {
                    const index = stores.indexOf(store);
                    if (index !== -1) {
                      stores.splice(index, 1);
                    }
                  }
                  this.loading = false
                },
                error: (e) => {
                  this.mapServiceValidationResponse((e.error != null && e.error != undefined) ? e.error.detail : 'ERROR')
                  this.loading = false
                },
                complete: () => { }
              }
            )
        }
      });
    }
  }

  show() {
    this.showMore = !this.showMore
  }

  get isMobile() {
    return this.getScreenWidth < Commons.MOBILE_WIDTH
  }

  get isSmallScreen() {
    return this.getScreenWidth >= Commons.MOBILE_WIDTH && this.getScreenWidth < 1100
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
      case 'Store does not exist':
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
