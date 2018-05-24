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
import { NavController, NavParams, IonicPage, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService } from '../../providers/user-service';
import { FavouriteService } from './favourite.service';
var FavouritePage = /** @class */ (function () {
    function FavouritePage(navCtrl, navParams, loadingCtrl, toastCtrl, storage, userService, favouriteService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.storage = storage;
        this.userService = userService;
        this.favouriteService = favouriteService;
        this.favouriteItems = [];
        this.cartItems = [];
        this.favouriteList = [];
        this.bg = 'assets/img/bg.jpg';
        /*this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
        if (this.cartItems != null) {
            this.noOfItems = this.cartItems.length;
        }*/
    }
    FavouritePage.prototype.ngOnInit = function () {
        var _this = this;
        //this.favouriteList = JSON.parse(localStorage.getItem('favourite'));
        this.storage.get('user').then(function (userData) {
            if (userData && userData.token) {
                _this.favouriteService.getFavourite(userData.id_customer).subscribe(function (data) {
                    console.log(data);
                    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                        var product = data_1[_i];
                        _this.favouriteService.getProduct(product.id_product).subscribe(function (product) {
                            _this.favouriteItems.push(product);
                        });
                    }
                });
            }
        });
        /*this.storage.get('favourite').then((favourite) => {
            this.favouriteList = favourite;
            if(this.favouriteList && this.favouriteList.length){
                for(var favourite of this.favouriteList){
                    this.favouriteService.getProduct(favourite).subscribe(data => {
                        this.favouriteItems.push(data);
                    })
                }
            }
        })*/
    };
    FavouritePage.prototype.navcart = function () {
        this.navCtrl.push("CartPage");
    };
    FavouritePage.prototype.buyNow = function (productId) {
        this.navCtrl.push("ProductDetailsPage", {
            productId: productId
        });
    };
    FavouritePage.prototype.removeFromFavourites = function (productId) {
        var _this = this;
        this.storage.get('user').then(function (userData) {
            if (userData && userData.token) {
                _this.favouriteService.removeFromFavourite(productId, 1, userData.id_customer).subscribe(function (data) {
                    console.log(data);
                    for (var i = 0; i < _this.favouriteItems.length; i++) {
                        if (_this.favouriteItems[i].id == productId) {
                            _this.favouriteItems.splice(i, 1);
                        }
                    }
                });
            }
        });
        /*console.log("remove : "+productId);
        for(var i=0; i<this.favouriteItems.length;i++){
            if(this.favouriteItems[i].id == productId){
                this.favouriteItems.splice(i,1);
            }

            if(this.favouriteList[i] == productId){
                this.favouriteList.splice(i,1);
                //localStorage.setItem('favourite',JSON.stringify(this.favouriteList));
                this.storage.set('favourite', this.favouriteList);
            }
        }*/
    };
    FavouritePage.prototype.isFavourite = function () {
        return this.favouriteItems.length == 0 ? false : true;
    };
    FavouritePage.prototype.isLoggedin = function () {
        return JSON.parse(localStorage.getItem('userLoggedIn')) ? true : false;
    };
    FavouritePage.prototype.createToaster = function (message, duration) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
    };
    FavouritePage.prototype.home = function () {
        this.navCtrl.push("HomePage");
    };
    FavouritePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-favourite',
            templateUrl: 'favourite.html',
            providers: [FavouriteService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LoadingController,
            ToastController,
            Storage,
            UserService,
            FavouriteService])
    ], FavouritePage);
    return FavouritePage;
}());
export { FavouritePage };
//# sourceMappingURL=favourite.js.map