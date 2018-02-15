import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CategoryPage} from './category';
import {TranslaterModule} from '../../app/translate.module';


@NgModule({
    declarations: [
        CategoryPage
    ],
    imports: [
        IonicPageModule.forChild(CategoryPage),
        TranslaterModule

    ],
    exports: [
        CategoryPage
    ]
})
export class CategoryPageModule {
}
