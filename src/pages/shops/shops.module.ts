import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShopsPage } from './shops';
import { TranslaterModule } from '../../app/translate.module';

@NgModule({
  declarations: [
    ShopsPage
  ],
  imports: [
    IonicPageModule.forChild(ShopsPage),
    TranslaterModule
  ],
})
export class ShopsPageModule {}
