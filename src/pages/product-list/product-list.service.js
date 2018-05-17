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
var ProductListService = /** @class */ (function () {
    function ProductListService(http, constService) {
        this.http = http;
        this.constService = constService;
    }
    /*ProductListService.prototype.getMenuItems = function (categoryId) {
        var headers = new Headers();
        return this.http.get(this.constService.base_url + 'api/menuItems/by/category/' + categoryId, {
            headers: headers
        })
            .map(function (data) { return data.json() || {}; });
        //.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    };*/
    ProductListService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http, ConstService])
    ], ProductListService);
    return ProductListService;
}());
export { ProductListService };
//# sourceMappingURL=product-list.service.js.map