import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { CustomersService } from 'src/app/services/customers.service';
import { LanguageUtilService } from 'src/app/services/language-util.service';
import { Commons } from 'src/app/shared/Commons';
import { Customer } from 'src/app/shared/interfaces/core/customer';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {
  lang = ""
  id = 0
  sign = ""

  LOADING_STEP = 1
  UPDATING_STEP = 2
  step = this.LOADING_STEP

  FLOW_CHANGE_PASSWORD = 'CHANGE_PASSWORD'
  customer?: Customer
  form!: FormGroup;

  loginPath: string = Commons.PATH_LOGIN
  registerPath: string = Commons.PATH_REGISTER

  alertModal: MdbModalRef<AlertModalComponent> | null = null;

  constructor(
    private customerService: CustomersService,
    private router: Router,
    private route: ActivatedRoute,
    private langService: LanguageUtilService,
    private modalService: MdbModalService
  ) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      pwd1: new FormControl('', [Validators.required, Validators.pattern(environment.pwdRegex)]),
      pwd2: new FormControl('', [Validators.required, Validators.pattern(environment.pwdRegex)])
    })

    this.pwd2.addValidators(this.sameValue())

    this.route.queryParams
      .subscribe(params => {
        this.langService.setLanguage(params['lang'])
        this.id = params['id']
        this.lang = params['lang']
        this.sign = params['sign']
      }
      );
    this.sendRequestOnInit(this.id, this.lang, this.sign)
  }

  sameValue(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      control.value === this.pwd1.value
        ? null : { notSame: control.value };
  }

  sendRequestOnInit(id: number, lang: string, sign: string) {
    this.step = this.LOADING_STEP
    this.customerService.postCustomerSigned(this.FLOW_CHANGE_PASSWORD, id, lang, sign, null)
      .subscribe(
        {
          next: (v) => {
            this.step = this.UPDATING_STEP
            this.customer = v
          },
          error: (e) => {
            if (this.emailForwarded(e)) {
              this.return()
              this.openModal('label.request-expired', 'label.email-review', Commons.ICON_WARNING)
            } else {
              this.return()
              this.openModal('label.unknown-error', 'label.unknown-error-contact-retry', Commons.ICON_ERROR)
            }
          },
          complete: () => console.info('request complete')
        }
      )
  }

  emailForwarded(e: any): boolean {
    if (e != undefined && e != null) {
      if (e.error != undefined && e.error != null) {
        return (e.error.detail != undefined && e.error.detail != null && e.error.detail === 'Email forwarded')
      }
    }
    return false
  }

  return() {
    this.router.navigate([this.loginPath])
  }

  getCustomerName() {
    var name = 'NO-NAME'
    if (this.customer) {
      name = this.customer.email
      if (this.customer.personal_data) {
        name = this.customer.personal_data.first_name
        if (this.customer.personal_data.last_name) {
          name = name + ' ' + this.customer.personal_data.last_name
        }
      }
    }
    return name
  }

  get pwd1() { return this.form.get('pwd1')!; }
  get pwd2() { return this.form.get('pwd2')!; }

  getErrorMessage(field: any) {
    if (field.hasError('required')) {
      return 'validations.required-pwd';
    }
    if (field.hasError('pattern')) {
      return 'validations.invalid-pwd'
    }
    return field.hasError('notSame') ? 'validations.notsame-pwd' : '';
  }

  sendRequestUpdate(pwd: string) {
    this.step = this.LOADING_STEP
    if (this.customer) {
      this.customerService.postCustomerSigned(this.FLOW_CHANGE_PASSWORD, this.id, this.lang, this.sign, pwd)
        .subscribe(
          {
            next: (v) => {
              this.return()
              this.openModal('label.password-updated', 'label.return-login', Commons.ICON_SUCCESS)
            },
            error: (e) => {
              if (this.emailForwarded(e)) {
                this.return()
                this.openModal('label.request-expired', 'label.email-review', Commons.ICON_WARNING)
              } else {
                this.return()
                this.openModal('label.unknown-error', 'label.unknown-error-contact-retry', Commons.ICON_ERROR)
              }
            },
            complete: () => console.info('update complete')
          }
        )


    } else {
      this.return()
      this.openModal('label.unknown-error', 'label.unknown-error-contact-retry', Commons.ICON_ERROR)
    }
  }

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }

}
