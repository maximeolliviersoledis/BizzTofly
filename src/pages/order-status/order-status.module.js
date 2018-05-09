var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderStatusPage } from './order-status';
import { TranslaterModule } from '../../app/translate.module';
var OrderStatusPageModule = /** @class */ (function () {
    function OrderStatusPageModule() {
    }
    OrderStatusPageModule = __decorate([
        NgModule({
            declarations: [
                OrderStatusPage,
            ],
            imports: [
                IonicPageModule.forChild(OrderStatusPage),
                TranslaterModule
            ],
            exports: [
                OrderStatusPage
            ]
        })
    ], OrderStatusPageModule);
    return OrderStatusPageModule;
}());
export { OrderStatusPageModule };
//# sourceMappingURL=order-status.module.js.map