var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { ConstService } from "../../providers/const-service";
var CategoryService = /** @class */ (function () {
    function CategoryService(http, constService) {
        this.http = http;
        this.constService = constService;
    }
    /*getCategories() {
        const headers = new Headers();
        return this.http.get(this.constService.base_url + 'api/categories', {
            headers: headers
        })

            .map((data: Response) => data.json())
    }*/
    CategoryService.prototype.getCategories = function () {
        var headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.categoriesListing + "/0" + this.constService.keyDir + this.constService.formatDir;
        //alert(this.constService.categoryDir);
        // var urlDir = "http://www.bizztofly.com/api-soledis/categories_listing/0?&filter[user]=0";
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json(); });
    };
    CategoryService.prototype.getAllCategories = function () {
        var headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.categoryDir + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    CategoryService.prototype.getCategory = function (id) {
        var headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.categoryDir + "/" + id + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    CategoryService.prototype.getImageForCategory = function (categoryId) {
        //http://www.bizztofly.com/api/images/categories/3?ws_key=P67RDX29JM5ITD4JA5A56GZJSIXGXBKL
        var headers = new Headers();
        var urlDir = this.constService.baseDir + "/images" + this.constService.categoryDir + "/" + categoryId + this.constService.keyDir;
        return this.http.get(urlDir, {
            headers: headers
        });
    };
    CategoryService.prototype.getUrlForImage = function (categoryId) {
        return this.constService.baseDir + "/images" + this.constService.categoryDir + "/" + categoryId + this.constService.keyDir;
    };
    CategoryService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http, ConstService])
    ], CategoryService);
    return CategoryService;
}());
export { CategoryService };
//# sourceMappingURL=category.service.js.map