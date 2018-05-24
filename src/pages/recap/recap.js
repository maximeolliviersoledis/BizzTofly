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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the RecapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var RecapPage = /** @class */ (function () {
    function RecapPage(navCtrl, navParams, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.cartData = {};
        this.orderData = {};
        this.carrierData = {};
        this.products = [];
        this.totalPrice = 0;
    }
    RecapPage.prototype.ngOnInit = function () {
        this.cartData = this.navParams.get('cartData');
        this.orderData = this.navParams.get('orderData');
        this.carrierData = this.navParams.get('carrierData');
        console.log(this.cartData);
        console.log(this.orderData);
        console.log(this.orderData.cart[0].imageUrl);
        this.totalPriceWithTax();
        //this.totalPrice = this.totalPriceWithTax();
        //this.getAllProducts();
    };
    RecapPage.prototype.getAllProducts = function () {
        for (var _i = 0, _a = this.orderData.cart; _i < _a.length; _i++) {
            var product = _a[_i];
            console.log(product);
            for (var _b = 0, _c = product.declinaison; _b < _c.length; _b++) {
                var item = _c[_b];
                console.log(item);
                this.products.push(item);
            }
        }
    };
    RecapPage.prototype.totalProductPrice = function (price, quantity) {
        var productPrice = price * quantity;
        //this.totalPrice += productPrice;
        return productPrice;
    };
    RecapPage.prototype.totalPriceWithTax = function () {
        var _this = this;
        //var cart = JSON.parse(localStorage.getItem('cartItem'));
        this.storage.get('cart').then(function (cart) {
            var totalPrice = 0;
            for (var _i = 0, cart_1 = cart; _i < cart_1.length; _i++) {
                var item = cart_1[_i];
                for (var _a = 0, _b = item.declinaison; _a < _b.length; _a++) {
                    var declinaison = _b[_a];
                    totalPrice += declinaison.endPrice * declinaison.selectedQuantity;
                }
            }
            totalPrice + _this.carrierData.total_price_with_tax;
            _this.totalPrice = totalPrice;
        });
        //return totalPrice;
    };
    RecapPage.prototype.goToPayment = function () {
        this.navCtrl.push('CheckoutPage', {
            cartData: this.cartData,
            orderData: this.orderData,
            carrierData: this.carrierData,
            totalPrice: this.totalPrice
        });
    };
    RecapPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-recap',
            templateUrl: 'recap.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, Storage])
    ], RecapPage);
    return RecapPage;
}());
export { RecapPage };
//# sourceMappingURL=recap.js.map