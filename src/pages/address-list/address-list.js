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
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AddressListService } from './address-list.service';
import { UserService } from '../../providers/user-service';
var AddressListPage = /** @class */ (function () {
    function AddressListPage(navCtrl, navParams, loadingCtrl, alertCtrl, userService, addressListService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.userService = userService;
        this.addressListService = addressListService;
        this.orderData = {};
        this.showAddress = false;
        this.selectedAddress = {};
        this.amountDetails = {};
        this.pincode_matched = false;
        this.loyaltyPercentage = 0;
        this.loyaltyPoints = 0;
        this.leftLoyaltyPoint = 0;
        this.checked = false;
        this.loyaltyArray = [];
        this.loyaltyObj = {};
        this.amountDetails = this.navParams.get('amountDetails');
        this.orderData.grandTotal = this.amountDetails.grandTotal;
        this.payTotal = this.amountDetails.grandTotal;
        this.orderData.subTotal = this.amountDetails.subTotal;
        this.orderData.taxAmount = this.amountDetails.tax;
        this.orderData.couponDiscountPercentage = this.amountDetails.couponDiscount;
        this.orderData.deductedAmountByCoupon = this.amountDetails.deductedPrice;
        this.orderData.cart = JSON.parse(localStorage.getItem("cartItem"));
        this.header_data = { ismenu: false, isHome: false, isCart: true, isSearch: false, title: 'Delivery Options' };
    }
    AddressListPage.prototype.ngOnInit = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: 'please wait'
        });
        loader.present();
        this.addressListService.getAddressList()
            .subscribe(function (response) {
            _this.addressList = response;
            loader.dismiss();
        }, function (error) {
            loader.dismiss();
        });
        this.addressListService.getAvailablePincodes().subscribe(function (result) {
            console.log("pincodes-" + JSON.stringify(result));
            _this.pincodes = result;
        });
        this.addressListService.getLoyaltyStatus().subscribe(function (loyalty) {
            console.log("loyalty-" + JSON.stringify(loyalty));
            _this.loyaltyObj = loyalty;
        });
        this.userService.getUser().subscribe(function (user) {
            console.log("user-" + JSON.stringify(user));
            _this.loyaltyArray = user.loyaltyPoints;
            if (_this.loyaltyArray != null) {
                var _points = 0;
                for (var i = 0; i < _this.loyaltyArray.length; i++) {
                    _points = Number(_points + _this.loyaltyArray[i].points);
                    _this.loyaltyPoints = _points;
                    console.log(_this.loyaltyPoints);
                }
            }
        });
        this.orderData.status = 'pending';
    };
    AddressListPage.prototype.addAddress = function () {
        this.navCtrl.push("AddressPage", { amountDetails: this.amountDetails });
    };
    AddressListPage.prototype.updateLoyality = function (event) {
        if (this.loyaltyObj.loyalityProgram) {
            if (this.loyaltyPoints >= this.loyaltyObj.minLoyalityPoints) {
                this.checked = event.value;
                if (event.value == true) {
                    if (this.payTotal < this.loyaltyPoints) {
                        this.orderData.grandTotal = 0;
                        this.leftLoyaltyPoint = this.loyaltyPoints - this.payTotal;
                    }
                    else if (this.payTotal > this.loyaltyPoints) {
                        this.orderData.grandTotal = this.payTotal - this.loyaltyPoints;
                        this.leftLoyaltyPoint = 0;
                    }
                }
                else {
                    this.orderData.grandTotal = this.amountDetails.grandTotal;
                }
            }
        }
    };
    AddressListPage.prototype.selectAddress = function (address) {
        this.pincode_matched = false;
        this.orderData.shippingAddress = address;
        delete this.orderData.shippingAddress['_id'];
        this.selectedAddress = address;
        for (var i = 0; i < this.pincodes.length; i++) {
            if (this.pincodes[i].pincode == address.pincode) {
                this.pincode_matched = true;
            }
        }
    };
    AddressListPage.prototype.checkOut = function () {
        if (this.pincode_matched) {
            this.orderData.appliedLoyalty = this.checked;
            if (this.orderData.appliedLoyalty == true) {
                this.orderData.usedLoyaltyPoints = this.loyaltyPoints;
            }
            if (this.orderData.shippingAddress != null) {
                this.navCtrl.push("CheckoutPage", {
                    orderData: this.orderData
                });
            }
            else {
                this.showAlert('Please select address.');
            }
        }
        else {
            this.showAlert('Not available for delivery at your location yet.');
        }
    };
    AddressListPage.prototype.showAlert = function (message) {
        var alert = this.alertCtrl.create({
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    };
    AddressListPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-address-list',
            templateUrl: 'address-list.html',
            providers: [AddressListService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LoadingController,
            AlertController,
            UserService,
            AddressListService])
    ], AddressListPage);
    return AddressListPage;
}());
export { AddressListPage };
//# sourceMappingURL=address-list.js.map