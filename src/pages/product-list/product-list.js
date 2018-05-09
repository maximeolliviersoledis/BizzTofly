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
import { NavController, NavParams, ToastController, LoadingController, IonicPage } from 'ionic-angular';
import { Service } from '../../app/service';
import { ProductListService } from './product-list.service';
var ProductListPage = /** @class */ (function () {
    function ProductListPage(navCtrl, loadingCtrl, service, productListService, navParams, toastCtrl) {
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.service = service;
        this.productListService = productListService;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.menuItems = [{
                price: []
            }];
        this.items = [];
        this.menuId = navParams.get('MenuId');
        console.log(this.menuId);
        this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
        if (this.cartItems != null) {
            this.noOfItems = this.cartItems.length;
        }
    }
    ProductListPage.prototype.ngOnInit = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: 'please wait'
        });
        loader.present();
        this.productListService.getMenuItems(this.menuId)
            .subscribe(function (response) {
            console.log(JSON.stringify(response));
            loader.dismiss();
            _this.menuItems = response;
            _this.items = _this.menuItems;
        }, function (error) {
            loader.dismiss();
        });
    };
    ProductListPage.prototype.initializeItems = function () {
        this.items = this.menuItems;
    };
    ProductListPage.prototype.getItems = function (ev) {
        this.initializeItems();
        var val = ev.target.value;
        if (val && val.trim() != '') {
            this.items = this.items.filter(function (data) {
                return (data.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
    };
    ProductListPage.prototype.navigate = function (productId) {
        this.navCtrl.push("ProductDetailsPage", {
            productId: productId
        });
    };
    ProductListPage.prototype.navcart = function () {
        this.navCtrl.push("CartPage");
    };
    ProductListPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-product-list',
            templateUrl: 'product-list.html',
            providers: [Service, ProductListService]
        }),
        __metadata("design:paramtypes", [NavController,
            LoadingController,
            Service,
            ProductListService,
            NavParams,
            ToastController])
    ], ProductListPage);
    return ProductListPage;
}());
export { ProductListPage };
//# sourceMappingURL=product-list.js.map