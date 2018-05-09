var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { OrderStatusService } from './order-status.service';
var OrderStatusPage = /** @class */ (function () {
    function OrderStatusPage(navCtrl, navParams, loadingCtrl, orderStatusService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.orderStatusService = orderStatusService;
        this.status = {
            userNotification: []
        };
        this.orderId = this.navParams.get("orderId");
    }
    OrderStatusPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        console.log('ionViewDidLoad OrderStatusPage');
        var loader = this.loadingCtrl.create({
            content: 'please wait'
        });
        loader.present();
        this.orderStatusService.getStatus(this.orderId)
            .subscribe(function (status) {
            console.log("status-" + JSON.stringify(status));
            _this.status = status;
            loader.dismiss();
        }, function (error) {
            loader.dismiss();
        });
    };
    OrderStatusPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-order-status',
            templateUrl: 'order-status.html',
            providers: [OrderStatusService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LoadingController,
            OrderStatusService])
    ], OrderStatusPage);
    return OrderStatusPage;
}());
export { OrderStatusPage };
//# sourceMappingURL=order-status.js.map