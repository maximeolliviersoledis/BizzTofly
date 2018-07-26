import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {MyApp} from './app.component';
import {Service} from '../app/service';
import {IonicStorageModule} from '@ionic/storage';
import {TranslateModule, TranslateStaticLoader, TranslateLoader} from 'ng2-translate/ng2-translate';
import {Http, HttpModule} from '@angular/http';
import {BrowserModule} from "@angular/platform-browser";
import {ConstService } from '../providers/const-service';
import {UserService } from '../providers/user-service';
import {SocketService } from '../providers/socket-service';
import {GoogleMaps} from '@ionic-native/google-maps';
import {CgvPageModule} from '../pages/cgv/cgv.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ResponseInterceptor} from '../providers/interceptor-service';
import {JWT} from '../providers/jwt-service';

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
    declarations: [
        MyApp
    ],
    imports: [
        IonicModule.forRoot(MyApp/* ,{
            scrollPadding: false,
            scrollAssist: true,
            autoFocusAssist: false       
        }*/),
        IonicStorageModule.forRoot({
            name: 'bizztoflydb'
        }),
        BrowserModule,
        HttpClientModule,
       // HttpModule,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [Http]
        }),
        CgvPageModule
    ],
    exports: [BrowserModule, TranslateModule],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp
    ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        Service,
        StatusBar,
        SplashScreen,
        ConstService,
        SocketService,
        UserService,
        GoogleMaps,
        JWT,
        {provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi:true},
    ]
})
export class AppModule {
}
