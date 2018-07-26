import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductListPage } from './product-list';
import { TranslaterModule } from '../../app/translate.module';
import { Ionic2RatingModule } from 'ionic2-rating';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ProductListPage
  ],
  imports: [
    IonicPageModule.forChild(ProductListPage),
    TranslaterModule,
    Ionic2RatingModule,
    CustomHeaderPageModule,
    PipesModule
  ],
  exports: [
    ProductListPage
  ]
})
export class ProductListPageModule {}