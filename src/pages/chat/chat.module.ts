import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ChatPage} from './chat';
import {MomentModule} from 'angular2-moment';
import {TranslaterModule} from '../../app/translate.module';

@NgModule({
    declarations: [
        ChatPage,
    ],
    imports: [
        IonicPageModule.forChild(ChatPage),
        MomentModule,
        TranslaterModule
    ],
    exports: [
        ChatPage
    ]
})
export class ChatPageModule {
}
