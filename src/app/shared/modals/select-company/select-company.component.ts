import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Company } from '../../interfaces/core/company';

@Component({
  selector: 'app-select-company',
  templateUrl: './select-company.component.html',
  styleUrls: ['./select-company.component.css']
})
export class SelectCompanyComponent implements OnInit {

  companies:Company[]=[]

  constructor(
    public modalRef: MdbModalRef<SelectCompanyComponent>,
  ) { }

  ngOnInit(): void {
  }

  setItem(companyId: string): void {
    this.modalRef.close(companyId)
  }

  cancel(): void {
    this.modalRef.close(0)
  }

}
