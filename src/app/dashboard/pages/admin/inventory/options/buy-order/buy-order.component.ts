import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NgbPagination, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { InputProductComponent } from '../../Modals/input-product/input-product.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { lastValueFrom, map, Observable, startWith } from 'rxjs';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Commons } from 'src/app/shared/Commons';
import { InventoryService } from '../../services/inventory.service';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-buy-order',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltipModule,
    NgbPagination,
    MatOptionModule,
    MatAutocompleteModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    MatInputModule,
  ],
  templateUrl: './buy-order.component.html',
  styleUrl: './buy-order.component.css'
})
export class BuyOrderComponent implements OnInit {
  @Input() stores: any[] = []
  @Output() selectedOption: EventEmitter<any> = new EventEmitter()
  products: any[] = []
  page: number = 1
  totalItems: number = 0
  limit: number = 4
  loading: boolean = false
  DUESTOCK_ALERT: string = `<div class="alert-danger border-0">
  <h6 class="mt-2 text-center"><i class="tf-ion-ios-information"></i> LABEL</h6>
</div>`
  MINSTOCK_ALERT: string = `<div class="alert-danger border-0">
  <h6 class="mt-2 text-center"><i class="tf-ion-ios-information"></i> LABEL</h6>
</div>`
  MAXSTOCK_ALERT: string = `<div class="alert-warning border-0">
  <h6 class="mt-2 text-center"><i class="tf-ion-ios-information"></i> LABEL</h6>
</div>`
  EMPTYSTOCK_ALERT: string = `<div class="alert-warning border-0">
  <h6 class="mt-2 text-center"><i class="tf-ion-ios-information"></i> LABEL</h6>
</div>`
  inputProductModal: MdbModalRef<InputProductComponent> | null = null;
  myControl = new FormControl();
  providerControl = new FormControl();
  providers: any[] = [];
  filteredProviders: Observable<any[]>;
  selectedProvider: any = undefined
  getScreenWidth: any;
  alertModal: MdbModalRef<AlertModalComponent> | null = null;
  loadingSent: boolean = false
  loadingFile: boolean = false

  constructor(
    private modalService: MdbModalService,
    private inventoryService: InventoryService,
  ) {
    this.filteredProviders = this.providerControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterProviders(value))
    );
  }

  async ngOnInit() {
    await this.loadItems()
    await this.loadProviders()
    this.getScreenWidth = window.innerWidth
  }

  private _filterProviders(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.providers.filter(provider => provider.name.toLowerCase().includes(filterValue));
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  getAlert(item: any) {
    let alert = `<div class="alert-success border-0">
    <h6 class="mt-2 text-center"><i class="tf-ion-ios-checkmark"></i> LABEL</h6>
  </div>`
    alert = (item.info_status === 'no_stock') ? this.EMPTYSTOCK_ALERT : alert;
    alert = (item.info_status === 'low_stock') ? this.MINSTOCK_ALERT : alert;
    alert = (item.info_status === 'due_date') ? this.DUESTOCK_ALERT : alert;
    return alert.replace('LABEL', item.info)
  }

  close() {
    this.selectedOption.emit(null);
  }

  openItem(item: any) {
    this.inputProductModal = this.modalService.open(InputProductComponent, { data: { product: item } })
  }

  get isMobile() {
    return this.getScreenWidth < Commons.MOBILE_WIDTH
  }

  remove(item: any) {
    this.products = this.products.filter(element => element !== item);
  }

  async loadItems() {
    try {
      this.limit = this.isMobile ? 4 : 16
      this.loading = true
      const response: any = await lastValueFrom(this.inventoryService.getReportsQuote(Commons.sessionCredentials(), this.limit, this.page, null))
      this.totalItems = response.meta.total
      this.page = response.meta.current_page
      this.products = response.data
      this.loading = false
    } catch (error) {
      this.loading = false
    }
  }

  async loadProviders() {
    try {
      this.limit = this.isMobile ? 4 : 16
      this.loading = true
      let tPage = 1
      let last_page = 1
      while (tPage <= last_page) {
        const response: any = await lastValueFrom(this.inventoryService.getProviders(Commons.sessionCredentials(), null, null, 100, tPage))
        tPage = response.meta.current_page + 1
        last_page = response.meta.last_page
        this.providers.push(...response.data)
      }
      this.loading = false
    } catch (error) {
      this.loading = false
    }
  }

  async sendQuote() {
    const selectedEmail = this.providerControl.value
    this.selectedProvider = this.providers.find(provider => provider.email === selectedEmail);
    if (this.selectedProvider) {
      this.loadingSent = true
      const reqItems: any[] = []
      this.products.forEach(info => {
        reqItems.push(
          {
            code: info.item.code,
            name: info.item.name,
            description: info.item.description,
            quantity: info.quantity
          }
        )
      })
      const request = {
        receiver: { name: this.selectedProvider.name, email: this.selectedProvider.email },
        items: reqItems
      }
      try {
        const apiRs: any = await lastValueFrom(this.inventoryService.sendQuote(request, Commons.sessionCredentials()))
        if (apiRs.message && apiRs.message.toUpperCase() === 'OK') {
          this.openModal(
            'Cotización enviada',
            'El mensaje fué enviado al proveedor ' + this.selectedProvider.name + ' satisfactoriamente',
            Commons.ICON_SUCCESS
          );
        } else {
          this.openModal(
            'Respuesta inesperada del servicio',
            'La cotización se envió con observaciones: (' + JSON.stringify(apiRs) + ')',
            Commons.ICON_WARNING
          );
        }
      } catch (error: any) {
        console.error(error)
        this.openModal(
          'Respuesta inesperada del servicio',
          'Ocurrió un error inesperado al intentar enviar cotización: (' + JSON.stringify(error) + ')',
          Commons.ICON_WARNING
        )
      }

      this.loadingSent = false
    } else {
      const message = `Para enviar una cotización, debes seleccionar primero un proveedor. ${this.providers.length === 0 ? 'Primero debes ir a la sección proveedores y agregar un proveedor.' : ''
        }`;
      this.openModal(
        'No se puede enviar cotización',
        message,
        Commons.ICON_INFO
      );
    }
  }

  async downloadFile(type: string) {
    this.loadingFile = true
    const reqItems: any[] = [];

    this.products.forEach(info => {
      reqItems.push(
        {
          code: info.item.code,
          name: info.item.name,
          category: info.item.category,
          quantity: info.quantity
        }
      )
    })

    try {
      const response = await lastValueFrom(this.inventoryService.exportQuote({ items: reqItems }, type, Commons.sessionCredentials()));
      const blob = new Blob([response], { type: type === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `productos.${type === 'pdf' ? 'pdf' : 'xlsx'}`);
    } catch (error) {
      console.error('Error downloading the File', error);
    }
    this.loadingFile = false
  }

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }

}
