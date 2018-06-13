import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomOrderHeaderPage } from './custom-order-header';

@NgModule({
  declarations: [
    CustomOrderHeaderPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomOrderHeaderPage),
  ],
  exports: [
  	CustomOrderHeaderPage
  ]
})
export class CustomOrderHeaderPageModule {}
