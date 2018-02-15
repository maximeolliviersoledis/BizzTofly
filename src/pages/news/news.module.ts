import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsPage } from './news';
import { TranslaterModule } from '../../app/translate.module';


@NgModule({
  declarations: [
    NewsPage
  ],
  imports: [
    IonicPageModule.forChild(NewsPage),
    TranslaterModule
    
  ],
  exports: [
    NewsPage
  ]
})
export class NewsPageModule {}