var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ToastController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
var ContactPage = /** @class */ (function () {
    function ContactPage(navCtrl, navParams, toastCtrl, emailComposer) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.emailComposer = emailComposer;
        this.user = {};
    }
    ContactPage.prototype.onSend = function (user) {
        this.emailComposer.open({
            // You just need to change this Email address to your own email where you want to receive email.
            to: 'ionicfirebaseapp@gmail.com',
            subject: this.user.name,
            body: this.user.message,
            isHtml: true
        }, function (callback) {
            console.log('email view dismissed');
        });
        this.user = '';
    };
    ContactPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-contact',
            templateUrl: 'contact.html',
            providers: [EmailComposer]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ToastController,
            EmailComposer])
    ], ContactPage);
    return ContactPage;
}());
export { ContactPage };
//# sourceMappingURL=contact.js.map