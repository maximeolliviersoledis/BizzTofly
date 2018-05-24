var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, LoadingController, Slides, Searchbar } from 'ionic-angular';
import { Service } from '../../app/service';
import { HomeService } from './home.service';
import { Storage } from '@ionic/storage';
var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, service, homeService, loadingCtrl, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.service = service;
        this.homeService = homeService;
        this.loadingCtrl = loadingCtrl;
        this.storage = storage;
        this.lastSearch = [];
        this.slideProducts = [];
        this.currentProduct = {};
        this.welcomeProducts = [];
        //this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
        this.storage.get('cart').then(function (cartData) {
            _this.cartItems = cartData;
            if (_this.cartItems != null) {
                _this.noOfItems = _this.cartItems.length;
            }
        });
        this.searching = false;
        this.searchPlaceholder = "Que recherchez-vous?";
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
            for (var _i = 0, _a = _this.categories; _i < _a.length; _i++) {
                var i = _a[_i];
                i.image = _this.homeService.getImageUrlForCategory(i.id_category);
            }
            loader.dismiss();
        }, function (error) {
            loader.dismiss();
        });
        this.getSlideProducts();
        this.homeService.getAccueilProduct().subscribe(function (data) {
            console.log(data);
            _this.welcomeProducts = data;
        });
    };
    HomePage.prototype.navigate = function (MenuId) {
        console.log(MenuId);
        this.navCtrl.push("ProductListPage", { MenuId: MenuId });
    };
    HomePage.prototype.navcart = function () {
        this.navCtrl.push("CartPage");
    };
    HomePage.prototype.onSearch = function ($event) {
        var _this = this;
        this.searchPlaceholder = "Que recherchez-vous?";
        if (this.searchInput.length > 2) {
            this.searching = true;
            this.service.search('query=' + this.searchInput + '&language=1')
                .subscribe(function (response) {
                _this.searching = false;
                if (response.products) {
                    _this.searchResults = response.products;
                }
                else {
                    _this.searchInput = "";
                    _this.searchPlaceholder = "Aucun résultat";
                }
            });
        }
        else {
            this.searchResults = [];
        }
    };
    HomePage.prototype.offSearch = function ($event) {
    };
    HomePage.prototype.onFocus = function ($event) {
        var _this = this;
        console.log("onFocus appelé");
        this.storage.get('search').then(function (data) {
            _this.lastSearch = data;
        });
    };
    HomePage.prototype.completeUserInput = function (keyword) {
        console.log("completeUserInput = " + keyword);
        this.searchInput = keyword;
        this.onSearch(null);
    };
    HomePage.prototype.saveSearchInput = function (keyword) {
        var _this = this;
        this.storage.get('search').then(function (data) {
            _this.lastSearch = data;
        });
        if (this.lastSearch) {
            var keywordAlreadyPresent = this.lastSearch.find(function (elem) {
                return elem == keyword;
            });
            if (!keywordAlreadyPresent)
                this.lastSearch.splice(0, 0, keyword);
        }
        else {
            this.lastSearch = [];
            this.lastSearch.push(keyword);
        }
        this.storage.set('search', this.lastSearch);
    };
    HomePage.prototype.goToProductPage = function (productId, productName) {
        if (productName === void 0) { productName = null; }
        console.log(productId);
        this.saveSearchInput(productName);
        this.navCtrl.push("ProductDetailsPage", {
            productId: productId
        });
    };
    HomePage.prototype.getSlideProducts = function () {
        var _this = this;
        this.homeService.getSlideCategorie().subscribe(function (data) {
            _this.slideProducts = data;
            _this.currentProduct = _this.slideProducts[0];
        });
    };
    HomePage.prototype.goToProduct = function () {
        this.goToProductPage(this.currentProduct.id_product);
    };
    HomePage.prototype.onChange = function (next) {
        console.log(this.slides.realIndex);
        this.currentProduct = this.slideProducts[this.slides.realIndex];
        /*var id = this.currentProduct.id_product;
        var index = this.slideProducts.findIndex(function(elem){
            return elem.id_product === id;
        })
        if(next){
            /*if(++index > this.slideProducts.length-1){
                index--;
            }
            this.currentProduct = this.slideProducts[index];
        }
        else{
            /*if(--index < 0 )
                index++;
            this.currentProduct = this.slideProducts[index];
        }*/
    };
    __decorate([
        ViewChild(Slides),
        __metadata("design:type", Slides)
    ], HomePage.prototype, "slides", void 0);
    __decorate([
        ViewChild(Searchbar),
        __metadata("design:type", Searchbar)
    ], HomePage.prototype, "searchbar", void 0);
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
            LoadingController,
            Storage])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.js.map