import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactPage } from './contact';
import { TranslaterModule } from '../../app/translate.module';


@NgModule({
  declarations: [
    ContactPage
  ],
  imports: [
    IonicPageModule.forChild(ContactPage),
    TranslaterModule
    
  ],
  exports: [
    ContactPage
  ]
})
export class ContactPageModule {}