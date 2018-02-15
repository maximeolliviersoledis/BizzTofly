import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ThankyouPage } from './thankyou';
import { TranslaterModule } from '../../app/translate.module';


@NgModule({
  declarations: [
    ThankyouPage
  ],
  imports: [
    IonicPageModule.forChild(ThankyouPage),
    TranslaterModule
    
  ],
  exports: [
    ThankyouPage
  ]
})
export class ThankyouPageModule {}