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
import { NavController, NavParams, ToastController, LoadingController, IonicPage, Searchbar } from 'ionic-angular';
import { Service } from '../../app/service';
import { ProductListService } from './product-list.service';
import { Storage } from '@ionic/storage';
var ProductListPage = /** @class */ (function () {
    function ProductListPage(navCtrl, loadingCtrl, service, productListService, navParams, toastCtrl, storage) {
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.service = service;
        this.productListService = productListService;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.storage = storage;
        this.menuItems = [{
                price: []
            }];
        this.items = [];
        this.maxItem = 0;
        this.allProductsId = [];
        this.noOfItemToLoad = 0;
        this.lastSearch = [];
        this.displaySearchBar = false;
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
        this.productListService.getCategory(this.menuId).subscribe(function (data) {
            console.log(data);
            _this.allProductsId = data.category.associations.products;
            _this.maxItem = data.category.associations.products.length;
            var products = data.category.associations.products;
            _this.noOfItemToLoad = 0; // Nombre de produit max à charger
            //Inutile de séparer en plusieurs parties le chargement des produits s'il n'y en a pas beaucoup
            if (_this.maxItem <= 5) {
                _this.noOfItemToLoad = _this.maxItem;
            }
            else {
                _this.noOfItemToLoad = _this.maxItem / 2;
            }
            //Récupères tous les produits sans dépasser la limite max autorisée
            for (var i = 0; i < _this.noOfItemToLoad; i++) {
                _this.productListService.getProduct(products[i].id).subscribe(function (response) {
                    //console.log(response);
                    //On peut également retirer les id des produits à charger du tableau (évite les doublons)
                    _this.items.push(response);
                });
            }
        });
        loader.dismiss();
        this.searching = false;
        this.searchPlaceholder = "Que recherchez-vous?";
    };
    ProductListPage.prototype.initializeItems = function () {
        this.items = this.menuItems;
    };
    ProductListPage.prototype.getItems = function (ev) {
        this.initializeItems();
        var val = ev.target.value;
        if (val && val.trim() != '') {
            this.items = this.items.filter(function (data) {
                console.log(data);
                // return (data.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
    };
    ProductListPage.prototype.navigateBack = function () {
        this.navCtrl.pop();
    };
    ProductListPage.prototype.navigate = function (productId, item) {
        this.navCtrl.push("ProductDetailsPage", {
            productId: productId,
            product: item
        });
    };
    ProductListPage.prototype.navcart = function () {
        this.navCtrl.push("CartPage");
    };
    ProductListPage.prototype.infinite = function (event) {
        var _this = this;
        var oldItemLength = this.items.length;
        //S'il ne reste pas suffisamment d'item à charger, on charge les derniers restants sinon on en recharge le maximum autorisé
        var nbToLoad = this.maxItem - this.items.length < this.noOfItemToLoad ? this.maxItem : this.noOfItemToLoad + this.items.length;
        console.log(nbToLoad);
        for (var i = this.items.length; i < nbToLoad; i++) {
            this.productListService.getProduct(this.allProductsId[i].id).subscribe(function (data) {
                _this.items.push(data);
                //Si tous les items sont chargés, on désactive l'infinite scroll
                if (_this.items.length == _this.maxItem) {
                    event.enable(false);
                }
                //Termine le loading de l'infinite scroll lorsque le nombre d'item est atteint
                if (_this.items.length == oldItemLength + nbToLoad) {
                    event.complete();
                }
            });
        }
        /*var oldlength = this.items.length;
        console.log(oldlength);
        this.items.concat(this.items);
        for(var i=0; i<oldlength;i++){
            this.items.push(this.items[i]);
        }
        console.log(this.items.length);

        if(this.items.length>100)
            event.enable(false);

        if(this.items.length == oldlength*2){
            event.complete();
        }*/
    };
    ProductListPage.prototype.priceIsReduced = function (product) {
        return product.prices.specific_price < product.prices.normal_price ? true : false;
    };
    /**Searchbar**/
    ProductListPage.prototype.onSearch = function ($event) {
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
    ProductListPage.prototype.offSearch = function ($event) {
    };
    ProductListPage.prototype.onFocus = function ($event) {
        var _this = this;
        console.log("onFocus appelé");
        this.storage.get('search').then(function (data) {
            _this.lastSearch = data;
        });
    };
    ProductListPage.prototype.completeUserInput = function (keyword) {
        console.log("completeUserInput");
        this.searchInput = keyword;
        this.onSearch(null);
    };
    ProductListPage.prototype.saveSearchInput = function (keyword) {
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
    ProductListPage.prototype.goToProductPage = function (productId, productName) {
        if (productName === void 0) { productName = null; }
        console.log(productId);
        this.saveSearchInput(productName);
        this.navCtrl.push("ProductDetailsPage", {
            productId: productId
        });
    };
    ProductListPage.prototype.showSearchBar = function () {
        this.displaySearchBar = !this.displaySearchBar;
    };
    __decorate([
        ViewChild(Searchbar),
        __metadata("design:type", Searchbar)
    ], ProductListPage.prototype, "searchbar", void 0);
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
            ToastController,
            Storage])
    ], ProductListPage);
    return ProductListPage;
}());
export { ProductListPage };
//# sourceMappingURL=product-list.js.map