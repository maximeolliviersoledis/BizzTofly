import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductDetailsPage } from './product-details';
import { TranslaterModule } from '../../app/translate.module';


@NgModule({
  declarations: [
    ProductDetailsPage
  ],
  imports: [
    IonicPageModule.forChild(ProductDetailsPage),
    TranslaterModule
    
  ],
  exports: [
    ProductDetailsPage
  ]
})
export class ProductDetailsPageModule {}