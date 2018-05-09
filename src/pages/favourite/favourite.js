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
        this.bg = 'assets/img/bg.jpg';
        this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
        if (this.cartItems != null) {
            this.noOfItems = this.cartItems.length;
        }
    }
    FavouritePage.prototype.ngOnInit = function () {
        this.getWishlist();
    };
    FavouritePage.prototype.navcart = function () {
        this.navCtrl.push("CartPage");
    };
    FavouritePage.prototype.buyNow = function (productId) {
        this.navCtrl.push("ProductDetailsPage", {
            productId: productId
        });
    };
    FavouritePage.prototype.isFavourite = function () {
        return this.favouriteItems.length == 0 ? false : true;
    };
    FavouritePage.prototype.removeFromFavourites = function (productId) {
        var _this = this;
        this.favouriteService.removeFromFavourite(productId)
            .subscribe(function (response) {
            console.log("res--" + JSON.stringify(response));
            _this.getWishlist();
        });
    };
    FavouritePage.prototype.getWishlist = function () {
        var _this = this;
        if (this.isLoggedin()) {
            var loader_1 = this.loadingCtrl.create({
                content: 'please wait...'
            });
            loader_1.present();
            this.userService.getUser()
                .subscribe(function (user) {
                _this.favouriteService.getFavourites(user._id)
                    .subscribe(function (response) {
                    _this.favouriteItems = response;
                    console.log("fav-list-" + JSON.stringify(response));
                    loader_1.dismiss();
                }, function (error) {
                    loader_1.dismiss();
                });
            });
        }
    };
    FavouritePage.prototype.isLoggedin = function () {
        return localStorage.getItem('token') ? true : false;
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