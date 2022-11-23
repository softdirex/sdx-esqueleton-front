import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { PublicResourcesService } from 'src/app/services/resources.service';
import { Commons } from 'src/app/shared/Commons';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';
import { environment } from 'src/environments/environment.prod';

export interface Term {
  id: number;
  name: string;
  detail: TermDetail[];
}

export interface TermDetail {
  title: string;
  content: string;
}

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {

  terms:Term[] = []

  termSelected:Term = {
    id:0,
    name: "UNSELECTED CONTENT",
    detail: []
  }

  OWNER_ID = environment.ownerId
  privacyPolicyPath: string = Commons.PATH_TERMS + '/' + Commons.TERM_CODES[0].code
  termConditionsPath: string = Commons.PATH_TERMS + '/' + Commons.TERM_CODES[1].code
  termSalesPath: string = Commons.PATH_TERMS + '/' + Commons.TERM_CODES[2].code
  cookiePolicyPath: string = Commons.PATH_TERMS + '/' + Commons.TERM_CODES[3].code

  termId:number = 0

  modalRef: MdbModalRef<AlertModalComponent> | null = null;

  constructor(
    private route : ActivatedRoute,
    private resourceService:PublicResourcesService,
    private modalService: MdbModalService,
    private router:Router
    ) { }

  ngOnInit(): void {
    if(this.OWNER_ID == 0){
      this.OWNER_ID = Commons.sessionObject().customer.owner.id
    }
    // Entrada por parametros
    this.route.params.subscribe(params => {
      const code = params['code']
      const codeDetail = Commons.TERM_CODES.find(item => item.code == code)
      if(codeDetail == undefined){
        this.router.navigate([Commons.PATH_MAIN])
      }else{
        this.termId = codeDetail.id
      }

      this.resourceService.getTerms(this.OWNER_ID).subscribe(
        {
          next: async (v) => {
            this.terms = v.terms
            for(let item of this.terms){
              if(item.id == this.termId){
                this.termSelected = item
              }
            }
          },
          error: async (e) => this.openModal('label.about-our-policies','label.unknown-error', Commons.ICON_ERROR),
          complete: () => {}
        }
      )
    })
  }

  openModal(title:string,message: string, icon: string) {
    this.modalRef = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }

}
