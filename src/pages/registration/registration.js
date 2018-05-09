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
import { NavController, IonicPage, LoadingController, Platform } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { RegistrationService } from './registration.service';
import { SocketService } from '../../providers/socket-service';
var RegistrationPage = /** @class */ (function () {
    function RegistrationPage(navCtrl, toastCtrl, fb, facebook, googlePlus, loadingCtrl, twitter, platform, registrationService, socketService) {
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.fb = fb;
        this.facebook = facebook;
        this.googlePlus = googlePlus;
        this.loadingCtrl = loadingCtrl;
        this.twitter = twitter;
        this.platform = platform;
        this.registrationService = registrationService;
        this.socketService = socketService;
    }
    RegistrationPage.prototype.onRegister = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: 'please wait'
        });
        loader.present();
        this.registrationService.createUser(this.user.value)
            .subscribe(function (user) {
            loader.dismiss();
            localStorage.setItem('token', "bearer " + user.token);
            _this.navCtrl.setRoot("HomePage");
            _this.socketService.establishConnection();
            _this.displayToast('User Successfully added!', 5000);
        }, function (error) {
            loader.dismiss();
        });
    };
    RegistrationPage.prototype.displayToast = function (message, duration) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
    };
    RegistrationPage.prototype.ngOnInit = function () {
        this.user = this.fb.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', Validators.required],
            password: ['', Validators.required],
        });
    };
    RegistrationPage.prototype.navLogin = function () {
        this.navCtrl.push("LoginPage");
    };
    RegistrationPage.prototype.doFbLogin = function () {
        var _this = this;
        var permissions = new Array();
        permissions = ["public_profile", "email", "user_education_history"];
        this.facebook.login(permissions)
            .then(function (success) {
            _this.facebook.api("/me?fields=id,name,email,gender,first_name,last_name", permissions).then(function (user) {
                //here post data to Api
                localStorage.setItem('token', user.id);
                _this.navCtrl.setRoot("HomePage");
            }),
                function (error) {
                    console.log(JSON.stringify(error));
                };
        }, function (error) {
            console.log("FaceBook ERROR : ", JSON.stringify(error));
        });
    };
    RegistrationPage.prototype.googleLogin = function () {
        var _this = this;
        this.googlePlus.login({
            'scopes': '',
            'webClientId': '557859355960-r2petg57jjsomcvkbs0bc4401n57l9ja.apps.googleusercontent.com',
            'offline': true
        })
            .then(function (success) {
            //here post data to Api
            localStorage.setItem('token', success.userId);
            _this.navCtrl.setRoot("HomePage");
        }, function (error) {
            console.log('error' + JSON.stringify(error));
        });
    };
    RegistrationPage.prototype.twitterLogin = function () {
        var _this = this;
        this.platform.ready().then(function (res) {
            if (res == 'cordova') {
                _this.twitter.login().then(function (result) {
                    _this.twitter.showUser().then(function (user) {
                        //here post data to Api
                        localStorage.setItem('token', user.id);
                        _this.navCtrl.setRoot("HomePage");
                    }, function (onError) {
                        console.log("user" + JSON.stringify(onError));
                    });
                });
            }
        });
    };
    RegistrationPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-registration',
            templateUrl: 'registration.html',
            providers: [Facebook, GooglePlus, TwitterConnect, RegistrationService]
        }),
        __metadata("design:paramtypes", [NavController,
            ToastController,
            FormBuilder,
            Facebook,
            GooglePlus,
            LoadingController,
            TwitterConnect,
            Platform,
            RegistrationService,
            SocketService])
    ], RegistrationPage);
    return RegistrationPage;
}());
export { RegistrationPage };
//# sourceMappingURL=registration.js.map