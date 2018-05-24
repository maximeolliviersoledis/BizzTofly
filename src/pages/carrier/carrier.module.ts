import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarrierPage } from './carrier';
import { TranslaterModule } from '../../app/translate.module';

@NgModule({
  declarations: [
    CarrierPage,
  ],
  imports: [
    IonicPageModule.forChild(CarrierPage),
    TranslaterModule
  ],
})
export class CarrierPageModule {}
