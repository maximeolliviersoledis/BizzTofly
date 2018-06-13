import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CartPage} from './cart';
import {TranslaterModule} from '../../app/translate.module';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';

@NgModule({
    declarations: [
        CartPage
    ],
    imports: [
        IonicPageModule.forChild(CartPage),
        TranslaterModule,
        CustomHeaderPageModule
    ],
    exports: [
        CartPage
    ]
})
export class CartPageModule {
}
