import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { CustomersService } from 'src/app/services/customers.service';
import { Commons } from 'src/app/shared/utils/commons';
import { ServiceResponse } from 'src/app/shared/utils/interfaces/core/service-response';
import { AlertModalComponent } from 'src/app/shared/utils/modals/alert-modal/alert-modal.component';

@Component({
  selector: 'app-pwd-recovery',
  templateUrl: './pwd-recovery.component.html',
  styleUrls: ['./pwd-recovery.component.scss']
})
export class PwdRecoveryComponent implements OnInit {

  form!: FormGroup;

  serviceResponse?: ServiceResponse

  STEP_INITIAL = 1
  STEP_LOADING = 2

  step = this.STEP_INITIAL

  alertModal: MdbModalRef<AlertModalComponent> | null = null;

  loginPath: string = Commons.PATH_LOGIN
  registerPath: string = Commons.PATH_REGISTER

  constructor(
    private customerService: CustomersService,
    private router: Router,
    private modalService: MdbModalService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    })
  }

  get email() { return this.form.get('email')!; }

  sendRequest(email: string) {
    this.step = this.STEP_LOADING
    this.customerService.sendPasswordRecoveryRequest(email)
      .subscribe({
        next: (v) => {
          this.router.navigate([Commons.PATH_LOGIN])
          this.openModal('label.request-sended', 'label.email-review', Commons.ICON_SUCCESS)
        },
        error: (e) => {
          if (this.emailNotRegistered(e)) {
            this.router.navigate([Commons.PATH_LOGIN])
            this.openModal('validations.invalid-email', 'register.try-again-msg', Commons.ICON_WARNING)
          } else {
            this.router.navigate([Commons.PATH_LOGIN])
            this.openModal('label.unknown-error', 'label.unknown-error-contact-retry', Commons.ICON_ERROR)
          }
        },
        complete: () => console.info('complete')
      }
      )
  }

  return() {
    this.router.navigate([Commons.PATH_LOGIN])
  }

  emailNotRegistered(e: any): boolean {
    if (e != undefined && e != null) {
      if (e.error != undefined && e.error != null) {
        return (e.error.detail != undefined && e.error.detail != null && e.error.detail === 'Invalid email')
      }
    }
    return false
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'validations.required-email'
    }

    return this.email.hasError('email') ? 'validations.invalid-email' : '';
  }

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }

}
