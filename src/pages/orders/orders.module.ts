import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdersPage } from './orders';
import { TranslaterModule } from '../../app/translate.module';
import { CustomHeaderPageModule } from '../../pages/custom-header/custom-header.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    OrdersPage
  ],
  imports: [
    IonicPageModule.forChild(OrdersPage),
    TranslaterModule,
    CustomHeaderPageModule,
    PipesModule
  ],
  exports: [
    OrdersPage
  ]
})
export class OrdersPageModule {}