import { Component, OnInit } from '@angular/core';
import { CustomersService } from 'src/app/services/customers.service';
import { Commons } from 'src/app/shared/Commons';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-footer',
  templateUrl: './admin-footer.component.html',
  styleUrls: ['./admin-footer.component.css']
})
export class AdminFooterComponent implements OnInit {

  version = environment.appVersion
  appName = environment.appName
  footerInfo = environment.footerInfo

  officeLocation = environment.officeLocation
  contactEmail = environment.contactEmail
  contactPhone = environment.contactPhone

  orgName=environment.orgName

  providerWeb=environment.providerWeb

  anio: Date = new Date();

  constructor(
    private customersService: CustomersService
  ) { }

  ngOnInit(): void {
  }

  toSupport(){
    this.openNewWindow(Commons.PATH_SUPPORT)
  }

  toStore(){
    this.openNewWindow('store')
  }

  toAboutUs(){
    this.openNewWindow('about-us')
  }
  toPP(){
    this.openNewWindow(Commons.PATH_TERMS + '/privacy-policy')
  }

  toTC(){
    this.openNewWindow(Commons.PATH_TERMS + '/terms-conditions')
  }

  toST(){
    this.openNewWindow(Commons.PATH_TERMS + '/terms-sales')
  }

  toCP(){
    this.openNewWindow(Commons.PATH_TERMS + '/cookie-policy')
  }

  openNewWindow(path: string) {
    this.customersService.createTransientAuth().subscribe({
      next: (v) => {
        Commons.openWithExternalToken(path, v.transient_auth)
      },
      error: (e) => {
      },
      complete: () => { }
    })

  }

}
