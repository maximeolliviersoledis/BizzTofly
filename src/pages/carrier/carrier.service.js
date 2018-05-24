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
var CarrierService = /** @class */ (function () {
    function CarrierService(http, constService) {
        this.http = http;
        this.constService = constService;
    }
    /* getAllCarriers(){
         const headers = new Headers();
         var urlDir = this.constService.baseDir + this.constService.carrierDir + this.constService.keyDir + this.constService.formatDir + this.constService.filterDeleted + "0" + this.constService.filterNeedRange + "0";
         return this.http.get(urlDir, {
             headers: headers
         }).map((data: Response) => data.json() || {})
     }*/
    CarrierService.prototype.getAllCarriers = function (customerId, cartId) {
        var headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.carrierDetailsDir + "/0" + this.constService.keyDir + this.constService.formatDir + this.constService.idCustomer + customerId + this.constService.idCart + cartId;
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    CarrierService.prototype.getCarrierById = function (carrierId) {
        var urlDir = this.constService.baseDir + this.constService.carrierDir + "/" + carrierId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir).map(function (data) { return data.json() || {}; });
    };
    CarrierService.prototype.getCarrierImageUrl = function (carrierUrl) {
        return "http://www.bizztofly.com/" + carrierUrl + this.constService.keyDir;
    };
    CarrierService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http,
            ConstService])
    ], CarrierService);
    return CarrierService;
}());
export { CarrierService };
//# sourceMappingURL=carrier.service.js.map