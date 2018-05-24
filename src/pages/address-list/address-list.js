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
import { Storage } from '@ionic/storage';
var AddressListPage = /** @class */ (function () {
    function AddressListPage(navCtrl, navParams, loadingCtrl, alertCtrl, userService, addressListService, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.userService = userService;
        this.addressListService = addressListService;
        this.storage = storage;
        this.addressList = [];
        this.orderData = {};
        this.showAddress = false;
        this.selectedAddress = {};
        this.user = {};
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
        //this.orderData.cart=JSON.parse(localStorage.getItem("cartItem"));
        this.storage.get('cart').then(function (cartData) {
            _this.orderData.cart = cartData;
        });
        this.header_data = { ismenu: false, isHome: false, isCart: true, isSearch: false, title: 'Delivery Options' };
    }
    AddressListPage.prototype.ngOnInit = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: 'please wait'
        });
        loader.present();
        /*this.addressListService.getAddressList()
        .subscribe(response=>{
          this.addressList=response;
          loader.dismiss();
        },(error)=>{
          loader.dismiss();
        });*/
        var list = this.navParams.get('addressList');
        if (!list) {
            this.storage.get('user').then(function (data) {
                _this.user = data;
                _this.addressListService.getAddressList(_this.user.id_customer).subscribe(function (data) {
                    console.log(data);
                    if (data.addresses) {
                        var addressList = _this.objectToArray(data.addresses);
                        for (var _i = 0, addressList_1 = addressList; _i < addressList_1.length; _i++) {
                            var address = addressList_1[_i];
                            console.log(address);
                            _this.addressListService.getAddress(address.id).subscribe(function (data) {
                                _this.addressList.push(data);
                                console.log(_this.addressList);
                            });
                        }
                    }
                    loader.dismiss();
                });
            });
        }
        else {
            this.addressList = list;
            console.log("addressList already loaded !");
            loader.dismiss();
        }
        /*this.addressListService.getAvailablePincodes().subscribe(result=>{
          console.log("pincodes-"+JSON.stringify(result));
          this.pincodes=result;
        });
        this.addressListService.getLoyaltyStatus().subscribe(loyalty=>{
          console.log("loyalty-"+JSON.stringify(loyalty));
          this.loyaltyObj=loyalty;
        })*/
        /*this.userService.getUser().subscribe(user=>{
          console.log("user-"+JSON.stringify(user));
          this.loyaltyArray=user.loyaltyPoints;
          if(this.loyaltyArray!=null){
           let _points:number = 0;
            for (let i = 0; i < this.loyaltyArray.length; i++) {
             _points = Number(_points + this.loyaltyArray[i].points);
             this.loyaltyPoints=_points;
             console.log(this.loyaltyPoints);
            } }
          })*/
        this.orderData.status = 'pending';
    };
    AddressListPage.prototype.addAddress = function () {
        this.navCtrl.push("AddressPage", { amountDetails: this.amountDetails,
            addressList: this.addressList,
            cartData: this.navParams.get('cartData')
        });
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
        this.orderData.shippingAddress = address;
        this.selectedAddress = address;
        /* this.pincode_matched = false;
         this.orderData.shippingAddress=address;
         delete this.orderData.shippingAddress['_id'];
         this.selectedAddress=address;
         for (let i = 0; i <this.pincodes.length; i++) {
           if(this.pincodes[i].pincode==address.pincode){
             this.pincode_matched=true;
           }
         }*/
    };
    AddressListPage.prototype.checkOut = function () {
        console.log(this.navParams.get('cartData'));
        if (this.orderData.shippingAddress != null) {
            /*this.navCtrl.push("CheckoutPage", {
              orderData: this.orderData,
              cartData: this.navParams.get('cartData')
            });*/
            this.navCtrl.push("CarrierPage", {
                orderData: this.orderData,
                cartData: this.navParams.get('cartData')
            });
        }
        else {
            this.showAlert('Please select address.');
        }
        /*if(this.pincode_matched){
          this.orderData.appliedLoyalty=this.checked;
          if(this.orderData.appliedLoyalty==true){
            this.orderData.usedLoyaltyPoints=this.loyaltyPoints;
          }
          if(this.orderData.shippingAddress!=null){
            this.navCtrl.push("CheckoutPage",{
              orderData:this.orderData
            });
          }
          else {
            this.showAlert('Please select address.');
          }
        } else {
          this.showAlert('Not available for delivery at your location yet.');
        }*/
    };
    AddressListPage.prototype.deleteAddress = function (addressId) {
        var _this = this;
        this.addressListService.deleteAddress(addressId).subscribe(function (data) {
            console.log(data);
            for (var i = 0; i < _this.addressList.length; i++) {
                if (_this.addressList[i].address.id === addressId) {
                    _this.addressList.splice(i, 1);
                }
            }
        });
    };
    AddressListPage.prototype.modifyAddress = function (address) {
        console.log("modify address " + address.id);
        this.navCtrl.push("AddressPage", {
            amountDetails: this.amountDetails,
            cartData: this.navParams.get('cartData'),
            addressList: this.addressList,
            address: address
        });
    };
    AddressListPage.prototype.showAlert = function (message) {
        var alert = this.alertCtrl.create({
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    };
    AddressListPage.prototype.objectToArray = function (object) {
        var item = Object.keys(object);
        var array = [];
        for (var _i = 0, item_1 = item; _i < item_1.length; _i++) {
            var i = item_1[_i];
            array.push(object[i]);
        }
        return array;
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
            AddressListService,
            Storage])
    ], AddressListPage);
    return AddressListPage;
}());
export { AddressListPage };
//# sourceMappingURL=address-list.js.map