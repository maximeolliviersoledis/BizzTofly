import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CgvPage } from './cgv';
import { TranslaterModule } from '../../app/translate.module';

@NgModule({
  declarations: [
    CgvPage,
  ],
  imports: [
    IonicPageModule.forChild(CgvPage),
    TranslaterModule
  ],
})
export class CgvPageModule {}
