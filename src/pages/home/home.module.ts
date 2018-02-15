import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { TranslaterModule } from '../../app/translate.module';

@NgModule({
  declarations: [
    HomePage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    TranslaterModule
    
  ],
  exports: [
    HomePage
  ]
})
export class HomePageModule {}