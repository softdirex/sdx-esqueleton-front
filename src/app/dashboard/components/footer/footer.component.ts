import { Component, OnInit } from '@angular/core';
import { Commons } from 'src/app/shared/utils/commons';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  anio: Date = new Date();
  ciaName: string = Commons.SDX
  privacyPolicyPath: string = Commons.PATH_TERMS + '/' + Commons.TERM_CODES[0].code
  aboutPath: string = Commons.PATH_ABOUT
  supportPath: string = Commons.PATH_SUPPORT
  version = environment.appVersion
  appName =  environment.appName

  constructor() { }

  ngOnInit() {
    console.log(this.version)
    console.log(JSON.stringify(this.version))
  }

}
