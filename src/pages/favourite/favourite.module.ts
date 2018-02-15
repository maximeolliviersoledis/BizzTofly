import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavouritePage } from './favourite';
import { TranslaterModule } from '../../app/translate.module';


@NgModule({
  declarations: [
    FavouritePage
  ],
  imports: [
    IonicPageModule.forChild(FavouritePage),
    TranslaterModule
    
  ],
  exports: [
    FavouritePage
  ]
})
export class FavouritePageModule {}