import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderStatusPage } from './order-status';
import { TranslaterModule } from '../../app/translate.module';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';

@NgModule({
  declarations: [
    OrderStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderStatusPage),
    TranslaterModule,
    CustomHeaderPageModule
  ],
  exports: [
    OrderStatusPage
  ]
})
export class OrderStatusPageModule {}
