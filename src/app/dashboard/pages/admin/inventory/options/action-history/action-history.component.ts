import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPagination, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ShowHistoryComponent } from '../../Modals/show-history/show-history.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Commons } from 'src/app/shared/Commons';
import { lastValueFrom } from 'rxjs';
import { InventoryService } from '../../services/inventory.service';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';

@Component({
  selector: 'app-action-history',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltipModule,
    FormsModule,
    NgbPagination
  ],
  templateUrl: './action-history.component.html',
  styleUrl: './action-history.component.css'
})
export class ActionHistoryComponent implements OnInit {
  //@Input() stores: any[] = []
  @Output() selectedOption: EventEmitter<any> = new EventEmitter()
  users: any = []
  filterDate: any = { from: null, to: null }
  page = 1;
  totalItems: number = 0
  limit: number = 4
  showHistoryModal: MdbModalRef<ShowHistoryComponent> | null = null;
  getScreenWidth: any;
  loading: boolean = false
  confirmModal: MdbModalRef<ConfirmModalComponent> | null = null;
  alertModal: MdbModalRef<AlertModalComponent> | null = null;

  constructor(
    private modalService: MdbModalService,
    private inventoryService: InventoryService
  ) {

  }

  async ngOnInit() {
    await this.loadUsers()
    this.getScreenWidth = window.innerWidth
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  get isMobile() {
    return this.getScreenWidth < Commons.MOBILE_WIDTH
  }

  close() {
    this.selectedOption.emit(null);
  }

  showHistory(user: any) {
    this.showHistoryModal = this.modalService.open(ShowHistoryComponent, { data: { user: user } })

    this.showHistoryModal.onClose.subscribe(async (data: any) => {
      if (data === 'updated') {
        await this.loadUsers()
      }
    });
  }

  async loadUsers() {
    try {
      this.limit = this.isMobile ? 4 : 16
      const filters = null//this.inputSearch.value ? `name${Commons.F_EQUAL}${this.inputSearch.value}` : null
      this.loading = true
      const response: any = await lastValueFrom(this.inventoryService.getUsers(Commons.sessionCredentials(), filters, this.limit, this.page, Commons.STATUS_ACTIVE))
      this.totalItems = response.meta.total
      this.page = response.meta.current_page
      this.users = response.data
      this.loading = false
    } catch (error) {
      this.loading = false
    }
  }

  async delete(user: any) {
    if (Commons.sessionObject().customer.id == user.id) {
      this.openModal('No puedes eliminar este usuario', `Actualmente eres usuario activo, no puedes eliminarte`, Commons.ICON_ERROR)
      return
    }
    this.confirmModal = this.modalService.open(ConfirmModalComponent, {
      data: { title: `Eliminar a ${user.name}`, message: `¿Estás seguro de que deseas eliminar el acceso del usuario ${user.name} con permiso ${user.role} a la organización?`, icon: Commons.ICON_WARNING },
    })
    this.confirmModal.onClose.subscribe(async (accept: any) => {
      if (accept) {
        try {
          this.loading = true
          const apiRs = await lastValueFrom(this.inventoryService.deleteUser(user.id, Commons.sessionCredentials()))
          if (apiRs.detail == 'Customer has ben deleted') {
            this.openModal('Usuario eliminado', `El usuario ${user.name} ha sido eliminado satisfactoriamente`, Commons.ICON_SUCCESS)
          }
          this.loadUsers()
          this.loading = false
        } catch (error) {
          this.loading = false
          console.error(error)
        }
      }
    });
  }

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }
}
