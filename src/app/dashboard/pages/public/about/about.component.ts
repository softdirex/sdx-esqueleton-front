import { Component, OnInit } from '@angular/core';
import { OwnerConfig } from 'src/app/shared/interfaces/core/owner-config';
import { Commons } from 'src/app/shared/Commons';
import { environment } from 'src/environments/environment';
import { CdkService } from 'src/app/services/cdk.service';
import { CompaniesService } from 'src/app/services/companies.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {


  ownerDetail: OwnerConfig = Commons.emptyOwnerConfig()

  PATH_TERMS = '/' + Commons.PATH_TERMS + '/' + Commons.TERM_CODES[0].code
  PATH_CONTACT = '/' + Commons.PATH_CONTACT
  loading: boolean = false

  constructor(
    private cdkService: CdkService,
    private service: CompaniesService,
  ) { }

  ngOnInit(): void {
    this.loadOwnerConfig()
  }

  loadOwnerConfig() {
    const validated = Commons.getOwner()
    if (validated == null) {
      //load from endpoint
      if (environment.ownerId != 0) {
        this.service.getOwner(environment.ownerId + '').subscribe(
          {
            next: async (v) => {
              const owner = await this.cdkService.getTrxDec(v.trx)
              this.ownerDetail = owner.config
              Commons.setOwner(owner)
              window.location.reload();
            },
            error: () => {
              this.ownerDetail = Commons.getDefaultConfig()
            },
            complete: () => { }
          }
        )
      }
    } else {
      this.ownerDetail = validated.config
    }
  }

}
