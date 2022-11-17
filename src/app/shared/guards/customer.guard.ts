import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Observable } from 'rxjs';
import { Commons } from '../utils/commons';
import { AlertModalComponent } from '../utils/modals/alert-modal/alert-modal.component';

@Injectable({
  providedIn: 'root'
})
export class CustomerGuard implements CanActivate {

  sessionObject = Commons.sessionObject()

  alertModal: MdbModalRef<AlertModalComponent> | null = null;

  constructor(private router: Router, private modalService: MdbModalService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (Commons.sessionIsOpen()) {
      const sessionRol = this.sessionObject.customer.rol
      const authorized = (sessionRol == Commons.USER_ROL_BASIC ||
        sessionRol == Commons.USER_ROL_RW ||
        sessionRol == Commons.USER_ROL_RWX)
      if (!authorized) {
        this.openModal('validations.not-allowed', 'validations.customer-not-allowed', Commons.ICON_WARNING)
        this.router.navigate([Commons.PATH_MAIN]);
      } else {
        return true
      }
    }
    return false;
  }

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }

}
