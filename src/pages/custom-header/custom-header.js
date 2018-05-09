var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
var CustomHeaderPage = /** @class */ (function () {
    function CustomHeaderPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.searchBarVisible = true;
        this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
        if (this.cartItems != null) {
            this.noOfItems = this.cartItems.length;
        }
    }
    Object.defineProperty(CustomHeaderPage.prototype, "header", {
        get: function () {
            return this.header_data;
        },
        set: function (header_data) {
            this.header_data = header_data;
        },
        enumerable: true,
        configurable: true
    });
    CustomHeaderPage.prototype.searchToggle = function () {
        this.searchBarVisible = !this.searchBarVisible;
    };
    CustomHeaderPage.prototype.gotoCart = function () {
        this.navCtrl.push("CartPage");
    };
    CustomHeaderPage.prototype.gotoHome = function () {
        this.navCtrl.setRoot("HomePage");
    };
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], CustomHeaderPage.prototype, "header", null);
    CustomHeaderPage = __decorate([
        IonicPage(),
        Component({
            selector: 'custom-header',
            templateUrl: 'custom-header.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams])
    ], CustomHeaderPage);
    return CustomHeaderPage;
}());
export { CustomHeaderPage };
//# sourceMappingURL=custom-header.js.map