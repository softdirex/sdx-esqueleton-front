import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Commons } from '../../Commons';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {

  title:string='title'
  message:string='message'
  icon:string =Commons.ICON_WARNING

  constructor(public modalRef: MdbModalRef<ConfirmModalComponent>) { }

  ngOnInit(): void {
  }

  confirm(): void {
    this.modalRef.close(Commons.CONFIRM)
  }

  cancel(): void {
    this.modalRef.close(Commons.CANCEL)
  }

}
