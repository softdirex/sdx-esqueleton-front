import { Component, OnInit } from '@angular/core';
import { OwnerConfig } from 'src/app/shared/interfaces/core/owner-config';
import { OwnerConfigService } from 'src/app/services/owner-config.service';
import { Commons } from 'src/app/shared/Commons';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {


  ownerDetail: OwnerConfig = {
    company_name: '',
    slogan: '',
    about: '',
    mission: '',
    vision: '',
    contact_phone: '',
    contact_mail: '',
    address: '',
    city: '',
    country: '',
    terms_filename: '',
    lang: '',
  }

  PATH_TERMS = '/' + Commons.PATH_TERMS + '/' + Commons.TERM_CODES[0].code
  PATH_CONTACT = '/' + Commons.PATH_CONTACT

  constructor(private ownerConfigService: OwnerConfigService) { }

  ngOnInit(): void {
    this.loadOwnerConfig()
  }

  loadOwnerConfig() {
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

}
