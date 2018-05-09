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
import { CategoryService } from './category.service';
var CategoryPage = /** @class */ (function () {
    function CategoryPage(navCtrl, loadingCtrl, categoryService) {
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.categoryService = categoryService;
        this.categories = [];
    }
    CategoryPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: 'please wait'
        });
        loader.present();
        this.categoryService.getCategories()
            .subscribe(function (categories) {
            console.log("res-" + JSON.stringify(categories));
            _this.categories = categories;
            loader.dismiss();
        }, function (error) {
            loader.dismiss();
        });
    };
    CategoryPage.prototype.navigate = function (MenuId) {
        this.navCtrl.push("ProductListPage", { MenuId: MenuId });
    };
    CategoryPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-category',
            templateUrl: 'category.html',
            providers: [CategoryService]
        }),
        __metadata("design:paramtypes", [NavController,
            LoadingController,
            CategoryService])
    ], CategoryPage);
    return CategoryPage;
}());
export { CategoryPage };
//# sourceMappingURL=category.js.map