import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderDetailsPage } from './order-details';
import { TranslaterModule } from '../../app/translate.module';
import { Ionic2RatingModule } from 'ionic2-rating';


@NgModule({
  declarations: [
    OrderDetailsPage
  ],
  imports: [
    IonicPageModule.forChild(OrderDetailsPage),
    TranslaterModule,
    Ionic2RatingModule
    
  ],
  exports: [
    OrderDetailsPage
  ]
})
export class OrderDetailsPageModule {}