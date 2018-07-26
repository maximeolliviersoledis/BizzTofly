import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderDetailsPage } from './order-details';
import { TranslaterModule } from '../../app/translate.module';
import { Ionic2RatingModule } from 'ionic2-rating';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    OrderDetailsPage
  ],
  imports: [
    IonicPageModule.forChild(OrderDetailsPage),
    TranslaterModule,
    Ionic2RatingModule,
    CustomHeaderPageModule,
    PipesModule 
  ],
  exports: [
    OrderDetailsPage
  ]
})
export class OrderDetailsPageModule {}