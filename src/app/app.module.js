var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from './app.component';
import { Service } from '../app/service';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule, TranslateStaticLoader, TranslateLoader } from 'ng2-translate/ng2-translate';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from "@angular/platform-browser";
import { ConstService } from '../providers/const-service';
import { UserService } from '../providers/user-service';
import { SocketService } from '../providers/socket-service';
export function createTranslateLoader(http) {
    return new TranslateStaticLoader(http, './assets/i18n', '.json');
}
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                MyApp
            ],
            imports: [
                IonicModule.forRoot(MyApp),
                IonicStorageModule.forRoot(),
                BrowserModule,
                HttpModule,
                TranslateModule.forRoot({
                    provide: TranslateLoader,
                    useFactory: createTranslateLoader,
                    deps: [Http]
                })
            ],
            exports: [BrowserModule, HttpModule, TranslateModule],
            bootstrap: [IonicApp],
            entryComponents: [
                MyApp
            ],
            providers: [
                { provide: ErrorHandler, useClass: IonicErrorHandler },
                Service,
                StatusBar,
                SplashScreen,
                ConstService,
                SocketService,
                UserService
            ]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map