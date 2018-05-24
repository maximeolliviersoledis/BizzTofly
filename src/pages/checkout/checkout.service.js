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
var CheckoutService = /** @class */ (function () {
    function CheckoutService(http, constService) {
        this.http = http;
        this.constService = constService;
    }
    /*placeOrder(body) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.post(this.constService.base_url + 'api/orders', body, {
            headers: headers
        })
            .map((data: Response) => data.json() || {})
            //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }*/
    CheckoutService.prototype.getAvailablePayments = function (paymentId) {
        //paymentId = 0, retourne tous les moyens de payments disponibles
        var headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.paymentDir + "/" + paymentId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    CheckoutService.prototype.postOrder = function (body) {
        var headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.orderDir + this.constService.keyDir + this.constService.formatDir;
        return this.http.post(urlDir, body, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    /*chargeStripe(token, currency, amount, stripe_secret_key) {
        let secret_key = stripe_secret_key;
        var headers = new Headers();
        var params = new URLSearchParams();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Bearer ' + secret_key);
        params.append("currency", currency);
        params.append("amount", amount);
        params.append("description", "description");
        params.append("source", token);
        console.log("params-"+JSON.stringify(params));
        
        return new Promise(resolve => {
            this.http.post('https://api.stripe.com/v1/charges', params, {
                headers: headers
            }).map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                });
        });
    }*/
    /*savePaymentDetails(orderId, paymentDetails) {
        const headers = new Headers();
        let body: any = {};
        body.payment = paymentDetails;
        headers.append('Content-Type', 'application/json');
        let authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.put(this.constService.base_url + 'api/orders/' + orderId, body, {
            headers: headers
        })
            .map((data: Response) => data.json() || {})
            //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }*/
    /*saveLoyaltyPoints(userId, loyaltyData) {
        const headers = new Headers();
        const body = loyaltyData;
        headers.append('Content-Type', 'application/json');
        let authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.put(this.constService.base_url + 'api/users/'+userId, body, {
            headers: headers
        })
            .map((data: Response) => data.json() || {})
            //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }*/
    CheckoutService.prototype.postCart = function (cartId, body) {
        var headers = new Headers();
        //var urlDir = this.constService.baseDir + this.constService.cartDir + "/" + cartId + this.constService.keyDir + this.constService.formatDir;
        var urlDir = this.constService.baseDir + this.constService.cartDir + this.constService.keyDir + this.constService.formatDir;
        return this.http.post(urlDir, body, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    CheckoutService.prototype.putCart = function (cartId, body) {
        var headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.cartDir + this.constService.keyDir + this.constService.formatDir;
        return this.http.put(urlDir, body, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    CheckoutService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http, ConstService])
    ], CheckoutService);
    return CheckoutService;
}());
export { CheckoutService };
//# sourceMappingURL=checkout.service.js.map