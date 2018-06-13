import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecapPage } from './recap';
import { TranslaterModule } from '../../app/translate.module';
import { CustomHeaderPageModule } from '../../pages/custom-header/custom-header.module';
import { CustomOrderHeaderPageModule } from '../custom-order-header/custom-order-header.module';

@NgModule({
  declarations: [
    RecapPage,
  ],
  imports: [
    IonicPageModule.forChild(RecapPage),
    TranslaterModule,
    CustomHeaderPageModule,
    CustomOrderHeaderPageModule
  ],
})
export class RecapPageModule {}
