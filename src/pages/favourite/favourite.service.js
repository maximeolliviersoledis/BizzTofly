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
var FavouriteService = /** @class */ (function () {
    function FavouriteService(http, constService) {
        this.http = http;
        this.constService = constService;
    }
    FavouriteService.prototype.getProduct = function (productId) {
        var headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.productDetail + "/" + productId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    FavouriteService.prototype.getFavourite = function (customerId) {
        var headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.favouriteDir + "/0" + this.constService.keyDir + this.constService.formatDir +
            this.constService.idCustomer + customerId;
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    FavouriteService.prototype.removeFromFavourite = function (productId, productAttributeId, customerId) {
        var headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.favouriteDir + "/0" + this.constService.keyDir + this.constService.formatDir +
            this.constService.idProduct + productId + this.constService.idProductAttribute + productAttributeId + this.constService.idCustomer + customerId +
            this.constService.action + "remove";
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    FavouriteService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http,
            ConstService])
    ], FavouriteService);
    return FavouriteService;
}());
export { FavouriteService };
//# sourceMappingURL=favourite.service.js.map