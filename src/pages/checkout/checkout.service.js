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
import { URLSearchParams } from '@angular/http';
var CheckoutService = /** @class */ (function () {
    function CheckoutService(http, constService) {
        this.http = http;
        this.constService = constService;
    }
    CheckoutService.prototype.placeOrder = function (body) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.post(this.constService.base_url + 'api/orders', body, {
            headers: headers
        })
            .map(function (data) { return data.json() || {}; });
        //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    };
    CheckoutService.prototype.chargeStripe = function (token, currency, amount, stripe_secret_key) {
        var _this = this;
        var secret_key = stripe_secret_key;
        var headers = new Headers();
        var params = new URLSearchParams();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Bearer ' + secret_key);
        params.append("currency", currency);
        params.append("amount", amount);
        params.append("description", "description");
        params.append("source", token);
        console.log("params-" + JSON.stringify(params));
        return new Promise(function (resolve) {
            _this.http.post('https://api.stripe.com/v1/charges', params, {
                headers: headers
            }).map(function (res) { return res.json(); })
                .subscribe(function (data) {
                resolve(data);
            });
        });
    };
    CheckoutService.prototype.savePaymentDetails = function (orderId, paymentDetails) {
        var headers = new Headers();
        var body = {};
        body.payment = paymentDetails;
        headers.append('Content-Type', 'application/json');
        var authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.put(this.constService.base_url + 'api/orders/' + orderId, body, {
            headers: headers
        })
            .map(function (data) { return data.json() || {}; });
        //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    };
    CheckoutService.prototype.saveLoyaltyPoints = function (userId, loyaltyData) {
        var headers = new Headers();
        var body = loyaltyData;
        headers.append('Content-Type', 'application/json');
        var authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.put(this.constService.base_url + 'api/users/' + userId, body, {
            headers: headers
        })
            .map(function (data) { return data.json() || {}; });
        //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    };
    CheckoutService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http, ConstService])
    ], CheckoutService);
    return CheckoutService;
}());
export { CheckoutService };
//# sourceMappingURL=checkout.service.js.map