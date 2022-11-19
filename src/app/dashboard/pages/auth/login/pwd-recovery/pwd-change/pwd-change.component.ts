import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { CustomersService } from 'src/app/services/customers.service';
import { LanguageUtilService } from 'src/app/services/language-util.service';
import { Commons } from 'src/app/shared/utils/commons';
import { Customer } from 'src/app/shared/utils/interfaces/core/customer';
import { AlertModalComponent } from 'src/app/shared/utils/modals/alert-modal/alert-modal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pwd-change',
  templateUrl: './pwd-change.component.html',
  styleUrls: ['./pwd-change.component.scss']
})
export class PwdChangeComponent implements OnInit {

  

}
