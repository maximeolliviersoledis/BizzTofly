import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoNetworkPage } from './no-network';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { TranslaterModule } from '../../app/translate.module';

@NgModule({
  declarations: [
    NoNetworkPage,
  ],
  imports: [
    IonicPageModule.forChild(NoNetworkPage),
    CustomHeaderPageModule,
    TranslaterModule
  ],
})
export class NoNetworkPageModule {}
