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
import { AddressService } from './address.service';
var AddressPage = /** @class */ (function () {
    function AddressPage(navCtrl, navParams, loadingCtrl, addressService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.addressService = addressService;
        this.address = {
            userName: '',
            homeNumber: '',
            apartmentName: '',
            mobileNo: '',
            landmark: '',
            city: '',
            state: '',
            pincode: ''
        };
        this.orderData = this.navParams.get('orderData');
    }
    AddressPage.prototype.ngOnInit = function () {
        var _this = this;
        if (this.navParams.get('selectedAddress')) {
            this.selectedAddress = this.navParams.get('selectedAddress');
            if (this.selectedAddress._id) {
                this.addressService.getAddressById(this.selectedAddress._id)
                    .subscribe(function (response) {
                    _this.address.userName = response.userName;
                    _this.address.homeNumber = response.homeNumber;
                    _this.address.apartmentName = response.apartmentName;
                    _this.address.landmark = response.landmark;
                    _this.address.city = response.city;
                    _this.address.state = response.state;
                    _this.address.pincode = response.pincode;
                    _this.address.mobileNo = response.mobileNo;
                });
            }
        }
    };
    AddressPage.prototype.onSubmitAddress = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: 'please wait'
        });
        loader.present();
        if (this.navParams.get('selectedAddress')) {
            this.addressService.updateAddress(this.selectedAddress._id, this.address)
                .subscribe(function (response) {
                loader.dismiss();
                _this.navCtrl.push("CheckoutConfirmPage", { selectedAddress: response,
                    orderData: _this.orderData
                });
            }, function (error) {
                loader.dismiss();
            });
        }
        else {
            this.addressService.addAddress(this.address)
                .subscribe(function (response) {
                loader.dismiss();
                _this.navCtrl.push("AddressListPage", {
                    amountDetails: _this.navParams.get('amountDetails')
                });
            }, function (error) {
                loader.dismiss();
            });
        }
    };
    AddressPage.prototype.confirm = function () {
        this.navCtrl.push("CheckoutConfirmPage");
    };
    AddressPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-address',
            templateUrl: 'address.html',
            providers: [AddressService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LoadingController,
            AddressService])
    ], AddressPage);
    return AddressPage;
}());
export { AddressPage };
//# sourceMappingURL=address.js.map