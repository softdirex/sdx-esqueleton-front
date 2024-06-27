import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { NgbPagination, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Commons } from 'src/app/shared/Commons';
import { StoreSelectModalComponent, StoreSelectTypeEnum } from '../../Modals/store-select-modal/store-select-modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { InventoryService } from '../../services/inventory.service';
import { lastValueFrom } from 'rxjs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltipModule,
    NgbPagination
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  @Output() selectedOption: EventEmitter<any> = new EventEmitter()
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
  CHECKED_STOCK: string = `<div class="alert-success border-0">
<h6 class="mt-2 text-center"><i class="tf-ion-ios-checkmark"></i> Stock óptimo</h6>
</div>`
  getScreenWidth: any;
  summaryAlerts: any[] = [
    { type: this.DUESTOCK_ALERT, total: 0, amount: 0 },
    { type: this.MINSTOCK_ALERT, total: 0, amount: 0 },
    { type: this.MAXSTOCK_ALERT, total: 0, amount: 0 },
    { type: this.EMPTYSTOCK_ALERT, total: 0, amount: 0 },
    { type: this.CHECKED_STOCK, total: 0, amount: 0 }
  ]
  sumaTotal = 0
  storeSelectModal: MdbModalRef<StoreSelectModalComponent> | null = null;
  selectedStoreId: number = 0
  loading: boolean = false
  errorMessage: string = ''
  currentReport: any = undefined
  loadingFile: boolean = false
  selectedDate: string = ''
  reports: any[] = []
  page = 1
  limit: number = 4
  totalItems: number = 0
  isViewer: boolean = true

  constructor(
    private modalService: MdbModalService,
    private inventoryService: InventoryService
  ) {

  }
  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth
    this.errorMessage = this.selectedStoreId === 0 ? 'Sin bodega seleccionada' : ''
    this.isViewer = Commons.isInvViewer()
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  close() {
    this.selectedOption.emit(null);
  }

  openModalSelect() {
    this.storeSelectModal = this.modalService.open(StoreSelectModalComponent, { data: { option: StoreSelectTypeEnum.SELECT } })
    this.storeSelectModal.onClose.subscribe((data: any) => {
      this.selectedStoreId = data ? data : 0
      this.errorMessage = this.selectedStoreId === 0 ? 'Sin bodega seleccionada' : ''
      if (this.selectedStoreId != 0) {
        this.loadReport()
      }
    })
  }

  async exportPDF() {
    await this.downloadFile('pdf', this.selectedDate)
  }

  async exportExcel() {
    await this.downloadFile('excel', this.selectedDate)
  }

  async downloadFile(type: string, date: string) {
    this.loadingFile = true
    try {
      const response = await lastValueFrom(this.inventoryService.exportReport(this.selectedStoreId, this.currentReport, type, date, Commons.sessionCredentials()));
      const blob = new Blob([response], { type: type === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `report_${date}.${type === 'pdf' ? 'pdf' : 'xlsx'}`);
    } catch (error) {
      console.error('Error downloading the File', error);
    }
    this.loadingFile = false
  }

  async loadReport() {
    try {
      this.loading = true
      const apiRs = await lastValueFrom(this.inventoryService.getStoreReport(Commons.sessionCredentials(), this.selectedStoreId))
      this.openReport(apiRs, apiRs.date)
    } catch (error: any) {
      this.errorMessage = (error.error.detail) ? error.error.detail : error
    }
    this.loading = false
  }

  get isMobile() {
    return this.getScreenWidth < Commons.MOBILE_WIDTH
  }

  async loadHistoric() {
    this.loading = true
    this.selectedStoreId = 0
    this.currentReport = undefined
    try {
      this.limit = this.isMobile ? 4 : 16
      const apiRs = await lastValueFrom(this.inventoryService.getAllStoresReport(Commons.sessionCredentials(), this.limit, this.page))
      this.totalItems = apiRs.meta.total
      this.reports = apiRs.data
      this.page = apiRs.meta.current_page
    } catch (error: any) {
      this.errorMessage = (error.error.detail) ? error.error.detail : error
    }
    this.loading = false
  }

  openReport(item: any, date: any) {
    this.selectedStoreId = item.store_id
    this.errorMessage = this.selectedStoreId === 0 ? 'Sin bodega seleccionada' : ''
    this.currentReport = item
    const selectedDate = date ? date : new Date();
    try {
      const formattedDate = selectedDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      this.selectedDate = formattedDate.replace(/\//g, '-');
    } catch (error) {
      this.selectedDate = this.transformDateToSimpleFormat(date);
    }
    console.log(this.selectedDate)

    this.summaryAlerts = [
      { type: this.DUESTOCK_ALERT, total: this.currentReport.expired.items, amount: this.currentReport.expired.amount },
      { type: this.MINSTOCK_ALERT, total: this.currentReport.low_stock.items, amount: this.currentReport.low_stock.amount },
      { type: this.MAXSTOCK_ALERT, total: this.currentReport.stock_max.items, amount: this.currentReport.stock_max.amount },
      { type: this.EMPTYSTOCK_ALERT, total: this.currentReport.empty_stock.items, amount: this.currentReport.empty_stock.amount },
      { type: this.CHECKED_STOCK, total: this.currentReport.optimal_stock.items, amount: this.currentReport.optimal_stock.amount }
    ]
    this.sumaTotal = this.currentReport.total_amount
  }

  transformDateToSimpleFormat(isoDate: string): string {
    // Crea un objeto Date a partir del string ISO 8601
    const date = new Date(isoDate);

    // Obtén el año, mes y día
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');

    // Devuelve la fecha en el formato deseado
    return `${day}-${month}-${year}`;
  }

}
