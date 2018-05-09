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
var ProductDetailsService = /** @class */ (function () {
    function ProductDetailsService(http, constService) {
        this.http = http;
        this.constService = constService;
    }
    ProductDetailsService.prototype.getMenuItemDetails = function (menuItemId) {
        var headers = new Headers();
        return this.http.get(this.constService.base_url + 'api/menuItems/' + menuItemId, {
            headers: headers
        })
            .map(function (data) { return data.json() || {}; });
        //.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    };

    ProductDetailsService.prototype.getDeclinaisons = function (declinaisonId){
        var headers = new Headers;
        return this.http.get(this.constService.baseDir+this.constService.combinationDir+"/"+declinaisonId+this.constService.keyDir+this.constService.formatDir;,{
            headers: headers
        })
            .map(function (data) { return data.json() || {};});
    }

    ProductDetailsService.prototype.addToFavourite = function (productId) {
        var productInfo = {};
        productInfo.menuItem = productId;
        productInfo.userReaction = 'LIKE';
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.post(this.constService.base_url + 'api/favourites', productInfo, {
            headers: headers
        })
            .map(function (data) { return data.json() || {}; });
        // .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    };
    ProductDetailsService.prototype.removeToFavourite = function (productId) {
        var productInfo = {};
        productInfo.menuItem = productId;
        productInfo.userReaction = 'DISLIKE';
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.post(this.constService.base_url + 'api/favourites/delete/', productInfo, {
            headers: headers
        })
            .map(function (data) { return data.json() || {}; });
        // .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    };
    ProductDetailsService.prototype.checkFavourite = function (productId) {
        var productInfo = {};
        productInfo.menuItem = productId;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.post(this.constService.base_url + 'api/favourites/check', productInfo, {
            headers: headers
        })
            .map(function (data) { return data.json() || {}; });
        //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    };
    ProductDetailsService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http, ConstService])
    ], ProductDetailsService);
    return ProductDetailsService;
}());
export { ProductDetailsService };
//# sourceMappingURL=product-details.service.js.map