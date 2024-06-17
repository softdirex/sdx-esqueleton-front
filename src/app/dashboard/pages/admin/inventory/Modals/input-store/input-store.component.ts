import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ModalOptionEnum } from '../../Enums/ModalOptionEnum';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { InventoryService } from '../../services/inventory.service';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '../../Models/Store';
import { Commons } from 'src/app/shared/Commons';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-input-store',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    FormsModule,
    NgbTooltipModule
  ],
  templateUrl: './input-store.component.html',
  styleUrl: './input-store.component.css'
})
export class InputStoreComponent implements OnInit {

  EDIT: number = ModalOptionEnum.OPTION_EDIT
  ADD: number = ModalOptionEnum.OPTION_ADD
  RESTORE: number = ModalOptionEnum.OPTION_RESTORE
  store: Store = new Store({});
  fStore: Store = new Store({});
  option: number = this.ADD
  stores: any;
  inputName = new UntypedFormControl('', [Validators.required, Validators.pattern(environment.namesRegex), Validators.maxLength(200), Validators.minLength(2)]);
  loading = false
  errorMessage = ''

  constructor(
    public modalRef: MdbModalRef<InputStoreComponent>,
    public inventoryService: InventoryService
  ) {

  }

  ngOnInit(): void {
    if (this.store.name != '') {
      this.option = this.EDIT
      this.fStore = { ...this.store }
    }
  }



  async onSubmit() {
    this.loading = true
    this.mapStore(this.fStore)
    try {
      if (this.option == this.EDIT) {
        await lastValueFrom(this.inventoryService.updateStore(this.store, Commons.sessionCredentials()))
      } else {
        this.store.status = Commons.STATUS_ACTIVE
        await lastValueFrom(this.inventoryService.createStore(this.store, Commons.sessionCredentials()))
      }
      this.loading = false
      this.modalRef.close()
    } catch (error: any) {
      if (error.error.detail == 'Store already exists') {
        await this.searchData()
      }
      this.mapErrorResponse(error.error.detail)
    } finally {
      this.loading = false;
    }
  }

  async restore(){
    this.loading = true
    this.mapStore(this.fStore)
    try {
      if (this.option == this.RESTORE) {
        this.store.status = Commons.STATUS_ACTIVE
        await lastValueFrom(this.inventoryService.updateStore(this.store, Commons.sessionCredentials()))
      }
      this.loading = false
      this.modalRef.close()
    } catch (error: any) {
      this.mapErrorResponse(error.error.detail)
    } finally {
      this.loading = false;
    }
  }

  async searchData() {
    try {
      this.loading = true
      let search: any = await lastValueFrom(this.inventoryService.getStores(Commons.sessionCredentials(), null, `name${Commons.F_EQUAL}${this.store.name}`,1,1))
      if (search.data.length > 0) {
        this.option = this.EDIT
        this.store = search.data[0]
        this.fStore = { ...this.store }
      } else {
        search = await lastValueFrom(this.inventoryService.getStores(Commons.sessionCredentials(), Commons.STATUS_DELETED_ACTIVE+'', `name${Commons.F_EQUAL}${this.store.name}`,1,1))
        if (search.data.length > 0) {
          this.option = this.RESTORE
          this.store = search.data[0]
          this.fStore = { ...this.store }
        }
      }
    } catch (error: any) {
      this.mapErrorResponse(error.error.detail)
    } finally {
      this.loading = false;
    }
  }

  mapStore(data: any) { //data es el objeto 
    this.store.name = data.name;
    this.store.address = data.address;
    this.store.description = data.description;
    this.store.areas = [];
  }

  cancel(): void {
    this.modalRef.close()
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
