import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderStatusPage } from './order-status';
import { TranslaterModule } from '../../app/translate.module';

@NgModule({
  declarations: [
    OrderStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderStatusPage),
    TranslaterModule
  ],
  exports: [
    OrderStatusPage
  ]
})
export class OrderStatusPageModule {}
