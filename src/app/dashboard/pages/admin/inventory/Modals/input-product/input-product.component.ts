import { Component, OnInit } from '@angular/core';
import { Product } from '../../Models/Product';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalOptionEnum } from '../../Enums/ModalOptionEnum';
import { InventoryService } from '../../services/inventory.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Commons } from 'src/app/shared/Commons';
import JsBarcode from 'jsbarcode';
import { lastValueFrom } from 'rxjs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import QRCode from 'qrcode'

@Component({
  selector: 'app-input-product',
  standalone: true,
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    NgbTooltipModule,
    MatButtonToggleModule
  ],
  templateUrl: './input-product.component.html',
  styleUrl: './input-product.component.css'
})
export class InputProductComponent implements OnInit {
  product: Product = new Product({});
  fProduct: Product = new Product({});
  area: any = null
  ADD: number = ModalOptionEnum.OPTION_ADD
  EDIT: number = ModalOptionEnum.OPTION_EDIT
  option: number = this.ADD
  showImage: boolean = false
  selectedImage: any = 'assets/images/no-image.png';
  image: File | undefined;
  errorMessage: string = ''
  loading: boolean = false
  codeMode: string = 'AUTO';
  noCode: boolean = false
  isViewer: boolean = true

  constructor(
    public modalRef: MdbModalRef<InputProductComponent>,
    public inventoryService: InventoryService
  ) {

  }
  ngOnInit(): void {
    this.isViewer = Commons.isInvViewer()
    if (this.product.name != '') {
      this.option = this.EDIT
      this.showImage = true
      this.selectedImage = this.product.image ? this.product.image : this.selectedImage
      this.fProduct = { ...this.product }
    }
  }

  async onSubmit() {
    if (this.option == this.ADD) {
      this.fProduct.bar_code = this.codeMode
      if (this.codeMode == 'MANUAL' && this.fProduct.code == '') {
        this.errorMessage = 'El código del producto es obligatorio'
        return
      }
    }
    if (this.fProduct.name == '') {
      this.errorMessage = 'El nombre es obligatorio'
      return
    }
    if (this.fProduct.description == '') {
      this.errorMessage = 'La descripción es obligatoria'
      return
    }
    if (this.fProduct.category == '') {
      this.errorMessage = 'La categoría es obligatoria'
      return
    }
    if (this.fProduct.price <= 0) {
      this.errorMessage = 'El precio es obligatorio'
      return
    }
    if (!this.fProduct.init_price || this.fProduct.init_price <= 0) {
      this.fProduct.init_price = this.fProduct.price
    }
    if (this.option == this.EDIT) {
      this.loading = true
      try {
        let request = this.buildFormData(this.fProduct)
        request.append('id', `${this.product.id}`)
        const apiRS = await lastValueFrom(this.inventoryService.updateItem(request, Commons.sessionCredentials()))
        this.mapProductResponse(apiRS)
        this.loading = false
      } catch (error: any) {
        this.errorMessage = error.error.detail
        this.loading = false
        return
      }
    } else {
      this.fProduct.status = 1
      try {
        this.loading = true
        await lastValueFrom(this.inventoryService.createItem(this.buildFormData(this.fProduct), Commons.sessionCredentials(), this.area.id))
        this.loading = false
      } catch (error: any) {
        this.errorMessage = error.error.detail
        this.loading = false
        return
      }
    }
    this.modalRef.close()
  }

  buildFormData(data: Product) {
    const formData = new FormData();
    if (data.id) formData.append('id', `${data.id}`);
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('location_desc', data.location_desc);
    formData.append('category', data.category);
    formData.append('price', `${data.price}`);
    if (data.init_price) formData.append('init_price', `${data.init_price}`);
    if (data.code) formData.append('code', data.code);
    formData.append('bar_code', data.bar_code);
    formData.append('stock', `${data.stock}`);
    formData.append('stock_min', `${data.stock_min}`);
    formData.append('stock_max', `${data.stock_max}`);
    if (data.due_date) formData.append('due_date', `${data.due_date}`);
    formData.append('status', `${data.status}`);
    if (this.image) {
      formData.append('image', this.image, this.image.name);
    }
    return formData

  }

