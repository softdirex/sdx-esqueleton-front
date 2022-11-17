import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Commons } from '../../Commons';

@Component({
  selector: 'app-alert-link-modal',
  templateUrl: './alert-link-modal.component.html',
  styleUrls: ['./alert-link-modal.component.css']
})
export class AlertLinkModalComponent implements OnInit {

  title: string = 'title'
  message: string = 'message'
  icon: string = Commons.ICON_WARNING
  linkName: string = 'unknown'

  constructor(
    public modalRef: MdbModalRef<AlertLinkModalComponent>,
    public route: Router
  ) { }

  ngOnInit(): void {
  }

  goTo() {
    //Solo envia la confirmacion de que desea ir al enlace
    this.modalRef.close(Commons.CONFIRM)
  }
}
