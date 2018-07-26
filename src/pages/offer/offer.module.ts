import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfferPage } from './offer';
import { TranslaterModule } from '../../app/translate.module';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    OfferPage
  ],
  imports: [
    IonicPageModule.forChild(OfferPage),
    TranslaterModule,
    CustomHeaderPageModule,
    PipesModule
  ],
  exports: [
    OfferPage
  ]
})
export class OfferPageModule {}