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
    /*getMenuItemDetails(menuItemId) {
        const headers = new Headers();
        return this.http.get(this.constService.base_url + 'api/menuItems/' + menuItemId, {
            headers: headers
        })

            .map((data: Response) => data.json() || {})
        //.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }*/
    ProductDetailsService.prototype.getMenuItemDetails = function (menuItemId) {
        var headers = new Headers();
        // var urlDir = this.constService.baseDirApiSoledis + this.constService.productDetail + "/" + menuItemId + this.constService.keyDir + this.constService.formatDir + this.constService.filterUser + user_id;;
        var urlDir = this.constService.baseDirApiSoledis + this.constService.productDetail + "/" + menuItemId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        })
            .map(function (data) { return data.json() || {}; });
        //.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    };
    ProductDetailsService.prototype.getDeclinaisons = function (declinaisonId) {
        var headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.combinationDir + "/" + declinaisonId + this.constService.keyDir + this.constService.formatDir;
        //var urlDir = "http://www.bizztofly.com/api/combinations/"+declinaisonId+"?ws_key=P67RDX29JM5ITD4JA5A56GZJSIXGXBKL&output_format=JSON";
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    /* addToFavourite(productId, productAttributeId, quantity, token){
         const headers = new Headers();
         var urlDir = "http://www.bizztofly.com/modules/blockwishlist/cart.php?action=add&id_product="+productId+"&quantity="+quantity+"&token="+token+"&id_product_attribute="+productAttributeId+"&id_wishlist=undefined&_=1526561392412"
         return this.http.get(urlDir, {
             headers: headers
         }).map((data: Response) => data.json() || {})
     }*/
    ProductDetailsService.prototype.addToFavourite = function (productId, attributeProductId, customerId, quantity) {
        var headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.favouriteDir + "/0" + this.constService.keyDir + this.constService.formatDir
            + this.constService.idProduct + productId + this.constService.idProductAttribute + attributeProductId + this.constService.idCustomer + customerId +
            this.constService.quantity + quantity + this.constService.action + "add";
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    ProductDetailsService.prototype.removeFromFavourite = function (productId, productAttributeId, customerId) {
        var headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.favouriteDir + "/0" + this.constService.keyDir + this.constService.formatDir +
            this.constService.idProduct + productId + this.constService.idProductAttribute + productAttributeId + this.constService.idCustomer + customerId +
            this.constService.action + "remove";
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    ProductDetailsService.prototype.getFavouriteList = function (customerId) {
        var headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.favouriteDir + "/0" + this.constService.keyDir + this.constService.formatDir +
            this.constService.idCustomer + customerId;
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    ProductDetailsService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http, ConstService])
    ], ProductDetailsService);
    return ProductDetailsService;
}());
export { ProductDetailsService };
//# sourceMappingURL=product-details.service.js.map