import { Component } from '@angular/core';
import { Product } from '../../Models/Product';
import { Commons } from 'src/app/shared/Commons';
import { CommonModule } from '@angular/common';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { InventoryService } from '../../services/inventory.service';
import { lastValueFrom } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';
import { FormsModule } from '@angular/forms';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';

@Component({
  selector: 'app-input-stock',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    FormsModule
  ],
  templateUrl: './input-stock.component.html',
  styleUrl: './input-stock.component.css'
})
export class InputStockComponent {
  option: number = 0;
  INCREASE = Commons.INCREASE
  DECREASE = Commons.DECREASE
  product: Product = new Product({});
  loading: boolean = false
  quantity: number = 0
  note: string = ''
  errorMessage: string = ''
  alertModal: MdbModalRef<AlertModalComponent> | null = null;

  constructor(
    public modalRef: MdbModalRef<InputStockComponent>,
    public inventoryService: InventoryService,
    private modalService: MdbModalService,
  ) {

  }

  async onSubmit() {
    this.errorMessage = ''
    try {
      if (this.quantity <= 0) {
        this.errorMessage = `Cantidad a ${this.option == Commons.INCREASE ? 'incrementar' : 'reducir'} es incorrecta`
        return
      }
      if (!this.note) {
        this.errorMessage = `Debe ingresar una nota adicional`
        return
      }
      this.loading = true
      const apiRS = await lastValueFrom(this.inventoryService.updateStock(this.product.id, this.option, this.quantity, this.note, Commons.sessionCredentials()))
      this.loading = false
      if (apiRS.id) {
        this.openModal(this.option == this.INCREASE ? 'Incrementar stock' : 'Disminuir stock', `El artículo ${this.product.name} fué actualizado satisfactoriamente`, Commons.ICON_SUCCESS)
        this.modalRef.close(apiRS)
      }
    } catch (error: any) {
      this.errorMessage = error.error.detail
    }
  }

  cancel(): void {
    this.modalRef.close()
  }

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }
}
