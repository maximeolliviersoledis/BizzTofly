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
var CartService = /** @class */ (function () {
    function CartService(http, constService) {
        this.http = http;
        this.constService = constService;
    }
    //équivalent dans prestashopo ?????
    CartService.prototype.getCoupons = function () {
        var headers = new Headers();
        return this.http.get(this.constService.base_url + 'api/coupons', {
            headers: headers
        })
            .map(function (data) { return data.json() || {}; });
        //.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    };
    CartService.prototype.getSpecificPrices = function (specificPriceId) {
        var headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.specificPriceDir + "/" + specificPriceId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    CartService.prototype.getSpecificPriceRules = function (specificPriceRuleId) {
        var headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.specificPriceRulesDir + "/" + specificPriceRuleId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    CartService.prototype.postCart = function (body) {
        var headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.cartDir + this.constService.keyDir + this.constService.formatDir;
        return this.http.post(urlDir, body, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    CartService.prototype.putCart = function (cartId, body) {
        var headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.cartDir + "/" + cartId + this.constService.keyDir + this.constService.formatDir;
        return this.http.put(urlDir, body, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    CartService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http,
            ConstService])
    ], CartService);
    return CartService;
}());
export { CartService };
//# sourceMappingURL=cart.service.js.map