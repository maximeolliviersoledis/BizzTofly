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
var AddressListService = /** @class */ (function () {
    function AddressListService(http, constService) {
        this.http = http;
        this.constService = constService;
    }
    AddressListService.prototype.getAddressList = function (customerId) {
        //http://www.bizztofly.com/api/addresses?ws_key=P67RDX29JM5ITD4JA5A56GZJSIXGXBKL&output_format=JSON&filter[id_customer]=55&filter[deleted]=0
        var urlDir = this.constService.baseDir + this.constService.adresses + this.constService.keyDir + this.constService.formatDir + this.constService.filterIdCustomer + customerId + this.constService.filterDeleted + "0";
        var headers = new Headers();
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    AddressListService.prototype.getAddress = function (addressId) {
        var urlDir = this.constService.baseDir + this.constService.adresses + "/" + addressId + this.constService.keyDir + this.constService.formatDir;
        var headers = new Headers();
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    AddressListService.prototype.deleteAddress = function (addressId) {
        var urlDir = this.constService.baseDir + this.constService.adresses + "/" + addressId + this.constService.keyDir + this.constService.formatDir;
        var headers = new Headers();
        return this.http.delete(urlDir, {
            headers: headers
        });
    };
    AddressListService.prototype.putCart = function (cartId, body) {
        var headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.cartDir + "/" + cartId + this.constService.keyDir + this.constService.formatDir;
        return this.http.put(urlDir, body, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    AddressListService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http,
            ConstService])
    ], AddressListService);
    return AddressListService;
}());
export { AddressListService };
//# sourceMappingURL=address-list.service.js.map