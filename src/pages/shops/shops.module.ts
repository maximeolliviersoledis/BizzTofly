import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShopsPage } from './shops';
import { TranslaterModule } from '../../app/translate.module';
import { CustomHeaderPageModule } from '../../pages/custom-header/custom-header.module';

@NgModule({
  declarations: [
    ShopsPage
  ],
  imports: [
    IonicPageModule.forChild(ShopsPage),
    TranslaterModule,
    CustomHeaderPageModule
  ],
})
export class ShopsPageModule {}
