import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NgbModule, NgbPagination, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Commons, FILTER, FilterType } from 'src/app/shared/Commons';
import { PaginatorConfig } from 'src/app/shared/config/paginator-config';
import { CommonFilterComponent } from '../../Shared/common-filter/common-filter.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { InputProviderComponent } from '../../Modals/input-provider/input-provider.component';
import { ModalOptionEnum } from '../../Enums/ModalOptionEnum';
import { UntypedFormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { InventoryService } from '../../services/inventory.service';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';


@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltipModule,
    NgbPagination,
    CommonFilterComponent,
    NgbModule
  ],
  templateUrl: './providers.component.html',
  styleUrl: './providers.component.css'
})
export class ProvidersComponent implements OnInit {
  @Input() providers: any[] = []
  @Output() selectedOption: EventEmitter<any> = new EventEmitter()
  page = 1
  limit: number = 4
  filtersInSelect: FILTER[] = [
    { label: 'label.name', field: 'name', value: '', enabled: false, type: FilterType.STRING },
    { label: 'Documento', field: 'doc_number', value: '', enabled: false, type: FilterType.STRING },
    { label: 'Email', field: 'email', value: '', enabled: false, type: FilterType.STRING },
  ]
  paginator: PaginatorConfig = new PaginatorConfig()
  getScreenWidth: any;
  inputProviderModal: MdbModalRef<InputProviderComponent> | null = null;
  loading = false;
  inputSearch = new UntypedFormControl('', [Validators.required, Validators.pattern(environment.aboutRegex), Validators.maxLength(200), Validators.minLength(2)]);
  totalItems: number = 0
  provider: any = null
  confirmModal: MdbModalRef<ConfirmModalComponent> | null = null;
  modalTitle = 'Proveedor '
  alertModal: MdbModalRef<AlertModalComponent> | null = null;


  constructor(
    private modalService: MdbModalService,
    private inventoryService: InventoryService
  ) {
  }

  ngOnInit(): void {
    this.loadProviders()
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

  close() {
    this.selectedOption.emit(null);
  }

  onFilterSelected(paginator: PaginatorConfig) {
    this.paginator = paginator
    this.loadProviders()
  }

  editProvider(item: any) {
    this.inputProviderModal = this.modalService.open(InputProviderComponent, { data: { provider: item, modalOption: ModalOptionEnum.OPTION_EDIT } },)
  }

  openProvider(item: any) {
    this.inputProviderModal = this.modalService.open(InputProviderComponent, { data: { provider: item } })
  }

  async add() {
    this.inputProviderModal = this.modalService.open(InputProviderComponent, { data: { providers: this.providers, modalOption: ModalOptionEnum.OPTION_ADD } },)
    this.inputProviderModal.onClose.subscribe(async () => {
      await this.loadProviders()
    })
  }

  buildFiltersTag() {
    this.paginator.filtersTag = ''
    for (let item of this.filtersInSelect) {
      if (item.enabled) {
        this.paginator.filtersTag = this.paginator.filtersTag + item.field + Commons.F_EQUAL + item.value + Commons.F_SEPARATOR
      }
    }
    this.paginator.filtersTag = this.paginator.filtersTag.slice(0, -2)
    if (this.paginator.filtersTag == '') {
      this.paginator.filtersTag = null
    }
  }

  async loadProviders() {
    this.buildFiltersTag()
    try {
      this.limit = this.isMobile ? 4 : 16
      this.loading = true
      const response: any = await lastValueFrom(this.inventoryService.getProviders(Commons.sessionCredentials(), null, this.paginator.filtersTag, this.limit, this.page))
      this.totalItems = response.meta.total
      this.page = response.meta.current_page
      this.providers = response.data
      this.loading = false
    } catch (error) {
      this.loading = false
    }
  }

  remove(provider: any, providers: any[]) {
    if (provider.status >= Commons.STATUS_ACTIVE) {
      this.confirmModal = this.modalService.open(ConfirmModalComponent, {
        data: { title: this.modalTitle, message: 'label.item-remove', icon: Commons.ICON_WARNING },
      })
      this.confirmModal.onClose.subscribe((accept: any) => {
        if (accept) {
          this.loading = true
          this.inventoryService.deleteProvider(provider.id, Commons.sessionCredentials())
            .subscribe(
              {
                next: (v) => {
                  if (v != null) {
                    const index = providers.indexOf(provider);
                    if (index !== -1) {
                      providers.splice(index, 1);
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

  private mapServiceValidationResponse(detail: any) {
    detail = (detail != undefined && detail != null) ? detail : 'ERROR'
    switch (detail) {
      case 'Exceed the maximum number of filters':
        this.openModal('validations.filters', 'validations.filters-exceed', Commons.ICON_WARNING)
        break;
      case 'Unauthorized, wrong owner':
        this.openModal('validations.operation-not-success', 'validations.unauthorize-user', Commons.ICON_WARNING)
        break;
      case 'Provider does not exist':
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

  dummyProviders() {
    return [
      {
        "documento": "12345678-A",
        "nombre": "ElectroCom",
        "email": "info@electrocom.example",
        "phone": "+1234567890"
      },
      {
        "documento": "87654321-B",
        "nombre": "MegaTech Solutions",
        "email": "contact@megatechsolutions.example",
        "phone": "+9876543210"
      },
      {
        "documento": "56789012-C",
        "nombre": "GloboCorp",
        "email": "sales@globocorp.example",
        "phone": "+5678901234"
      },
      {
        "documento": "09876543-D",
        "nombre": "InnovaTech",
        "email": "support@innovatech.example",
        "phone": "+1098765432"
      },
      {
        "documento": "21098765-E",
        "nombre": "Skyline Enterprises",
        "email": "info@skyline.example",
        "phone": "+3210987654"
      },
      {
        "documento": "32109876-F",
        "nombre": "BrightStar Innovations",
        "email": "contact@brightstar.example",
        "phone": "+4321098765"
      }
    ]

  }
}
