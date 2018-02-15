import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationPage } from './location';
import { AgmCoreModule } from '@agm/core';
import { TranslaterModule } from '../../app/translate.module';


@NgModule({
  declarations: [
    LocationPage
  ],
  imports: [
    IonicPageModule.forChild(LocationPage),
    //   AgmCoreModule.forRoot({
    //    apiKey: 'AIzaSyDkIzaOmzxf0hm5Qd9h7YeEMtD5Iz_hpbY'
    // }),
     AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC9QKBcDPx-r1y23IHE-Wf3ZjNZZJ1I6H4'
    }),
    TranslaterModule
    
  ],
  exports: [
    LocationPage
  ]
})
export class LocationPageModule {}