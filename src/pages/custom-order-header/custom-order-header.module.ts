import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomOrderHeaderPage } from './custom-order-header';
import { TranslaterModule } from '../../app/translate.module';

@NgModule({
  declarations: [
    CustomOrderHeaderPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomOrderHeaderPage),
    TranslaterModule
  ],
  exports: [
  	CustomOrderHeaderPage
  ]
})
export class CustomOrderHeaderPageModule {}
