import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Commons } from 'src/app/shared/Commons';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltipModule
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {

  @Input() stores: any[] = []
  @Output() selectedOption: EventEmitter<any> = new EventEmitter()
  DUESTOCK_ALERT: string = `<div class="alert-danger border-0">
  <h6 class="mt-2 text-center"><i class="tf-ion-ios-information"></i> Expiración</h6>
</div>`
  MINSTOCK_ALERT: string = `<div class="alert-danger border-0">
  <h6 class="mt-2 text-center"><i class="tf-ion-ios-information"></i> Stock mínimo</h6>
</div>`
  MAXSTOCK_ALERT: string = `<div class="alert-warning border-0">
  <h6 class="mt-2 text-center"><i class="tf-ion-ios-information"></i> Stock máximo</h6>
</div>`
  EMPTYSTOCK_ALERT: string = `<div class="alert-warning border-0">
  <h6 class="mt-2 text-center"><i class="tf-ion-ios-information"></i> Sin stock</h6>
</div>`
CHECKED_STOCK:string=`<div class="alert-success border-0">
<h6 class="mt-2 text-center"><i class="tf-ion-ios-checkmark"></i> Stock óptimo</h6>
</div>`
  getScreenWidth: any;
  summaryAlerts:any[]=[
    {type:this.DUESTOCK_ALERT,total:0,amount:0},
    {type:this.MINSTOCK_ALERT,total:0,amount:0},
    {type:this.MAXSTOCK_ALERT,total:0,amount:0},
    {type:this.EMPTYSTOCK_ALERT,total:0,amount:0},
    {type:this.CHECKED_STOCK,total:0,amount:0}
  ]
  sumaTotal = 0

  constructor() {

  }
  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth
    this.checkStores()
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  checkStores() {
    if (this.stores) {
      this.stores.forEach((store: any ) => {
        let summary = { total_items: 0, total_price: 0, alerts: '' };
        this.calculateSubAreas(store.areas, summary);
        store.summary = summary;
        store.summary.alerts = (!store.summary.alerts && store.summary.total_items == 0) ? this.EMPTYSTOCK_ALERT : store.summary.alerts;
      });
    }
  }

  metodosuma(num1: number){
    this.sumaTotal = this.sumaTotal + num1 
  }

  

  calculateSubAreas(areas: any[], summary: { total_items: number, total_price: number, alerts: string }) {
    if (areas) {
      areas.forEach((area: any) => {
        area.items.forEach((item: any) => {
          summary.total_items++;
          let itemPrice = (item.price * item.stock);
          summary.total_price += itemPrice;
          this.metodosuma(itemPrice);
          let itemAlert = this.CHECKED_STOCK
          if(item.stock == 0){
            itemAlert = this.EMPTYSTOCK_ALERT
            const itemSummary = this.summaryAlerts.find(summaryItemAlert => summaryItemAlert.type === itemAlert);
            if (itemSummary) {
                itemSummary.total = itemSummary.total+1
                itemSummary.amount = itemSummary.amount + itemPrice
            }
          }
          if(!summary.alerts && item.stock_max > 0 && item.stock_max <= item.stock){
            itemAlert = this.MAXSTOCK_ALERT
            const itemSummary = this.summaryAlerts.find(summaryItemAlert => summaryItemAlert.type === itemAlert);
            if (itemSummary) {
                itemSummary.total = itemSummary.total+1
                itemSummary.amount = itemSummary.amount + itemPrice
            }
          }
          if (item.due_date) {
            let due_date = new Date(item.due_date)
            if(due_date.getTime() === (new Date()).getTime() || due_date.getTime() < (new Date()).getTime()){
              itemAlert =  this.DUESTOCK_ALERT
              const itemSummary = this.summaryAlerts.find(summaryItemAlert => summaryItemAlert.type === itemAlert);
            if (itemSummary) {
                itemSummary.total = itemSummary.total+1
                itemSummary.amount = itemSummary.amount + itemPrice
            }
            }
          }
          if(item.stock_min >= item.stock){
            itemAlert =  this.MINSTOCK_ALERT
            const itemSummary = this.summaryAlerts.find(summaryItemAlert => summaryItemAlert.type === itemAlert);
            if (itemSummary) {
                itemSummary.total = itemSummary.total+1
                itemSummary.amount = itemSummary.amount + itemPrice
            }
          }
          if(itemAlert == this.CHECKED_STOCK){
            const itemSummary = this.summaryAlerts.find(summaryItemAlert => summaryItemAlert.type === itemAlert);
            if (itemSummary) {
                itemSummary.total = itemSummary.total+1
                itemSummary.amount = itemSummary.amount + itemPrice
            }
          }
          
          summary.alerts = itemAlert
        });
        if (area.subareas) {
          this.calculateSubAreas(area.subareas, summary);
        }
      });
    }
  }

  close() {
    this.selectedOption.emit(null);
  }

  get isMobile() {
    return this.getScreenWidth < Commons.MOBILE_WIDTH
  }

}
