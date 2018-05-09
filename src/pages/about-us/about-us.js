var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Nav, Platform } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';
var AboutUsPage = /** @class */ (function () {
    function AboutUsPage(platform, navCtrl, navParams, callNumber, emailComposer) {
        this.platform = platform;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.callNumber = callNumber;
        this.emailComposer = emailComposer;
        this.contactNo = 7376421282;
    }
    AboutUsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad AboutUsPage');
    };
    AboutUsPage.prototype.goToSlide = function () {
        this.slides.slideTo(2, 500);
    };
    AboutUsPage.prototype.callUs = function () {
        this.callNumber.callNumber(this.contactNo, true)
            .then(function () { return console.log('Launched dialer!'); })
            .catch(function () { return console.log('Error launching dialer'); });
    };
    AboutUsPage.prototype.gotogoogleMap = function () {
        this.navCtrl.push("LocationPage");
    };
    AboutUsPage.prototype.contact = function () {
        var email = {
            to: 'san10694@gmail.com',
            isHtml: true
        };
        this.emailComposer.open(email);
    };
    __decorate([
        ViewChild(Slides),
        __metadata("design:type", Slides)
    ], AboutUsPage.prototype, "slides", void 0);
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], AboutUsPage.prototype, "nav", void 0);
    AboutUsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-about-us',
            templateUrl: 'about-us.html',
            providers: [CallNumber, EmailComposer]
        }),
        __metadata("design:paramtypes", [Platform,
            NavController,
            NavParams,
            CallNumber,
            EmailComposer])
    ], AboutUsPage);
    return AboutUsPage;
}());
export { AboutUsPage };
//# sourceMappingURL=about-us.js.map