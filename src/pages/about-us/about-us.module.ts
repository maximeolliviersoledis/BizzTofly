import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AboutUsPage} from './about-us';
import {TranslaterModule} from '../../app/translate.module';

@NgModule({
    declarations: [
        AboutUsPage
    ],
    imports: [
        IonicPageModule.forChild(AboutUsPage),
        TranslaterModule

    ],
    exports: [
        AboutUsPage
    ]
})
export class AboutUsPageModule {
}
