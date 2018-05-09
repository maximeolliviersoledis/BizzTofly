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
import { NavController, Events, IonicPage, ToastController, LoadingController, Platform } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { UserService } from '../../providers/user-service';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { SettingsService } from './settings.service';
var Settings = /** @class */ (function () {
    function Settings(navCtrl, events, platform, loadingCtrl, toastCtrl, translate, userService, settingService) {
        this.navCtrl = navCtrl;
        this.events = events;
        this.platform = platform;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.translate = translate;
        this.userService = userService;
        this.settingService = settingService;
        this.user = {
            flag: 0
        };
        this.options = [
            {
                "language": "ENGLISH",
                "value": "en"
            },
            {
                "language": "FRENCH",
                "value": "fr"
            },
            {
                "language": "ARABIC",
                "value": "ar"
            }
        ];
        this.cloudinaryUpload = {
            cloudName: 'pietechsolutions',
            uploadPreset: 't0iey0lk'
        };
        this.uploader = new CloudinaryUploader(new CloudinaryOptions(this.cloudinaryUpload));
        this.imageUrl = 'assets/img/profile.jpg';
        var value = localStorage.getItem('language');
        this.value = value != null ? value : 'en';
        var notification = localStorage.getItem('notification');
        this.notification = notification != null ? notification : true;
    }
    Settings.prototype.ngOnInit = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: 'please wait...'
        });
        loader.present();
        this.userService.getUser()
            .subscribe(function (res) {
            console.log("user" + JSON.stringify(res));
            _this.user = res;
            _this.userId = res._id;
            _this.user.imageUrl = res.imageUrl;
            _this.translate.use(_this.value);
            loader.dismiss();
        }, function (error) {
            loader.dismiss();
        });
    };
    Settings.prototype.onSubmit = function (user) {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: 'please wait...'
        });
        loader.present();
        if (this.user.flag == 1) {
            this.uploader.uploadAll();
            this.uploader.onSuccessItem = function (item, response, status, headers) {
                var res = JSON.parse(response);
                _this.user.imageUrl = res.secure_url;
                _this.user.publicId = res.public_id;
                console.log("user-" + JSON.stringify(_this.user));
                _this.settingService.updateUserInfo(_this.userId, _this.user)
                    .subscribe(function (response) {
                    loader.dismiss();
                    console.log("update response-with img-" + JSON.stringify(response));
                    _this.events.publish('imageUrl', response.imageUrl);
                    _this.createToaster('user information updated', 3000);
                });
            };
        }
        else {
            console.log("else-user-" + JSON.stringify(this.user));
            this.settingService.updateUserInfo(this.userId, this.user)
                .subscribe(function (response) {
                console.log("update response-" + JSON.stringify(response));
                loader.dismiss();
                _this.events.publish('imageUrl', _this.user.imageUrl);
                _this.createToaster('user information updated', 3000);
            });
        }
    };
    Settings.prototype.readUrl = function (event) {
        var _this = this;
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function (event) {
                _this.preview = event.target.result;
                _this.user.flag = 1;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };
    Settings.prototype.changeLanguage = function () {
        if (this.value == 'fr') {
            console.log("Selected language is French");
            this.translate.use('fr');
            this.platform.setDir('ltr', true);
        }
        else if (this.value == 'ar') {
            this.platform.setDir('rtl', true);
            this.translate.use('ar');
        }
        else {
            console.log("Selected language is English");
            this.translate.use('en');
            this.platform.setDir('ltr', true);
        }
        localStorage.setItem('language', this.value);
    };
    Settings.prototype.changeSetting = function () {
        //console.log("notification-"+this.notification);
        localStorage.setItem('notification', this.notification);
    };
    Settings.prototype.createToaster = function (message, duration) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
    };
    Settings = __decorate([
        IonicPage(),
        Component({
            selector: 'page-settings',
            templateUrl: 'settings.html',
            providers: [SettingsService]
        }),
        __metadata("design:paramtypes", [NavController,
            Events,
            Platform,
            LoadingController,
            ToastController,
            TranslateService,
            UserService,
            SettingsService])
    ], Settings);
    return Settings;
}());
export { Settings };
//# sourceMappingURL=settings.js.map