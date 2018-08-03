import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatDetailsPage } from './chat-details';
import { TranslaterModule } from '../../app/translate.module';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ChatDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatDetailsPage),
    TranslaterModule,
    CustomHeaderPageModule,
    PipesModule
  ],
})
export class ChatDetailsPageModule {}
