import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { CustomersService } from 'src/app/services/customers.service';
import { Commons } from 'src/app/shared/utils/commons';
import { ServiceResponse } from 'src/app/shared/utils/interfaces/core/service-response';
import { AlertModalComponent } from 'src/app/shared/utils/modals/alert-modal/alert-modal.component';

@Component({
  selector: 'app-pwd-recovery',
  templateUrl: './pwd-recovery.component.html',
  styleUrls: ['./pwd-recovery.component.scss']
})
export class PwdRecoveryComponent implements OnInit {

  

}
