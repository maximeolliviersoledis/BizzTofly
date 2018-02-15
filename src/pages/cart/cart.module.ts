import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CartPage} from './cart';
import {TranslaterModule} from '../../app/translate.module';

@NgModule({
    declarations: [
        CartPage
    ],
    imports: [
        IonicPageModule.forChild(CartPage),
        TranslaterModule

    ],
    exports: [
        CartPage
    ]
})
export class CartPageModule {
}
