import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Settings } from './settings';
import { TranslaterModule } from '../../app/translate.module';
import { FileUploadModule } from 'ng2-file-upload';
import { Ng2CloudinaryModule } from 'ng2-cloudinary';
import { CustomHeaderPageModule } from '../../pages/custom-header/custom-header.module';

@NgModule({
  declarations: [
    Settings
  ],
  imports: [
    IonicPageModule.forChild(Settings),
    TranslaterModule,
    Ng2CloudinaryModule,
    FileUploadModule,
    CustomHeaderPageModule    
  ],
  exports: [
    Settings
  ]
})
export class SettingsModule {}