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
import { NavController, IonicPage, LoadingController } from 'ionic-angular';
import { Service } from '../../app/service';
import { HomeService } from './home.service';
var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, service, homeService, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.service = service;
        this.homeService = homeService;
        this.loadingCtrl = loadingCtrl;
        this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
        if (this.cartItems != null) {
            this.noOfItems = this.cartItems.length;
        }
        this.service.getData()
            .subscribe(function (response) {
            _this.featured = response.featured;
        });
    }
    HomePage.prototype.ionViewDidLoad = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: 'please wait..'
        });
        loader.present();
        this.homeService.getCategories()
            .subscribe(function (response) {
            _this.categories = response;
            console.log(_this.categories);
            loader.dismiss();
        }, function (error) {
            loader.dismiss();
        });
        this.homeService.getUpcomings()
            .subscribe(function (upcomings) {
        });
    };
    /*navigate(MenuId) {
        console.log(MenuId);
        this.navCtrl.push("ProductListPage",
            {MenuId: MenuId}
        );
    }*/
    HomePage.prototype.navigate = function (id_category) {
        console.log(id_category);
        this.navCtrl.push("ProductListPage", { id_category: id_category });
    };
    HomePage.prototype.navcart = function () {
        this.navCtrl.push("CartPage");
    };
    HomePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-home',
            templateUrl: 'home.html',
            providers: [Service, HomeService]
        }),
        __metadata("design:paramtypes", [NavController,
            Service,
            HomeService,
            LoadingController])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.js.map