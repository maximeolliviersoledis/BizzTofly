import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavouritePage } from './favourite';
import { TranslaterModule } from '../../app/translate.module';
import { CustomHeaderPageModule } from '../../pages/custom-header/custom-header.module';


@NgModule({
  declarations: [
    FavouritePage
  ],
  imports: [
    IonicPageModule.forChild(FavouritePage),
    TranslaterModule,
    CustomHeaderPageModule    
  ],
  exports: [
    FavouritePage
  ]
})
export class FavouritePageModule {}