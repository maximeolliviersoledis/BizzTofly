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
import { NavController, NavParams, IonicPage, LoadingController } from 'ionic-angular';
import { CategoryService } from './category.service';
var CategoryPage = /** @class */ (function () {
    function CategoryPage(navCtrl, loadingCtrl, categoryService, nav) {
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.categoryService = categoryService;
        this.nav = nav;
        this.categories = [];
        this.level = 2;
        this.lastCategoryId = 0;
    }
    CategoryPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: 'please wait'
        });
        loader.present();
        this.categoryService.getCategory(2).subscribe(function (categories) {
            _this.lastCategoryId = categories.category.id;
            console.log(_this.lastCategoryId);
            var subCategories = categories.category.associations;
            if (subCategories && subCategories.categories) {
                for (var _i = 0, _a = subCategories.categories; _i < _a.length; _i++) {
                    var sub = _a[_i];
                    _this.categoryService.getCategory(sub.id).subscribe(function (category) {
                        if (category.category.level_depth >= 2 && category.category.active == 1) {
                            var categ = {};
                            categ.id = category.category.id;
                            categ.id_parent = category.category.id_parent;
                            categ.name = category.category.name[0].value;
                            categ.description = category.category.description[0].value;
                            categ.level = category.category.level_depth;
                            categ.image = _this.categoryService.getUrlForImage(categ.id);
                            if (category.category.associations && category.category.associations.categories)
                                categ.id_enfants = category.category.associations.categories;
                            _this.categories.push(categ);
                        }
                    });
                }
            }
            loader.dismiss();
        });
        /*this.categoryService.getAllCategories().subscribe(categories => {

            for(var id of categories.categories){
                this.categoryService.getCategory(id.id).subscribe(category => {
                    if(category.category.level_depth>=2 && category.category.active == 1){
                        var categ: any = {};
                        categ.id = category.category.id;
                        categ.id_parent = category.category.id_parent;
                        categ.name = category.category.name[0].value;
                        categ.description = category.category.description[0].value;
                        categ.level = category.category.level_depth;
                        if(category.category.associations && category.category.associations.categories)
                            categ.id_enfants = category.category.associations.categories;

                        this.categories.push(categ);
                    }
                    console.log(this.categories);
                });
            }
            loader.dismiss();
        })*/
        /*this.categoryService.getCategories()
        .subscribe(categories=>{
            console.log("res-"+JSON.stringify(categories));
            this.categories=categories;
            loader.dismiss();
        },error=>{
            loader.dismiss();
        })*/
    };
    CategoryPage.prototype.getSubCategories = function (categoryId) {
        var _this = this;
        var index = this.categories.findIndex(function (elem) {
            return elem.id == categoryId;
        });
        console.log(this.categories[index].id_enfants.length);
        for (var _i = 0, _a = this.categories[index].id_enfants; _i < _a.length; _i++) {
            var child = _a[_i];
            var childAlreadyPresent = this.categories.find(function (elem) {
                return elem.id == child.id;
            });
            if (!childAlreadyPresent) {
                this.categoryService.getCategory(child.id).subscribe(function (category) {
                    console.log(category);
                    var categ = {};
                    categ.id = category.category.id;
                    categ.image = _this.categoryService.getUrlForImage(categ.id);
                    categ.id_parent = category.category.id_parent;
                    categ.name = category.category.name[0].value;
                    categ.description = category.category.description[0].value;
                    categ.level = category.category.level_depth;
                    if (category.category.associations && category.category.associations.categories)
                        categ.id_enfants = category.category.associations.categories;
                    _this.categories.push(categ);
                });
            }
        }
    };
    CategoryPage.prototype.goBack = function () {
        console.log(this.categories);
        if (this.level > 2) {
            console.log("lastCategory avant  = " + this.lastCategoryId);
            var id = this.lastCategoryId;
            var index = this.categories.findIndex(function (elem) {
                return elem.id == id;
            });
            this.lastCategoryId = this.categories[index].id_parent;
            console.log("lastCategory = " + this.lastCategoryId);
            this.level--;
        }
    };
    CategoryPage.prototype.navigate = function (category) {
        if (category.id_enfants) {
            this.lastCategoryId = category.id;
            this.getSubCategories(category.id);
            this.level++;
        }
        else {
            this.navCtrl.push("ProductListPage", {
                MenuId: category.id,
            });
        }
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
            CategoryService,
            NavParams])
    ], CategoryPage);
    return CategoryPage;
}());
export { CategoryPage };
//# sourceMappingURL=category.js.map