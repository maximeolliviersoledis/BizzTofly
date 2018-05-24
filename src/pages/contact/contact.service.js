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
var ContactService = /** @class */ (function () {
    function ContactService(http, constService) {
        this.http = http;
        this.constService = constService;
    }
    ContactService.prototype.postMessage = function (body) {
        var headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.contactDir + this.constService.keyDir + this.constService.formatDir;
        return this.http.post(urlDir, body, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    ContactService.prototype.getAllContacts = function () {
        var headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.contactDir + "/0" + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map(function (data) { return data.json() || {}; });
    };
    ContactService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http, ConstService])
    ], ContactService);
    return ContactService;
}());
export { ContactService };
//# sourceMappingURL=contact.service.js.map