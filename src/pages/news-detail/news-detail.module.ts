import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsDetailPage } from './news-detail';
import { TranslaterModule } from '../../app/translate.module';


@NgModule({
  declarations: [
    NewsDetailPage
  ],
  imports: [
    IonicPageModule.forChild(NewsDetailPage),
    TranslaterModule
    
  ],
  exports: [
    NewsDetailPage
  ]
})
export class NewsDetailPageModule {}