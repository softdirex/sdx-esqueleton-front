import { Component, HostListener, OnInit } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { LicencesService } from 'src/app/services/licences.service';
import { StorageService } from 'src/app/services/storage.service';
import { Commons } from 'src/app/shared/utils/commons';
import { PaginatorConfig } from 'src/app/shared/utils/config/paginator-config';
import { Transaction } from 'src/app/shared/utils/interfaces/core/transaction';
import { AlertModalComponent } from 'src/app/shared/utils/modals/alert-modal/alert-modal.component';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit {

  list: Transaction[] = []
  paginator: PaginatorConfig = new PaginatorConfig()
  getScreenWidth: any;
  mobileWidth: number = Commons.MOBILE_WIDTH
  alertModal: MdbModalRef<AlertModalComponent> | null = null;
  modalTitle = 'label.my-payment-history'
  types: any[] = Commons.PAYMENT_TYPES

  constructor(
    private service: LicencesService,
    private modalService: MdbModalService,
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth
    this.loadData()
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  loadData() {
    this.service.getMyLicenceDetailHistory(this.paginator.page, this.paginator.limit).subscribe({
      next: async (v) => {
        this.paginator.total = v.meta.total
        this.paginator.firstPage = v.meta.first_page
        this.paginator.lastPage = v.meta.last_page
        this.paginator.currentPage = v.meta.current_page
        this.list = []
        this.list = v.data
        this.buildPaginator()
      },
      error: (e) => { this.mapServiceValidationResponse((e.error != null && e.error != undefined) ? e.error.detail : 'ERROR') },
      complete: () => { }
    })
  }

  buildPaginator() {
    var maxToView: number = 2
    if (this.getScreenWidth < this.mobileWidth) {
      maxToView = 1
    }
    this.paginator.allPages = []
    var lastInsert: boolean = false
    for (let index = 0; index < this.paginator.lastPage; index++) {
      if (this.paginator.page - (maxToView + 1) == index + 1) {
        this.paginator.allPages = []
        this.paginator.allPages.push('...')
      } else {
        if (this.paginator.page + maxToView == index) {
          lastInsert = true
          this.paginator.allPages.push('...')
        } else {
          if (!lastInsert) {
            this.paginator.allPages.push(index + 1)
          }
        }
      }
    }
  }

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }

  private mapServiceValidationResponse(detail: any) {
    detail = (detail != undefined && detail != null) ? detail : 'ERROR'
    switch (detail) {
      case 'Incorrect format':
        this.openModal(this.modalTitle, 'label.downloading-wrong-file', Commons.ICON_WARNING)
        break;
      default:
        this.openModal('label.unknown-error', 'label.unknown-error-contact-retry', Commons.ICON_ERROR)
        break;
    }
  }

  toPage(arg: number) {
    this.paginator.page = arg
    this.loadData()
  }

  changeLimit(arg: number) {
    this.paginator.page = 1
    this.paginator.limit = arg
    this.loadData()
  }

  /* BEGIN - Custom functions */
  buildPurchase(licence: any) {
    if (Commons.validField(licence) &&
      Commons.validField(licence.id) &&
      Commons.validField(licence.code)) {
      return licence.code + '-' + licence.id
    }
    return 'Unknown'
  }

  buildPlanName(licence: any) {
    if (Commons.validField(licence) &&
      Commons.validField(licence.plan) &&
      Commons.validField(licence.plan.name)) {
      return licence.plan.name
    }
    return 'Unknown'
  }

  buildProductName(licence: any) {
    if (Commons.validField(licence) &&
      Commons.validField(licence.plan) &&
      Commons.validField(licence.plan.product)) {
      return licence.plan.product.name
    }
    return 'Unknown'
  }

  formatPlanType(type: any) {
    if (Commons.validField(type)) {
      const item = this.types.find(option => option.value === type)
      if (item == undefined) {
        return this.types[0].name
      }
      return item.name
    }
    return 'Unknown'
  }

  downloadFile(filepath: any, filename: any) {
    this.storageService.getDocument(filepath).subscribe({
      next: async (v) => {
        const blob = new Blob([v], { type: 'application/pdf' });

        var downloadURL = window.URL.createObjectURL(v);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = Commons.validField(filename) ? filename + '.pdf' : 'Download.pdf';
        link.click();
      },
      error: (e) => {
        this.mapServiceValidationResponse('Incorrect format')
      },
      complete: () => { }

    });
  }

  unavailableReceipt() {
    this.openModal(this.modalTitle, 'label.unavailable-receipt', Commons.ICON_WARNING)
  }

}
