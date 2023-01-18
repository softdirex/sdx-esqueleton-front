import { Component, OnInit } from '@angular/core';
import { OwnerConfig } from 'src/app/shared/interfaces/core/owner-config';
import { OwnerConfigService } from 'src/app/services/owner-config.service';
import { Commons } from 'src/app/shared/Commons';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  version = environment.appVersion

  ownerDetail: OwnerConfig = Commons.emptyOwnerConfig()

  privacyPolicyPath: string = Commons.PATH_TERMS + '/' + Commons.TERM_CODES[0].code
  termConditionsPath: string = Commons.PATH_TERMS + '/' + Commons.TERM_CODES[1].code
  termSalesPath: string = Commons.PATH_TERMS + '/' + Commons.TERM_CODES[2].code
  cookiePolicyPath: string = Commons.PATH_TERMS + '/' + Commons.TERM_CODES[3].code

  PATH_ABOUT = '/'+Commons.PATH_ABOUT
  PATH_CONTACT = '/'+Commons.PATH_CONTACT

  anio: Date = new Date();
  ciaName: string = Commons.SDX
  appName = environment.appName

  constructor(private ownerConfigService: OwnerConfigService) {

  }

  ngOnInit(): void {
    this.loadOwnerConfig()
  }

  loadOwnerConfig(){
    const validated = Commons.getOwnerConfig()
    if (validated == null) {
      //load from endpoint
      this.ownerConfigService.getConfig().subscribe(
        {
          next: (v) => {
            this.ownerDetail = v
            Commons.setOwnerConfig(v)
          },
          complete: () => { }
        }
      )
    } else {
      this.ownerDetail = validated
    }
  }

  get location(): string {
    const address = this.ownerDetail.address
    const city = this.ownerDetail.city
    const country = this.ownerDetail.country
    return (Commons.validField(address) && address !== '') ? address + ', ' + city + ', ' + country.toUpperCase() : city + ', ' + country.toUpperCase()
  }

}
