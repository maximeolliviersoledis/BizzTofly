import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CartPage} from './cart';
import {TranslaterModule} from '../../app/translate.module';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
    declarations: [
        CartPage
    ],
    imports: [
        IonicPageModule.forChild(CartPage),
        TranslaterModule,
        CustomHeaderPageModule,
        PipesModule
    ],
    exports: [
        CartPage
    ]
})
export class CartPageModule {
}
