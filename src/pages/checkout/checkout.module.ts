import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CheckoutPage} from './checkout';
import {TranslaterModule} from '../../app/translate.module';


@NgModule({
    declarations: [
        CheckoutPage
    ],
    imports: [
        IonicPageModule.forChild(CheckoutPage),
        TranslaterModule

    ],
    exports: [
        CheckoutPage
    ]
})
export class CheckoutPageModule {
}
