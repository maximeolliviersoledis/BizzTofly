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
import { NavController, IonicPage, LoadingController } from 'ionic-angular';
import { OrdersService } from './orders.service';
var OrdersPage = /** @class */ (function () {
    function OrdersPage(navCtrl, loadingCtrl, orderService) {
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.orderService = orderService;
        this.orders = [];
        this.featured = [];
    }
    OrdersPage.prototype.ngOnInit = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: 'please wait'
        });
        loader.present();
        this.orderService.getOrders()
            .subscribe(function (orders) {
            _this.orders = orders;
            loader.dismiss();
        }, function (error) {
            loader.dismiss();
        });
    };
    OrdersPage.prototype.orderDetails = function (orderId) {
        this.navCtrl.push("OrderDetailsPage", {
            orderId: orderId
        });
    };
    OrdersPage.prototype.navcart = function () {
        this.navCtrl.push("CartPage");
    };
    OrdersPage.prototype.isOrder = function () {
        return this.orders.length == 0 ? false : true;
    };
    OrdersPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-orders',
            templateUrl: 'orders.html',
            providers: [OrdersService]
        }),
        __metadata("design:paramtypes", [NavController,
            LoadingController,
            OrdersService])
    ], OrdersPage);
    return OrdersPage;
}());
export { OrdersPage };
//# sourceMappingURL=orders.js.map