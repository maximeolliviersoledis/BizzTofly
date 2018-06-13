import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RatingPage } from './rating';
import { Ionic2RatingModule } from 'ionic2-rating';
import { TranslaterModule } from '../../app/translate.module';
import { CustomHeaderPageModule }from '../../pages/custom-header/custom-header.module';

@NgModule({
  declarations: [
    RatingPage,
  ],
  imports: [
    IonicPageModule.forChild(RatingPage),
    Ionic2RatingModule,
    TranslaterModule,
    CustomHeaderPageModule
  ],
  exports: [
    RatingPage
  ]
})
export class RatingPageModule {}
