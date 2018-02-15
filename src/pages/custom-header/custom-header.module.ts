import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomHeaderPage } from './custom-header';

@NgModule({
  declarations: [
    CustomHeaderPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomHeaderPage),
  ],
  exports: [
    CustomHeaderPage
  ]
})
export class CustomHeaderPageModule {}
