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
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CarrierService } from './carrier.service';
import { Storage } from '@ionic/storage';
var CarrierPage = /** @class */ (function () {
    function CarrierPage(navCtrl, navParams, carrierService, alertCtrl, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.carrierService = carrierService;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.carriers = [];
        this.carrier = {};
    }
    CarrierPage.prototype.ngOnInit = function () {
        var _this = this;
        console.log("ngOnInit() carrier appelé");
        //var customer = JSON.parse(localStorage.getItem('user'));
        this.storage.get('user').then(function (customer) {
            var cart = _this.navParams.get('cartData');
            console.log(cart);
            console.log(customer);
            _this.carrierService.getAllCarriers(customer.id_customer, cart.cart.id).subscribe(function (data) {
                console.log(data);
                for (var _i = 0, _a = _this.objectToArray(data[0]); _i < _a.length; _i++) {
                    var carrier = _a[_i];
                    console.log(carrier);
                    console.log(_this.objectToArray(_this.objectToArray(carrier.carrier_list)[0].instance.delay)[0]);
                    console.log(_this.objectToArray(carrier.carrier_list)[0].logo);
                    if (_this.objectToArray(carrier.carrier_list)[0].logo)
                        carrier.image = _this.carrierService.getCarrierImageUrl(_this.objectToArray(carrier.carrier_list)[0].logo);
                    else
                        carrier.image = false;
                    _this.carriers.push(carrier);
                }
                console.log(_this.carriers);
                /*for(var test of this.objectToArray(data[0])){
                  //console.log(test);
                  console.log(this.objectToArray(test.carrier_list)[0]);
                  this.carriers.push(this.objectToArray(test.carrier_list)[0]);
                }*/
            });
        });
        /*this.carrierService.getAllCarriers().subscribe(data => {
            console.log(data);
            for(var carrier of data.carriers){
                this.carrierService.getCarrierById(carrier.id).subscribe(response => {
                    console.log(response);
                    this.carriers.push(response);
                })
            }
        });*/
    };
    CarrierPage.prototype.selectCarrier = function (carrier) {
        console.log(carrier);
        this.carrier = carrier;
    };
    CarrierPage.prototype.goToPayment = function () {
        if (this.carrier && this.carrier.carrier_list) {
            /*this.navCtrl.push("CheckoutPage", {
              orderData: this.navParams.get('orderData'),
              cartData: this.navParams.get('cartData'),
              carrierData: this.carrier
            });*/
            this.navCtrl.push("RecapPage", {
                orderData: this.navParams.get('orderData'),
                cartData: this.navParams.get('cartData'),
                carrierData: this.carrier
            });
        }
        else {
            this.showAlert('Veuillez sélectionner un transporteur !');
        }
    };
    CarrierPage.prototype.showAlert = function (message) {
        var alert = this.alertCtrl.create({
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    };
    CarrierPage.prototype.objectToArray = function (object) {
        var item = Object.keys(object);
        var array = [];
        for (var _i = 0, item_1 = item; _i < item_1.length; _i++) {
            var i = item_1[_i];
            array.push(object[i]);
        }
        return array;
    };
    CarrierPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-carrier',
            templateUrl: 'carrier.html',
            providers: [CarrierService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            CarrierService,
            AlertController,
            Storage])
    ], CarrierPage);
    return CarrierPage;
}());
export { CarrierPage };
//# sourceMappingURL=carrier.js.map