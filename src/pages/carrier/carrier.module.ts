import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarrierPage } from './carrier';

@NgModule({
  declarations: [
    CarrierPage,
  ],
  imports: [
    IonicPageModule.forChild(CarrierPage),
  ],
})
export class CarrierPageModule {}
