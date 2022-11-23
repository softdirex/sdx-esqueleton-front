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

  privacyPolicyPath: string = Commons.PATH_TERMS + '/' + Commons.TERM_CODES[0].code
  termConditionsPath: string = Commons.PATH_TERMS + '/' + Commons.TERM_CODES[1].code
  termSalesPath: string = Commons.PATH_TERMS + '/' + Commons.TERM_CODES[2].code
  cookiePolicyPath: string = Commons.PATH_TERMS + '/' + Commons.TERM_CODES[3].code

  constructor() { }

  ngOnInit(): void {
  }

}
