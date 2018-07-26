import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPage } from './search';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { TranslaterModule } from '../../app/translate.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
    CustomHeaderPageModule,
    TranslaterModule,
    PipesModule
  ],
})
export class SearchPageModule {}
