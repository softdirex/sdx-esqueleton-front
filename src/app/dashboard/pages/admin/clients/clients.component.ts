import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule } from '@ngneat/transloco';
import { Commons } from 'src/app/shared/Commons';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    TitleCasePipe,
    CommonModule,
    TranslocoModule,
    NgbPaginationModule
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {
  loading:boolean=false
  users:any[] = []
  getScreenWidth: any;
  page: number = 1
  totalItems: number = 0
  limit: number = 4

  async ngOnInit() {
    await this.loadUsers()
    this.getScreenWidth = window.innerWidth
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  loadUsers(){
    this.users =[
      {
        "id": "667d791e38a9c9c8e55dda3f",
        "name": "Oneal Alvarez",
        "email": "onealalvarez@visalia.com",
        "role": "Cliente"
      },
      {
        "id": "667d791e5e0b1d7dd9b4328c",
        "name": "Espinoza Velasquez",
        "email": "espinozavelasquez@visalia.com",
        "role": "Cliente"
      },
      {
        "id": "667d791e09effe730707c830",
        "name": "Fischer Case",
        "email": "fischercase@visalia.com",
        "role": "Cliente"
      },
      {
        "id": "667d791ebcb35ba028be9a4b",
        "name": "Guy Macdonald",
        "email": "guymacdonald@visalia.com",
        "role": "Cliente"
      },
      {
        "id": "667d791e8b24519c04d14def",
        "name": "Debra Williamson",
        "email": "debrawilliamson@visalia.com",
        "role": "Cliente"
      },
      {
        "id": "667d791e6696d5edd0763120",
        "name": "Danielle Park",
        "email": "daniellepark@visalia.com",
        "role": "Cliente"
      }
    ]
  }

  showHistory(user:any){

  }

  delete(user:any){

  }

  get isMobile() {
    return this.getScreenWidth < Commons.MOBILE_WIDTH
  }
}
