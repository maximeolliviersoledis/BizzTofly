var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { IonicPage, AlertController, NavController, PopoverController, ToastController } from "ionic-angular";
import { CartService } from './cart.service';
var CartPage = /** @class */ (function () {
    function CartPage(navCtrl, alertCtrl, popoverCtrl, toastCtrl, cartService) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.popoverCtrl = popoverCtrl;
        this.toastCtrl = toastCtrl;
        this.cartService = cartService;
        this.cartItems = [];
        this.taxAmount = 0;
        this.couponDiscount = 0;
        this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
    }
    CartPage.prototype.ngOnInit = function () {
        var _this = this;
        if (this.cartItems != null) {
            this.noOfItems = this.cartItems.length;
            this.cartService.getCoupons().subscribe(function (coupons) {
                _this.coupons = coupons;
            });
            this.calculatePrice();
        }
    };
    CartPage.prototype.deleteItem = function (data) {
        for (var i = 0; i <= this.cartItems.length - 1; i++) {
            if (this.cartItems[i].productId == data.productId && this.cartItems[i].sizeOption.pname == data.sizeOption.pname) {
                this.cartItems.splice(i, 1);
            }
        }
        if (this.cartItems.length == 0) {
            localStorage.removeItem('cartItem');
            this.noOfItems = null;
        }
        else {
            this.calculatePrice();
            localStorage.setItem('cartItem', JSON.stringify(this.cartItems));
            this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
            this.noOfItems = this.noOfItems - 1;
        }
        this.applyCoupon();
    };
    CartPage.prototype.applyCoupon = function () {
        var subTotals = this.subTotalPrice;
        this.deductedPrice = Number((this.couponDiscount / 100 * subTotals).toFixed(2));
        subTotals = subTotals - this.deductedPrice;
        this.grandTotal = Number((subTotals + this.taxAmount).toFixed(2));
        //this.createToaster('Coupon applied successfully', '3000');
    };
    CartPage.prototype.checkout = function () {
        var amountDetails = {};
        amountDetails.grandTotal = this.grandTotal;
        amountDetails.subTotal = this.subTotalPrice;
        amountDetails.tax = this.taxAmount;
        amountDetails.couponDiscount = this.couponDiscount;
        amountDetails.deductedPrice = this.deductedPrice;
        if (localStorage.getItem('token')) {
            this.navCtrl.push("AddressListPage", {
                amountDetails: amountDetails
            });
        }
        else {
            this.navCtrl.push("LoginPage", {
                amountDetails: amountDetails,
                flag: 0
            });
        }
    };
    CartPage.prototype.calculatePrice = function () {
        var proGrandTotalPrice = 0;
        for (var i = 0; i <= this.cartItems.length; i++) {
            if (this.cartItems[i] != null) {
                if (this.cartItems[i].extraPrice != null) {
                    proGrandTotalPrice = proGrandTotalPrice + this.cartItems[i].itemTotalPrice + this.cartItems[i].extraPrice;
                }
                else {
                    proGrandTotalPrice = proGrandTotalPrice + this.cartItems[i].itemTotalPrice;
                }
                this.subTotalPrice = Number(proGrandTotalPrice.toFixed(2));
            }
        }
        this.taxAmount = Number(((5 / 100) * this.subTotalPrice).toFixed(2));
        this.grandTotal = Number((this.subTotalPrice + this.taxAmount).toFixed(2));
    };
    CartPage.prototype.add = function (data) {
        if (data.Quantity < 20) {
            data.Quantity = data.Quantity + 1;
            for (var i = 0; i <= this.cartItems.length - 1; i++) {
                if (this.cartItems[i].productId == data.productId && this.cartItems[i].sizeOption.pname == data.sizeOption.pname) {
                    this.cartItems[i].Quantity = data.Quantity;
                    if (this.cartItems[i].sizeOption.specialPrice) {
                        this.cartItems[i].itemTotalPrice = (data.Quantity * this.cartItems[i].sizeOption.specialPrice);
                    }
                    else {
                        this.cartItems[i].itemTotalPrice = (data.Quantity * this.cartItems[i].sizeOption.value);
                    }
                }
            }
            localStorage.setItem('cartItem', JSON.stringify(this.cartItems));
            this.calculatePrice();
            this.applyCoupon();
        }
    };
    CartPage.prototype.remove = function (data) {
        if (data.Quantity > 1) {
            data.Quantity = data.Quantity - 1;
            for (var i = 0; i <= this.cartItems.length - 1; i++) {
                if (this.cartItems[i].productId == data.productId && this.cartItems[i].sizeOption.pname == data.sizeOption.pname) {
                    this.cartItems[i].Quantity = data.Quantity;
                    if (this.cartItems[i].sizeOption.specialPrice) {
                        this.cartItems[i].itemTotalPrice = (data.Quantity * this.cartItems[i].sizeOption.specialPrice);
                    }
                    else {
                        this.cartItems[i].itemTotalPrice = (data.Quantity * this.cartItems[i].sizeOption.value);
                    }
                }
            }
            localStorage.setItem('cartItem', JSON.stringify(this.cartItems));
            this.calculatePrice();
            this.applyCoupon();
        }
    };
    CartPage.prototype.createToaster = function (message, duration) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
    };
    CartPage.prototype.isCart = function () {
        return localStorage.getItem('cartItem') == null || this.cartItems.length == 0 ? false : true;
    };
    CartPage.prototype.gotoHome = function () {
        this.navCtrl.push("HomePage");
    };
    CartPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-cart',
            templateUrl: 'cart.html',
            providers: [CartService]
        }),
        __metadata("design:paramtypes", [NavController,
            AlertController,
            PopoverController,
            ToastController,
            CartService])
    ], CartPage);
    return CartPage;
}());
export { CartPage };
//# sourceMappingURL=cart.js.map