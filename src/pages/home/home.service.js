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
var HomeService = /** @class */ (function () {
    function HomeService(http, constService) {
        this.http = http;
        this.constService = constService;
    }
    HomeService.prototype.getCategories = function () {
        var headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.categoriesListing + "/0" + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    HomeService.prototype.getImageUrlForCategory = function (categoryId) {
        return this.constService.baseDir + this.constService.imageDir + this.constService.categoryDir + "/" + categoryId + this.constService.keyDir;
    };
    HomeService.prototype.getSlideCategorie = function () {
        var headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.categoriesListing + "/14" + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    HomeService.prototype.getAccueilProduct = function () {
        var headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.categoriesListing + "/15" + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    HomeService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http, ConstService])
    ], HomeService);
    return HomeService;
}());
export { HomeService };
//# sourceMappingURL=home.service.js.map