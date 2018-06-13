import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AboutUsPage} from './about-us';
import {TranslaterModule} from '../../app/translate.module';
import {CustomHeaderPageModule} from '../../pages/custom-header/custom-header.module';

@NgModule({
    declarations: [
        AboutUsPage
    ],
    imports: [
        IonicPageModule.forChild(AboutUsPage),
        TranslaterModule,
        CustomHeaderPageModule
    ],
    exports: [
        AboutUsPage
    ]
})
export class AboutUsPageModule {
}
