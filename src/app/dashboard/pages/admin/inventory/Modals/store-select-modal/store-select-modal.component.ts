import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { InventoryService } from '../../services/inventory.service';
import { Commons } from 'src/app/shared/Commons';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-store-select-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MdbModalModule
  ],
  templateUrl: './store-select-modal.component.html',
  styleUrl: './store-select-modal.component.css'
})
export class StoreSelectModalComponent implements OnInit {
  @Output() storeSelected = new EventEmitter<string>(); // Emitirá la tienda seleccionada
  selectedStore: number | null = null;
  page: number = 1
  totalItems: number = 0
  limit: number = 4
  inputSearch = new UntypedFormControl('', [Validators.required, Validators.pattern(environment.aboutRegex), Validators.maxLength(200), Validators.minLength(2)]);
  getScreenWidth: any;
  loading = false
  stores: any[] = []
  store: any = null
  modalTitle = 'label.bulkloads'
  alertModal: MdbModalRef<AlertModalComponent> | null = null;
  errorMessage: string = ""
  selectedStoreName: string | null = null;
  

  constructor(public modalRef: MdbModalRef<StoreSelectModalComponent>,
    private inventoryService: InventoryService,
    private modalService: MdbModalService
  ) {
  }



  async ngOnInit(): Promise<void> {
    this.loading = true
    await this.loadStores()
    this.getScreenWidth = window.innerWidth
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  cancel(): void {
    this.modalRef.close()
  }


  async loadStores() {
    try {
      this.loading = true
      this.limit = this.isMobile ? 4 : 16
      const filters = this.inputSearch.value ? `name${Commons.F_EQUAL}${this.inputSearch.value}` : null
      const response: any = await lastValueFrom(this.inventoryService.getStores(Commons.sessionCredentials(), null, filters, this.limit, this.page))
      this.totalItems = response.meta.total
      this.page = response.meta.current_page
      this.stores = response.data
      this.loading = false
    } catch (error) {
      this.loading = false
    }
  }

  download() {
    const fileNameToDownload = `Template_store`;
    if (this.selectedStore === null) {
      // Manejar el caso donde no se ha seleccionado ninguna tienda
      this.errorMessage = 'El campo es obligatorio'
      return
    }
    this.loading = true
    this.inventoryService.bulkloadDownload(this.selectedStore, Commons.sessionCredentials()).subscribe({
      next: (v) => {
        const response: Blob = v
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = fileNameToDownload;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
        this.loading = false
        this.cancel()
      },
      error: (e) => {
        this.loading = false
        this.mapServiceValidationResponse('template-error')
      },
      complete: () => { }
    })
  }

  private mapServiceValidationResponse(detail: any) {
    detail = (detail != undefined && detail != null) ? detail : 'ERROR'
    detail = detail.replace('API_RESPONSE: ', '')
    switch (detail) {
      case 'The template is not updated':
        this.openModal('validations.invalid-template', 'validations.invalid-template-msg', Commons.ICON_WARNING)
        break;
      case 'template-error':
        this.openModal(this.modalTitle, 'label.wrong-template-response', Commons.ICON_WARNING)
        break;
      case 'wrong excel_template_headers, min two headers required and must be contain total':
        this.openModal(this.modalTitle, 'label.wrong-headers-sent', Commons.ICON_WARNING)
        break;
      default:
        this.openModal('label.response-error-detail', detail, Commons.ICON_ERROR)
        break;
    }
    if (detail.startsWith('valid_names[')) {
      const validNames = detail.replace('valid_names[', '').replace(']', '')
      this.openModal('validations.invalid-country-msg', validNames, Commons.ICON_WARNING)
    }
  }

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }


  get isMobile() {
    return this.getScreenWidth < Commons.MOBILE_WIDTH
  }
}
