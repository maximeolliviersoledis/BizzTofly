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
var LoginService = /** @class */ (function () {
    function LoginService(http, constService) {
        this.http = http;
        this.constService = constService;
    }
    /*login(user: any) {
        const body = JSON.stringify(user);
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.constService.base_url + 'auth/local', body, {
            headers: headers
        })
            .map((data: Response) => data.json() || {})
            //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }*/
    LoginService.prototype.login = function (user) {
        //http://www.bizztofly.com/modules/sld_notification/mobile-notification.php?ws_key=P67RDX29JM5ITD4JA5A56GZJSIXGXBKL&output_format=JSON&login=0&email=undefined&passwd=undefined
        var body = JSON.stringify(user);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.constService.notificationDir + this.constService.keyDir + this.constService.formatDir + '&login=0' + '&email=' + user.email + '&passwd=' + user.password, body, {
            headers: headers
        })
            .map(function (data) { return data.json() || {}; });
        //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    };
    LoginService.prototype.getCartForCustomer = function (customerId) {
        var urlDir = this.constService.baseDir + this.constService.cartDir + this.constService.keyDir + this.constService.formatDir + this.constService.filterIdCustomer + customerId + this.constService.sortIdDesc + this.constService.limitQuery + 1;
        var headers = new Headers();
        console.log(urlDir);
        return this.http.get(urlDir, {
            headers: headers
        })
            .map(function (data) { return data.json() || {}; });
    };
    LoginService.prototype.getCart = function (cartId) {
        var urlDir = this.constService.baseDir + this.constService.cartDir + "/" + cartId + this.constService.keyDir + this.constService.formatDir;
        var headers = new Headers();
        return this.http.get(urlDir, {
            headers: headers
        })
            .map(function (data) { return data.json() || {}; });
    };
    LoginService.prototype.getMenuItemDetails = function (menuItemId) {
        var headers = new Headers();
        // var urlDir = this.constService.baseDirApiSoledis + this.constService.productDetail + "/" + menuItemId + this.constService.keyDir + this.constService.formatDir + this.constService.filterUser + user_id;;
        var urlDir = this.constService.baseDirApiSoledis + this.constService.productDetail + "/" + menuItemId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
        //.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    };
    LoginService.prototype.getDeclinaisons = function (declinaisonId) {
        var headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.combinationDir + "/" + declinaisonId + this.constService.keyDir + this.constService.formatDir;
        //var urlDir = "http://www.bizztofly.com/api/combinations/"+declinaisonId+"?ws_key=P67RDX29JM5ITD4JA5A56GZJSIXGXBKL&output_format=JSON";
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    LoginService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http,
            ConstService])
    ], LoginService);
    return LoginService;
}());
export { LoginService };
//# sourceMappingURL=login.service.js.map