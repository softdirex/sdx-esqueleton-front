import { Component } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { Commons } from 'src/app/shared/Commons';

@Component({
  selector: 'app-print-bar-code',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './print-bar-code.component.html',
  styleUrl: './print-bar-code.component.css'
})
export class PrintBarCodeComponent {

  errorMessage: string = ''
  loading: boolean = false
  sizes: any[] = [{ name: 'Grande', value: 'big' }, { name: 'Mediana', value: 'medium' }, { name: 'Pequeña', value: 'small' }]
  product: any = undefined
  sizeSelectValue: string = ''

  constructor(public modalRef: MdbModalRef<PrintBarCodeComponent>,
    private inventoryService: InventoryService,
  ) {
  }

  cancel(): void {
    this.modalRef.close()
  }
  async onSelect() {
    this.loading = true
    try {
      await lastValueFrom(this.inventoryService.printBarcode(Commons.sessionCredentials(), this.sizeSelectValue, this.product.name, this.product.bar_code))
    } catch (error: any) {
      this.errorMessage = error.error ? error.error.detail : error
    }
    this.loading = false
    this.modalRef.close()
  }
}
