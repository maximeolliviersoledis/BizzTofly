import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { TranslaterModule } from '../../app/translate.module';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    HomePage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    TranslaterModule,
    CustomHeaderPageModule,
    PipesModule
  ],
  exports: [
    HomePage
  ]
})
export class HomePageModule {}