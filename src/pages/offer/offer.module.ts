import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfferPage } from './offer';
import { TranslaterModule } from '../../app/translate.module';


@NgModule({
  declarations: [
    OfferPage
  ],
  imports: [
    IonicPageModule.forChild(OfferPage),
    TranslaterModule
    
  ],
  exports: [
    OfferPage
  ]
})
export class OfferPageModule {}