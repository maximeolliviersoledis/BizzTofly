import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarrierPage } from './carrier';
import { TranslaterModule } from '../../app/translate.module';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { CustomOrderHeaderPageModule } from '../custom-order-header/custom-order-header.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    CarrierPage,
  ],
  imports: [
    IonicPageModule.forChild(CarrierPage),
    TranslaterModule,
    CustomHeaderPageModule,
    CustomOrderHeaderPageModule,
    PipesModule
  ],
})
export class CarrierPageModule {}
