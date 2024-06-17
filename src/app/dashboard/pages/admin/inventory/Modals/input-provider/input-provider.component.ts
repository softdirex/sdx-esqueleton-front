import { Component, OnInit } from '@angular/core';
import { Provider } from '../../Models/Provider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptionEnum } from '../../Enums/ModalOptionEnum';
import { lastValueFrom } from 'rxjs';
import { InventoryService } from '../../services/inventory.service';
import { Commons } from 'src/app/shared/Commons';
import { InputStoreComponent } from '../input-store/input-store.component';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';


@Component({
  selector: 'app-input-provider',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    FormsModule,
    NgbTooltipModule
  ],
  templateUrl: './input-provider.component.html',
  styleUrl: './input-provider.component.css'
})
export class InputProviderComponent implements OnInit {

  EDIT: number = ModalOptionEnum.OPTION_EDIT
  ADD: number = ModalOptionEnum.OPTION_ADD
  RESTORE: number = ModalOptionEnum.OPTION_RESTORE
  option: number = this.ADD
  provider: Provider = new Provider({});
  fProvider: Provider = new Provider({});
  loading = false
  errorMessage = ''

  constructor(
    public inventoryService: InventoryService,
    public modalRef: MdbModalRef<InputStoreComponent>,
  ) {

  }

  ngOnInit(): void {
    if (this.provider.name != '') {
      this.option = this.EDIT
      this.fProvider = { ...this.provider }
    }
  }
  async restore() {
    this.loading = true
    this.mapProvider(this.fProvider)
    try {
      if (this.option == this.RESTORE) {
        this.provider.status = Commons.STATUS_ACTIVE
        await lastValueFrom(this.inventoryService.updateProvider(this.provider, Commons.sessionCredentials()))
      }
      this.loading = false
      this.modalRef.close()
    } catch (error: any) {
      this.mapErrorResponse(error.error.detail)
    } finally {
      this.loading = false;
    }
  }

  cancel(): void {
    this.modalRef.close()
  }


  async onSubmit() {
    this.loading = true
    this.mapProvider(this.fProvider)
    try {
      if (this.option == this.EDIT) {
        if (this.fProvider.email == '') {
          this.errorMessage = 'El email es obligatorio'
          return
        }
        if (this.fProvider.phone == '') {
          this.errorMessage = 'El telefono es obligatorio'
          return
        }
        if (!this.isValidPhone(this.fProvider.phone)) {
          this.errorMessage = 'El teléfono solo puede contener números y los caracteres + - ( )';
          this.loading = false;
          return;
        }
        await lastValueFrom(this.inventoryService.updateProvider(this.provider, Commons.sessionCredentials()))
      } else {
        if (this.fProvider.name == '') {
          this.errorMessage = 'El nombre es obligatorio'
          return
        }
        if (this.fProvider.country == '') {
          this.errorMessage = 'El Pais es obligatorio'
          return
        }
        if (this.fProvider.doc_number == '') {
          this.errorMessage = 'El Documento es obligatorio'
          return
        }
        if(this.fProvider.doc_number.length > 40){
          this.errorMessage = 'Formato de documento incorrecto'
          return
        }
        if (this.fProvider.email == '') {
          this.errorMessage = 'El email es obligatorio'
          return
        }
        if (this.fProvider.phone == '') {
          this.errorMessage = 'El telefono es obligatorio'
          return
        }
        if (!this.isValidPhone(this.fProvider.phone)) {
          this.errorMessage = 'El teléfono solo puede contener números y los caracteres + - ( )';
          this.loading = false;
          return;
        }

        this.provider.status = Commons.STATUS_ACTIVE
        await lastValueFrom(this.inventoryService.createProvider(this.provider, Commons.sessionCredentials()))
      }
      this.loading = false
      this.modalRef.close()
    } catch (error: any) {
      if (error.error.detail == 'Provider already exists') {
        await this.searchData()
      }
      this.mapErrorResponse(error.error.detail)
    } finally {
      this.loading = false;
    }
  }

  isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d+\-()]+$/;
    return phoneRegex.test(phone);
  }

  async searchData() {
    try {
      this.loading = true
      let search: any = await lastValueFrom(this.inventoryService.getProviders(Commons.sessionCredentials(), null, `doc_number${Commons.F_EQUAL}${this.provider.doc_number}`, 1, 1))
      if (search.data.length > 0) {
        this.option = this.EDIT
        this.provider = search.data[0]
        this.fProvider = { ...this.provider }
      } else {
        search = await lastValueFrom(this.inventoryService.getProviders(Commons.sessionCredentials(), Commons.STATUS_DELETED_ACTIVE + '', `doc_number${Commons.F_EQUAL}${this.provider.doc_number}`, 1, 1))
        if (search.data.length > 0) {
          this.option = this.RESTORE
          this.provider = search.data[0]
          this.fProvider = { ...this.provider }
        }
      }
    } catch (error: any) {
      this.mapErrorResponse(error.error.detail)
    } finally {
      this.loading = false;
    }
  }

  mapProvider(data: any) { //data es el objeto 
    this.provider.name = data.name;
    this.provider.doc_number = data.doc_number;
    this.provider.email = data.email;
    this.provider.phone = data.phone.toString();
    this.provider.country = data.country;
  }


  private mapErrorResponse(detail: any) {
    detail = (detail != undefined && detail != null) ? detail : 'ERROR'
    switch (detail) {
      case 'Exceed the maximum number of filters':
        this.errorMessage = 'validations.filters-exceed'
        break;
      case 'Unauthorized, wrong owner':
        this.errorMessage = 'validations.unauthorize-user'
        break;
      case 'wrong privilege to delete inactive':
        this.errorMessage = 'validations.wrong-privilege'
        break
      default:
        this.errorMessage = detail
        break;
    }
  }
}



