import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistrationPage } from './registration';
import { TranslaterModule } from '../../app/translate.module';


@NgModule({
  declarations: [
    RegistrationPage
  ],
  imports: [
    IonicPageModule.forChild(RegistrationPage),
    TranslaterModule
    
  ],
  exports: [
    RegistrationPage
  ]
})
export class RegistrationPageModule {}