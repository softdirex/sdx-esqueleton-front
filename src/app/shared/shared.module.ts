import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoRootModule } from './transloco-root.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedRoutingModule } from './shared-routing.module';
import { NameFormatPipe } from './pipes/name-format.pipe';


@NgModule({
  imports: [
    CommonModule,
    SharedRoutingModule,
    ReactiveFormsModule,
    TranslocoRootModule,
  ],
  declarations: [
    NameFormatPipe,
  ],
  exports: [
    TranslocoRootModule,
    ReactiveFormsModule,
    NameFormatPipe
  ],
  providers: [
    NameFormatPipe,
  ],
})
export class SharedModule { }
