import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReductionListPage } from './reduction-list';
import { TranslaterModule } from '../../app/translate.module';
import { CustomHeaderPageModule } from '../../pages/custom-header/custom-header.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ReductionListPage,
  ],
  imports: [
    IonicPageModule.forChild(ReductionListPage),
    TranslaterModule,
    CustomHeaderPageModule,
    PipesModule
  ],
})
export class ReductionListPageModule {}
