import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CategoryPage} from './category';
import {TranslaterModule} from '../../app/translate.module';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';


@NgModule({
    declarations: [
        CategoryPage
    ],
    imports: [
        IonicPageModule.forChild(CategoryPage),
        TranslaterModule,
        CustomHeaderPageModule

    ],
    exports: [
        CategoryPage
    ]
})
export class CategoryPageModule {
}
