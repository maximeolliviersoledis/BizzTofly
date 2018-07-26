import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecapPaymentPage } from './recap-payment';
import { TranslaterModule } from '../../app/translate.module';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    RecapPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(RecapPaymentPage),
    TranslaterModule,
    CustomHeaderPageModule,
    PipesModule
  ],
})
export class RecapPaymentPageModule {}
