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
import { NavController, Events, NavParams, IonicPage, LoadingController, Platform } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { LoginService } from './login.service';
import { UserService } from '../../providers/user-service';
import { SocketService } from '../../providers/socket-service';
var LoginPage = /** @class */ (function () {
    function LoginPage(navCtrl, navParams, events, fb, facebook, googlePlus, loadingCtrl, twitter, platform, loginService, userService, socketService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.events = events;
        this.fb = fb;
        this.facebook = facebook;
        this.googlePlus = googlePlus;
        this.loadingCtrl = loadingCtrl;
        this.twitter = twitter;
        this.platform = platform;
        this.loginService = loginService;
        this.userService = userService;
        this.socketService = socketService;
    }
    LoginPage.prototype.onLogin = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: 'please wait'
        });
        loader.present();
        this.loginService.login(this.user.value)
            .subscribe(function (user) {
            loader.dismiss();
            localStorage.setItem('token', "bearer " + user.token);
            if (_this.navParams.get("flag") == 0) {
                _this.navCtrl.setRoot("CartPage");
            }
            else {
                _this.navCtrl.setRoot("HomePage");
                _this.socketService.establishConnection();
                _this.renderImage();
            }
        }, function (error) {
            loader.dismiss();
        });
    };
    LoginPage.prototype.ngOnInit = function () {
        this.user = this.fb.group({
            email: ['info@ionicfirebaseapp.com', Validators.required],
            password: ['123456', Validators.required],
        });
    };
    LoginPage.prototype.renderImage = function () {
        var _this = this;
        this.userService.getUser()
            .subscribe(function (user) {
            _this.events.publish('imageUrl', user.imageUrl);
        });
    };
    LoginPage.prototype.doFbLogin = function () {
        var _this = this;
        var permissions = new Array();
        permissions = ["public_profile", "email", "user_education_history"];
        this.facebook.login(permissions)
            .then(function (success) {
            _this.facebook.api("/me?fields=id,name,email,gender,first_name,last_name", permissions).then(function (user) {
                //here post data to Api
                localStorage.setItem('user', user.id);
                _this.navCtrl.setRoot("HomePage");
            }),
                function (error) {
                    console.log(JSON.stringify(error));
                    console.log('FAcebook not responding!');
                };
        }, function (error) {
            console.log("FaceBook ERROR : ", JSON.stringify(error));
        });
    };
    LoginPage.prototype.googleLogin = function () {
        var _this = this;
        this.googlePlus.login({
            'scopes': '',
            'webClientId': '557859355960-r2petg57jjsomcvkbs0bc4401n57l9ja.apps.googleusercontent.com',
            'offline': true
        })
            .then(function (success) {
            console.log("you have been successfully logged in by googlePlus!" + JSON.stringify(success));
            //here post data to Api
            localStorage.setItem('user', success.userId);
            _this.navCtrl.setRoot("HomePage");
        }, function (error) {
            console.log('error' + JSON.stringify(error));
        });
    };
    LoginPage.prototype.twitterLogin = function () {
        var _this = this;
        this.platform.ready().then(function (res) {
            if (res == 'cordova') {
                _this.twitter.login().then(function (result) {
                    _this.twitter.showUser().then(function (user) {
                        console.log("user" + JSON.stringify(user));
                        //here post data to Api
                        localStorage.setItem('user', user.id);
                        _this.navCtrl.setRoot("HomePage");
                    }, function (onError) {
                        console.log("user" + JSON.stringify(onError));
                    });
                });
            }
        });
    };
    LoginPage.prototype.Register = function () {
        this.navCtrl.push("RegistrationPage");
    };
    LoginPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-login',
            templateUrl: 'login.html',
            providers: [Facebook, GooglePlus, TwitterConnect, LoginService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            Events,
            FormBuilder,
            Facebook,
            GooglePlus,
            LoadingController,
            TwitterConnect,
            Platform,
            LoginService,
            UserService,
            SocketService])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.js.map