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
        /*address={
          userName:'',
          homeNumber:'',
          apartmentName:'',
          mobileNo:'',
          landmark:'',
          city:'',
          state:'',
          pincode:''
        };*/
        /* Possibilité d'ajouter un numéro de téléphone */
        this.address = {
            address: {
                firstname: '',
                lastname: '',
                address1: '',
                address2: '',
                postcode: '',
                id_country: 8,
                id_customer: 0,
                city: '',
                alias: ''
                //phone: ''
                //phone_mobile: ''
            }
        };
        //this.orderData=this.navParams.get('orderData');
    }
    AddressPage.prototype.ngOnInit = function () {
        this.selectedAddress = this.navParams.get('address');
        console.log(this.selectedAddress);
        if (this.selectedAddress) {
            this.address.address.id = this.selectedAddress.id;
            this.address.address.firstname = this.selectedAddress.firstname;
            this.address.address.lastname = this.selectedAddress.lastname;
            this.address.address.address1 = this.selectedAddress.address1;
            this.address.address.address2 = this.selectedAddress.address2;
            this.address.address.postcode = this.selectedAddress.postcode;
            this.address.address.id_country = this.selectedAddress.id_country;
            this.address.address.id_customer = this.selectedAddress.id_customer;
            this.address.address.city = this.selectedAddress.city;
            this.address.address.alias = this.selectedAddress.alias;
        }
    };
    AddressPage.prototype.onSubmitAddress = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: 'please wait'
        });
        loader.present();
        var addressList = this.navParams.get('addressList');
        if (this.navParams.get('address')) {
            this.addressService.putAddress(this.address.address.id, this.address).subscribe(function (data) {
                for (var i = 0; i < addressList.length; i++) {
                    if (addressList[i].address.id === _this.address.address.id) {
                        addressList[i] = data;
                        console.log(addressList[i]);
                        break;
                    }
                }
                console.log(addressList);
                loader.dismiss();
                _this.navCtrl.push('AddressListPage', {
                    amountDetails: _this.navParams.get('amountDetails'),
                    cartData: _this.navParams.get('cartData'),
                    addressList: addressList
                });
            });
        }
        else {
            var user = JSON.parse(localStorage.getItem('user'));
            this.address.address.id_customer = user.id_customer;
            console.log(this.address);
            this.addressService.addAddress(this.address).subscribe(function (data) {
                addressList.push(data);
                loader.dismiss();
                _this.navCtrl.push('AddressListPage', {
                    amountDetails: _this.navParams.get('amountDetails'),
                    cartData: _this.navParams.get('cartData'),
                    addressList: addressList
                });
            });
        }
        /*let loader =this.loadingCtrl.create({
          content:'please wait'
        })
        loader.present();
        if(this.navParams.get('selectedAddress')){
          this.addressService.updateAddress(this.selectedAddress._id,this.address)
          .subscribe(response=>{
            loader.dismiss();
            this.navCtrl.push("CheckoutConfirmPage",
              { selectedAddress:response,
                orderData:this.orderData
              });
          },(error)=>{
            loader.dismiss();
          })
        } else {
          this.addressService.addAddress(this.address)
          .subscribe(response=>{
            loader.dismiss();
            this.navCtrl.push("AddressListPage",{
              amountDetails:this.navParams.get('amountDetails')
            });

          },(error)=>{
            loader.dismiss();
          })
        }*/
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