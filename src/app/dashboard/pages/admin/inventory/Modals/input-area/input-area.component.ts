import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { ModalOptionEnum } from '../../Enums/ModalOptionEnum';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../services/inventory.service';
import { Area } from '../../Models/Area';
import { lastValueFrom } from 'rxjs';
import { Commons } from 'src/app/shared/Commons';




@Component({
  selector: 'app-input-area',
  standalone: true,
  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    
  ],
  templateUrl: './input-area.component.html',
  styleUrl: './input-area.component.css'
})
export class InputAreaComponent implements OnInit {

  EDIT: number = ModalOptionEnum.OPTION_EDIT
  ADD: number = ModalOptionEnum.OPTION_ADD
  modalOption: number = this.EDIT
  area: any = null;
  store: any = null;
  inputName = new UntypedFormControl('', [Validators.required, Validators.pattern(environment.namesRegex), Validators.maxLength(200), Validators.minLength(2)]);
  errorMessage: string = ''
  loading: boolean = false
  option: number = this.ADD
  modalDataService: any;
  areaId: any = null;
  storeId: any = null;
  

  constructor(
    public modalRef: MdbModalRef<InputAreaComponent>,
    public inventoryService: InventoryService
  ) {

  }

  ngOnInit(): void {
    if (this.modalOption == ModalOptionEnum.OPTION_EDIT) {
      this.inputName.setValue(this.area.name)
    }
    

  }

  async add() {
    this.loading = true
    let subArea: Area = {
      name: this.inputName.value,
      area_lvl: this.area ? this.area.area_lvl + 1 : 1,
      area_id: 0,
      store_id: 0,
      items: [],
      subareas: [],
      status: Commons.STATUS_ACTIVE,
      
    }
    if (this.store) {
      /**
       * this.area es de tipo Store, solo Store tiene areas, Areas tiene subareas
       */
      subArea.area_lvl = 1
      subArea.store_id = this.store.id
      try {
        subArea = await lastValueFrom(this.inventoryService.createArea(subArea, Commons.sessionCredentials(), subArea.store_id, null))
        if(!this.store.areas){
          this.store.areas = []
        }
        this.store.areas.push(subArea)
        this.loading = false
        this.modalRef.close()
      } catch (error: any) {
        this.loading = false
        this.mapErrorResponse(error.error.detail)
      }
    } else {
      if (!this.area.subareas) {
        this.area.subareas = []
      }
      subArea.area_id = this.area.id
      try {
        subArea = await lastValueFrom(this.inventoryService.createArea(subArea, Commons.sessionCredentials(), null, subArea.area_id))
        if(!this.area.subareas){
          this.area.subareas = []
        }
        this.area.subareas.push(subArea)
        this.loading = false
        this.modalRef.close()
      } catch (error: any) {
        this.loading = false
        this.mapErrorResponse(error.error.detail)
      }
    }
  }


  async update() {
    this.loading = true
    try {
      const request = {...this.area}
      request.name = this.inputName.value
      const apiRS = await lastValueFrom(this.inventoryService.updateArea(request,Commons.sessionCredentials(), this.storeId, this.areaId))  
      this.area.name = apiRS.name
    } catch (error:any) {
      this.loading = false
      this.mapErrorResponse(error.error.detail)
    }
    this.loading = false
    this.modalRef.close()
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
      case 'Area contains subareas and cannot be deleted':
        this.errorMessage = 'El area contiene subareas, no se puede eliminar'
        break
      default:
        this.errorMessage = detail
        break;
    }
  }

}
