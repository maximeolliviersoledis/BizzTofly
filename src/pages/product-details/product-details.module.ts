import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductDetailsPage } from './product-details';
import { TranslaterModule } from '../../app/translate.module';
import { Ionic2RatingModule } from 'ionic2-rating';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';

@NgModule({
  declarations: [
    ProductDetailsPage
  ],
  imports: [
    IonicPageModule.forChild(ProductDetailsPage),
    TranslaterModule,
    Ionic2RatingModule,
    CustomHeaderPageModule    
  ],
  exports: [
    ProductDetailsPage
  ]
})
export class ProductDetailsPageModule {}