  mapProductResponse(data: any) {
    this.product.name = data.name;
    this.product.description = data.description;
    this.product.category = data.category;
    this.product.image = data.image;
    this.product.price = data.price;
    this.product.init_price = data.init_price;
    this.product.code = data.code;
    this.product.bar_code = data.bar_code;
    this.product.stock = data.stock;
    this.product.stock_min = data.stock_min;
    this.product.stock_max = data.stock_max;
    this.product.due_date = data.due_date;
    this.product.status = data.status
  }

  buildRequest(id: number, data: any) {
    const request = {
      id: id,
      name: data.name,
      description: data.description,
      categor: data.category,
      image: data.image,
      price: data.price,
      init_price: data.init_price,
      code: data.code,
      bar_code: data.bar_code,
      stock: data.stock,
      stock_min: data.stock_min,
      stock_max: data.stock_max,
      due_date: data.due_date,
      status: data.status
    }
    return request
  }

  cancel(): void {
    this.modalRef.close()
  }

  changeImage() {
    // Implementar la lógica para cargar la imagen desde el sistema de archivos
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.readFile(file);
      }
    };
    input.click();
  }

  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImage = e.target.result;
      this.showImage = true;
    };
    this.image = file
    reader.readAsDataURL(file);
  }

  dropHandler(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.readFile(files[0]);
    }
  }

  dragOverHandler(event: DragEvent) {
    event.preventDefault();
  }

  dragEnterHandler(event: DragEvent) {
    event.preventDefault();
    // Añadir lógica si es necesario para cuando el elemento se arrastra dentro
  }

  dragLeaveHandler(event: DragEvent) {
    event.preventDefault();
    // Añadir lógica si es necesario para cuando el elemento se arrastra fuera
  }

  print() {
  }

  renderBarcode(code: string) {
    const element = document.getElementById('barcode');
    if (element) {
      JsBarcode(element, code, {
        format: 'ean13',
        lineColor: '#000000',
        background: '#FFFFFF',
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 18,
        margin: 10
      });
    }
  }

  renderQRCode(code: string) {
    const element = document.getElementById('barcode');
    if (element) {
      // Limpia el contenido previo del elemento
      element.innerHTML = '';

      // Genera el código QR en formato SVG
      QRCode.toString(code, { type: 'svg' }, (err: any, url: any) => {
        if (err) throw err;
        element.innerHTML = url;
      });
    }
  }

  private calculateCheckDigit(code: string): string {
    let sum = 0;
    for (let i = 0; i < code.length; i++) {
      const digit = parseInt(code.charAt(i), 10);
      sum += (i % 2 === 0) ? digit : digit * 3;
    }
    const remainder = sum % 10;
    const checkDigit = (10 - remainder) % 10;
    return checkDigit.toString();
  }

  private isValidEAN13(code: string): boolean {
    if (code.length !== 13 || !/^\d+$/.test(code)) {
      return false;
    }

    const checkDigit = code[12];
    const calculatedCheckDigit = this.calculateCheckDigit(code.slice(0, 12));

    return checkDigit === calculatedCheckDigit;
  }

  get genCode() {
    if (this.isValidEAN13(this.fProduct.bar_code)) {
      this.renderBarcode(this.fProduct.bar_code)
    } else {
      if (this.fProduct.bar_code) {
        this.renderQRCode(this.fProduct.bar_code)
      } else {
        this.noCode = true
        const element = document.getElementById('noCode') as HTMLCanvasElement;
        if (element) {
          const context = element.getContext('2d');
          if (context) {
            // Limpia el contenido previo del elemento
            context.clearRect(0, 0, element.width, element.height);

            // Establecer el estilo del texto
            context.fillStyle = '#000000'; // Color del texto
            context.font = '20px Arial'; // Fuente y tamaño del texto
            context.textAlign = 'center'; // Alineación del texto
            context.textBaseline = 'middle'; // Línea base del texto

            // Dibujar el texto en el centro del canvas
            context.fillText('SIN CODIGO', element.width / 2, element.height / 2);
          }
        }
      }
    }
    return ''
  }
}
