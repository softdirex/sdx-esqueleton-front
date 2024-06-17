import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { InventoryService } from '../../services/inventory.service';
import { Commons } from 'src/app/shared/Commons';
import { lastValueFrom } from 'rxjs';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-show-history',
  standalone: true,
  imports: [
    CommonModule,
    NgbPagination,
    FormsModule
  ],
  templateUrl: './show-history.component.html',
  styleUrl: './show-history.component.css'
})
export class ShowHistoryComponent implements OnInit {
  user: any = {}
  history: any[] = []
  page = 1;
  totalItems: number = 0
  limit: number = 4
  loading: boolean = false
  role: string = ''
  roles: any[] = [{ name: 'Lector', value: 'VIEWER' }, { name: 'Editor', value: 'EDITOR' }]
  returnData: any = undefined
  confirmModal: MdbModalRef<ConfirmModalComponent> | null = null;
  loadingFile: boolean = false

  constructor(
    public modalRef: MdbModalRef<ShowHistoryComponent>,
    private modalService: MdbModalService,
    private inventoryService: InventoryService
  ) {

  }

  async ngOnInit() {
    await this.loadData()
    this.role = this.user.role
  }

  async loadData() {
    try {
      this.loading = true
      const filters = null//this.inputSearch.value ? `name${Commons.F_EQUAL}${this.inputSearch.value}` : null
      const response = await lastValueFrom(this.inventoryService.getHistory(Commons.sessionCredentials(), this.user.id, filters, this.limit, this.page, Commons.STATUS_ACTIVE))
      this.totalItems = response.meta.total
      this.page = response.meta.current_page
      this.history = response.data
      this.loading = false
    } catch (error) {
      this.loading = false
      console.error(error)
    }
  }

  get disableUpdateBtn() {
    return (Commons.sessionObject().customer.id == this.user.id)
  }

  async update() {
    this.confirmModal = this.modalService.open(ConfirmModalComponent, {
      data: { title: 'Actualizar rol', message: `Al actualizar el rol de ${this.user.name} modificarás todos sus permisos`, icon: Commons.ICON_WARNING },
    })
    this.confirmModal.onClose.subscribe(async (accept: any) => {
      if (accept) {
        try {
          this.loading = true
          const apiRs = await lastValueFrom(this.inventoryService.updateUser({ id: this.user.id, role: this.role, status: this.user.status }, Commons.sessionCredentials()))
          this.returnData = 'updated'
          this.loading = false
        } catch (error) {
          this.loading = false
          console.error(error)
        }
      }
    });
  }

  async exportPdf() {
    this.loadingFile = true;
    try {
      const response: Blob = await lastValueFrom(this.inventoryService.getExport(Commons.sessionCredentials(), this.user.id, 'pdf'));
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Historial_de_acciones_${this.user.name}.pdf`; // Nombre del archivo para PDF
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      this.loadingFile = false;
    }
  }


  async exportExcel() {
    this.loadingFile = true;
    try {
      const response: Blob = await lastValueFrom(this.inventoryService.getExport(Commons.sessionCredentials(), this.user.id, 'excel'));
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Historial_de_acciones_${this.user.name}.xlsx`; // Nombre del archivo para Excel
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting Excel:', error);
    } finally {
      this.loadingFile = false;
    }
  }

  close(): void {
    this.modalRef.close(this.returnData)
  }
}
