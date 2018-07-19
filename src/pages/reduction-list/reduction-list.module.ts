import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReductionListPage } from './reduction-list';
import { TranslaterModule } from '../../app/translate.module';
import { CustomHeaderPageModule } from '../../pages/custom-header/custom-header.module';

@NgModule({
  declarations: [
    ReductionListPage,
  ],
  imports: [
    IonicPageModule.forChild(ReductionListPage),
    TranslaterModule,
    CustomHeaderPageModule
  ],
})
export class ReductionListPageModule {}
