import { Component, OnInit } from '@angular/core';
import { Commons } from 'src/app/shared/Commons';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  version = environment.appVersion
  appName = environment.appName
  footerInfo = environment.footerInfo

  officeLocation = environment.officeLocation
  contactEmail = environment.contactEmail
  contactPhone = environment.contactPhone

  orgName=environment.orgName

  anio: Date = new Date();

  constructor() { }

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

  openNewWindow(path:string) {
    Commons.openWithExternalToken(path)
  }

  openNewWindowWhithoutToken(path:string){
    Commons.openWithoutExternalToken(path)
  }


}
