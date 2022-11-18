import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Product } from 'src/app/public/models/core/interfaces/Product';
import { ProductsService } from 'src/app/services/products.service';
import { StorageService } from 'src/app/services/storage.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { Commons } from 'src/app/shared/Commons';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  
  resource: Product = {
    id: null,
    name: '',
    description: '',
    logo: '',
    access_link: '',
    type: 0,
    html_color: '',
    html_color2: '',
    html_colorlink: '',
    status: 0,
    created_at: '',
    updated_at: '',
    benefits: null,
    usages: null,
    attachments: null,
    plans: []
  }
  logoUrl: any
  title: string = ''
  alertModal: MdbModalRef<AlertModalComponent> | null = null;
  sessionIsOpen: boolean = false
  types: any[] = Commons.PLAN_TYPES
  confirmModal: MdbModalRef<ConfirmModalComponent> | null = null;

  constructor(
    private router: Router,
    private service: ProductsService,
    private storageService: StorageService,
    private sanitizer: DomSanitizer,
    private modalService: MdbModalService,
    private transaction: TransactionService
  ) { }

  ngOnInit(): void {
    this.sessionIsOpen = Commons.sessionIsOpen()
    this.loadProduct(environment.productId)
  }

  apply(planId: number) {
    if (this.sessionIsOpen) {
      const customer = Commons.sessionObject().customer
      if (Commons.sessionRol() == Commons.USER_ROL_BASIC) {
        this.openModal(this.title, 'validations.wrong-privilege', Commons.ICON_WARNING)
      } else {
        this.confirmModal = this.modalService.open(ConfirmModalComponent, {
          data: { title: this.title, message: 'label.action-confirm', icon: Commons.ICON_WARNING },
        })
        this.confirmModal.onClose.subscribe((accept: any) => {
          if (accept) {
            this.createLicence(planId, customer.company.id)
          }
        });
      }

    } else {
      this.openModal(this.title, 'label.login-invite', Commons.ICON_WARNING)
    }
  }

  createLicence(planId: number, companyId: number) {
    this.transaction.postMyLicence(planId, companyId).subscribe({
      next: async (v) => {
        const trxId = v.code + '-' + v.id
        window.open(Commons.PATH_PURCHASE + '/' + trxId)
      },
      error: (e) => {
        this.openModal(this.title, 'validations.purchase-not-found', Commons.ICON_WARNING)
      },
      complete: () => { }
    })

  }

  goBack() {
    this.router.navigate([Commons.PATH_MAIN])
  }

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }

  openPdf(url: any, filename: any) {
    if (this.sessionIsOpen) {
      window.open(Commons.PATH_PDF_VIEWER + '/' + url + '/' + filename, '_blank')
    } else {
      this.openModal(this.title, 'label.login-invite', Commons.ICON_WARNING)
    }
  }

  loadProduct(resourecId: number) {
    const fullView = this.sessionIsOpen && Commons.sessionObject().customer.rol != Commons.USER_ROL_BASIC

    this.service.get(fullView).subscribe({
      next: async (v) => {
        this.resource = v
        this.title = v.name
        this.storageService.getProductImage(v.logo).subscribe(
          {
            next: async (v) => {
              this.logoUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(v))
            },
            error: (e) => {
              this.logoUrl = this.sanitizer.bypassSecurityTrustUrl(Commons.DF_PRODUCT_LOGO)
            },
            complete: () => { }
          }
        )
      },
      error: (e) => {
        this.openModal(this.title, 'label.product-not-found', Commons.ICON_WARNING)
        this.goBack()
      },
      complete: () => { }
    })

  }

  formatType(arg: any) {
    const item = this.types.find(option => option.value === arg)
    if (item == undefined) {
      return this.types[0].name
    }
    return item.name
  }

  categoryPlan(category: string) {
    return 'label.plan-' + category.toLowerCase() + '-category'
  }

  getPriceDesc(plan: any) {
    const montlyPriceDesc = (plan.price / plan.type)
    if (plan.currency.toUpperCase() == 'CLP') {
      const total = (montlyPriceDesc - (montlyPriceDesc * (plan.discount_rate / 100))).toFixed(0)
      return plan.currency + ' ' + total
    } else {
      const total = (montlyPriceDesc - (montlyPriceDesc * (plan.discount_rate / 100))).toFixed(1)
      return plan.currency + ' ' + total
    }
  }

  getTotalDesc(plan: any) {
    if (plan.currency.toUpperCase() == 'CLP') {
      const total = (plan.price - (plan.price * (plan.discount_rate / 100))).toFixed(0)
      return plan.currency + ' ' + total
    } else {
      const total = (plan.price - (plan.price * (plan.discount_rate / 100))).toFixed(1)
      return plan.currency + ' ' + total
    }
  }

  getNormalPrice(plan: any) {
    if (plan.currency.toUpperCase() == 'CLP') {
      const total = (plan.price / plan.type).toFixed(0)
      return plan.currency + ' ' + total
    } else {
      const total = (plan.price / plan.type).toFixed(1)
      return plan.currency + ' ' + total
    }
  }

  getPlanIcon(category: string) {
    switch (category) {
      case 'TRIAL':
        return 'fas fa-flask'
      case 'BASIC':
        return 'fas fa-bookmark'
      case 'MEDIUM':
        return 'fas fa-certificate'
      case 'PREMIUM':
        return 'fas fa-award'
      default:
        return 'fas fa-flask'
    }
  }
}