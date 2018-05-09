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
import { NavController, NavParams, AlertController, LoadingController, ToastController, IonicPage } from 'ionic-angular';
import { Service } from '../../app/service';
import { Storage } from '@ionic/storage';
import { ProductDetailsService } from './product-details.service';
var ProductDetailsPage = /** @class */ (function () {
    function ProductDetailsPage(navCtrl, loadingCtrl, alertCtrl, toastCtrl, navParams, storage, service, productDetailsService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.service = service;
        this.productDetailsService = productDetailsService;
        this.count = 1;
        this.ExtraOptions = [];
        this.itemInCart = [];
        this.Cart = [];
        this.prices = [{ value: '' }];
        this.product = {
            name: '',
            sizeOption: {},
            extraOption: []
        };
        this.productDetails = {};
        this.like = false;
        //Add favourite
        this.visible = true;
        this.favourites = [];
        this.favourite = [];
        this.favouriteItems = [];
        this.productId = navParams.get('productId');
        this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
        if (this.cartItems != null) {
            this.noOfItems = this.cartItems.length;
        }
        this.storage.get('favourite').then(function (favourite) {
            _this.favourites = favourite;
        });
        this.storage.get('favourite').then(function (favourites) {
            _this.favouriteItems = favourites;
        });
    }
    ProductDetailsPage.prototype.ngOnInit = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: 'please wait'
        });
        loader.present();
        this.productDetailsService.getMenuItemDetails(this.productId)
            .subscribe(function (product) {
            console.log("product-" + JSON.stringify(product));
            loader.dismiss();
            var details = product;
            _this.productDetails = product;
            _this.product.productId = details._id;
            _this.product.name = details.title;
            _this.product.imageUrl = details.thumb;
            _this.product.ratingFlag = 0;
            _this.product.rating = 0;
        }, function (error) {
            loader.dismiss();
        });
        if (localStorage.getItem('token')) {
            this.checkfavourite();
        }
    };
    ProductDetailsPage.prototype.checkfavourite = function () {
        var _this = this;
        this.productDetailsService.checkFavourite(this.productId)
            .subscribe(function (res) {
            _this.like = res.resflag;
        });
    };
    ProductDetailsPage.prototype.addToCart = function (productId) {
        if (this.product.sizeOption.value == null) {
            var alert_1 = this.alertCtrl.create({
                title: 'Please!',
                subTitle: 'Select Size and Price!',
                buttons: ['OK']
            });
            alert_1.present();
        }
        else {
            this.Cart = JSON.parse(localStorage.getItem("cartItem"));
            if (this.Cart == null) {
                this.product.Quantity = this.count;
                if (this.product.sizeOption.specialPrice) {
                    this.product.itemTotalPrice = this.product.Quantity * this.product.sizeOption.specialPrice;
                }
                else {
                    this.product.itemTotalPrice = this.product.Quantity * this.product.sizeOption.value;
                }
                var proExtraPrice = 0;
                for (var i = 0; i <= this.product.extraOption.length - 1; i++) {
                    proExtraPrice = proExtraPrice + Number(this.product.extraOption[i].selected);
                    this.product.extraPrice = proExtraPrice;
                }
                this.itemInCart.push(this.product);
                localStorage.setItem('cartItem', JSON.stringify(this.itemInCart));
            }
            else {
                for (var i = 0; i <= this.Cart.length - 1; i++) {
                    if (this.Cart[i].productId == productId && this.Cart[i].sizeOption.pname == this.product.sizeOption.pname) {
                        this.Cart.splice(i, 1);
                    }
                }
                this.product.Quantity = this.count;
                if (this.product.sizeOption.specialPrice) {
                    this.product.itemTotalPrice = this.product.Quantity * this.product.sizeOption.specialPrice;
                }
                else {
                    this.product.itemTotalPrice = this.product.Quantity * this.product.sizeOption.value;
                }
                var proExtraPrice = 0;
                for (var i = 0; i <= this.product.extraOption.length - 1; ++i) {
                    proExtraPrice = proExtraPrice + Number(this.product.extraOption[i].selected);
                    this.product.extraPrice = proExtraPrice;
                }
                this.Cart.push(this.product);
                localStorage.setItem('cartItem', JSON.stringify(this.Cart));
            }
            this.navCtrl.push("CartPage");
        }
    };
    ProductDetailsPage.prototype.checkOptions = function (option) {
        if (this.product.extraOption.length !== 0) {
            for (var i = 0; i <= this.product.extraOption.length - 1; i++) {
                if (this.product.extraOption[i].name == option.name) {
                    this.product.extraOption.splice(i, 1);
                    break;
                }
                else {
                    this.product.extraOption.push(option);
                    break;
                }
            }
        }
        else {
            this.product.extraOption.push(option);
        }
    };
    ProductDetailsPage.prototype.sizeOptions = function (price) {
        this.product.sizeOption = price;
    };
    ProductDetailsPage.prototype.add = function () {
        if (this.count < 10) {
            this.count = this.count + 1;
        }
    };
    ProductDetailsPage.prototype.remove = function () {
        if (this.count > 1) {
            this.count = this.count - 1;
        }
    };
    ProductDetailsPage.prototype.home = function () {
        this.navCtrl.push("HomePage");
    };
    ProductDetailsPage.prototype.navcart = function () {
        this.navCtrl.push("CartPage");
    };
    ProductDetailsPage.prototype.toggleFavourite = function () {
        this.visible = !this.visible;
    };
    ProductDetailsPage.prototype.addToFavourite = function (productId) {
        var _this = this;
        if (localStorage.getItem('token')) {
            this.productDetailsService.addToFavourite(this.productId)
                .subscribe(function (res) {
                console.log("liked!!!");
                _this.like = true;
                _this.createToaster('added to favourites!', 3000);
            });
        }
        else {
            this.createToaster('please login first!', 3000);
        }
    };
    ProductDetailsPage.prototype.removeFromFavourite = function (productId) {
        var _this = this;
        if (localStorage.getItem('token')) {
            this.productDetailsService.removeToFavourite(this.productId)
                .subscribe(function (res) {
                console.log("unliked!!!");
                _this.like = false;
                _this.createToaster('removed from favourites!', 3000);
            });
        }
    };
    ProductDetailsPage.prototype.createToaster = function (message, duration) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
    };
    ProductDetailsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-product-details',
            templateUrl: 'product-details.html',
            providers: [Service, ProductDetailsService]
        }),
        __metadata("design:paramtypes", [NavController,
            LoadingController,
            AlertController,
            ToastController,
            NavParams,
            Storage,
            Service,
            ProductDetailsService])
    ], ProductDetailsPage);
    return ProductDetailsPage;
}());
export { ProductDetailsPage };
//# sourceMappingURL=product-details.js.map