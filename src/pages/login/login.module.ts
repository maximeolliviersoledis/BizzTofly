import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { TranslaterModule } from '../../app/translate.module';


@NgModule({
  declarations: [
    LoginPage
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    TranslaterModule
    
  ],
  exports: [
    LoginPage
  ]
})
export class LoginPageModule {}