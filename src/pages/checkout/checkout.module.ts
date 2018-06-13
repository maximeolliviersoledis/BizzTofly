import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CheckoutPage} from './checkout';
import {TranslaterModule} from '../../app/translate.module';
import {CustomOrderHeaderPageModule} from '../custom-order-header/custom-order-header.module';

@NgModule({
    declarations: [
        CheckoutPage
    ],
    imports: [
        IonicPageModule.forChild(CheckoutPage),
        TranslaterModule,
        CustomOrderHeaderPageModule
    ],
    exports: [
        CheckoutPage
    ]
})
export class CheckoutPageModule {
}
