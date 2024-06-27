import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { Commons } from 'src/app/shared/Commons';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [
    TitleCasePipe,
    CommonModule,
    TranslocoModule
  ],
  templateUrl: './market.component.html',
  styleUrl: './market.component.css'
})
export class MarketComponent implements OnInit {
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
      { menu: "Ofertas", icon: "tf-ion-ios-pricetag", router: "admin-deals", enabled: true },
      { menu: "Favoritos", icon: "tf-ion-ios-heart", router: "admin-show-favorites", enabled: true },
      { menu: "Mas vendidos", icon: "tf-ion-ios-flame", router: "admin-sales-report", enabled: true },
      { menu: "Valoraciones", icon: "tf-ion-ios-star-half", router: "admin-rating-report", enabled: true },
    ]
  }
}
