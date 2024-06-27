import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { Commons } from 'src/app/shared/Commons';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    TitleCasePipe,
    CommonModule,
    TranslocoModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit{
  selectedOption: any = null
  getScreenWidth: any;
  options: any[] = []

  async ngOnInit(): Promise<void> {
    this.options = this.optionsMenu
    this.getScreenWidth = window.innerWidth
  }

  onSelectOption(option: any) {
    this.selectedOption = option
  }

  get isMobile() {
    return this.getScreenWidth < Commons.MOBILE_WIDTH
  }

  get optionsMenu() {
    return [
      { menu: "Pendientes (5)", icon: "tf-ion-android-folder", router: "admin-deals", enabled: true },
      { menu: "Enviados (4)", icon: "tf-ion-android-hangout", router: "admin-show-favorites", enabled: true },
      { menu: "Confirmados", icon: "tf-ion-android-checkbox", router: "admin-sales-report", enabled: true },
    ]
  }
}
