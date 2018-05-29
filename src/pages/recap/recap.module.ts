import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecapPage } from './recap';
import { TranslaterModule } from '../../app/translate.module';

@NgModule({
  declarations: [
    RecapPage,
  ],
  imports: [
    IonicPageModule.forChild(RecapPage),
    TranslaterModule
  ],
})
export class RecapPageModule {}
