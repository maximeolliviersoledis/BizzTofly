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
import { Http } from "@angular/http";
import { ConstService } from "../providers/const-service";
var Service = /** @class */ (function () {
    function Service(http, constService) {
        this.http = http;
        this.constService = constService;
    }
    Service.prototype.getData = function () {
        return this.http.get('assets/json/restaurantAppJson.json')
            .map(function (response) { return response.json(); });
    };
    Service.prototype.search = function (searchQuery) {
        var urlDir = this.constService.baseDir + this.constService.search + this.constService.keyDir + "&" + searchQuery + this.constService.formatDir;
        return this.http.get(urlDir)
            .map(function (data) { return data.json() || {}; });
    };
    Service = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http, ConstService])
    ], Service);
    return Service;
}());
export { Service };
//# sourceMappingURL=service.js.map