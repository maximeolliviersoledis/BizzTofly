var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationPage } from './location';
import { AgmCoreModule } from '@agm/core';
import { TranslaterModule } from '../../app/translate.module';
var LocationPageModule = /** @class */ (function () {
    function LocationPageModule() {
    }
    LocationPageModule = __decorate([
        NgModule({
            declarations: [
                LocationPage
            ],
            imports: [
                IonicPageModule.forChild(LocationPage),
                //   AgmCoreModule.forRoot({
                //    apiKey: 'AIzaSyDkIzaOmzxf0hm5Qd9h7YeEMtD5Iz_hpbY'
                // }),
                AgmCoreModule.forRoot({
                    apiKey: 'AIzaSyC9QKBcDPx-r1y23IHE-Wf3ZjNZZJ1I6H4'
                }),
                TranslaterModule
            ],
            exports: [
                LocationPage
            ]
        })
    ], LocationPageModule);
    return LocationPageModule;
}());
export { LocationPageModule };
//# sourceMappingURL=location.module.js.map