import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShopDetailsPage } from './shop-details';
import { TranslaterModule } from '../../app/translate.module';
import { CustomHeaderPageModule } from '../../pages/custom-header/custom-header.module';

@NgModule({
  declarations: [
    ShopDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ShopDetailsPage),
    TranslaterModule,
    CustomHeaderPageModule  
  ],
})
export class ShopDetailsPageModule {}
