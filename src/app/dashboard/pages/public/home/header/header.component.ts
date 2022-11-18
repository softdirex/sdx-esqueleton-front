import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { Commons } from 'src/app/shared/Commons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  getScreenWidth: any;
  mobileWidth: number = Commons.MOBILE_WIDTH
  sessionIsOpen: boolean = Commons.sessionIsOpen()
  sessionObject: any = Commons.sessionObject()

  constructor(
    private sessionService: SessionService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  closeSession() {
    if (Commons.sessionIsOpen()) {
      this.sessionService.setUserLoggedIn(false);
      Commons.sessionClose()
      this.router.navigate([Commons.PATH_MAIN]).then(() => {
        window.location.reload();
      });
    }
  }

  getCustomerName() {
    var name = 'NO-NAME'
    if (this.sessionObject.customer) {
      name = this.sessionObject.customer.email
      if (this.sessionObject.customer.personal_data) {
        name = this.sessionObject.customer.personal_data.first_name
        if (this.sessionObject.customer.personal_data.last_name) {
          name = name + ' ' + this.sessionObject.customer.personal_data.last_name
        }
      }
    }
    return name
  }

}
