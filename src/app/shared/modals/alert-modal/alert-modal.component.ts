import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Commons } from '../../Commons';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.css']
})
export class AlertModalComponent implements OnInit {

  title:string='title'
  message:string='message'
  icon:string =Commons.ICON_WARNING

  constructor(public modalRef: MdbModalRef<AlertModalComponent>) { }

  ngOnInit(): void {
  }

}
