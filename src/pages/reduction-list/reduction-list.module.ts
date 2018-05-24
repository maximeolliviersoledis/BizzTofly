import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReductionListPage } from './reduction-list';

@NgModule({
  declarations: [
    ReductionListPage,
  ],
  imports: [
    IonicPageModule.forChild(ReductionListPage),
  ],
})
export class ReductionListPageModule {}
