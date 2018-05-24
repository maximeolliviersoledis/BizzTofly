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
import { FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from 'ng2-translate';
import { UserService } from '../../providers/user-service';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { SettingsService } from './settings.service';
import { Storage } from '@ionic/storage';
var Settings = /** @class */ (function () {
    function Settings(navCtrl, events, fb, platform, loadingCtrl, toastCtrl, translate, userService, settingService, storage) {
        this.navCtrl = navCtrl;
        this.events = events;
        this.fb = fb;
        this.platform = platform;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.translate = translate;
        this.userService = userService;
        this.settingService = settingService;
        this.storage = storage;
        this.user = {};
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
        var emailRegex = "^[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,4}$";
        var userRegex = "^[a-zA-Z- ]+";
        this.newUserInfo = this.fb.group({
            firstName: ['', Validators.pattern(userRegex)],
            lastName: ['', Validators.pattern(userRegex)],
            email: ['', Validators.pattern(emailRegex)],
            password: ['', Validators.minLength(8)],
            passwordConfirmation: ['', Validators.minLength(8)]
        }, { validator: this.passwordMatch });
        /*var userExist = JSON.parse(localStorage.getItem('user'));
        if(userExist){
          this.settingService.getUser(userExist.id_customer).subscribe(data => {
            this.user = data;
          })
          console.log(this.newUserInfo);
        }else{
          this.navCtrl.push('LoginPage');
        }
        loader.dismiss();*/
        this.storage.get('user').then(function (data) {
            if (data && data.token) {
                _this.settingService.getUser(data.id_customer).subscribe(function (data) {
                    _this.user = data;
                });
            }
            else {
                _this.navCtrl.push('LoginPage');
            }
            loader.dismiss();
        });
    };
    //Vérifie que les mots de passe soit identiques
    Settings.prototype.passwordMatch = function (control) {
        return control.controls['password'].value === control.controls['passwordConfirmation'].value ? null : { 'mismatch': true };
    };
    Settings.prototype.onSubmit = function (user) {
        var loader = this.loadingCtrl.create({
            content: 'please wait...'
        });
        loader.present();
        console.log(this.newUserInfo);
        if (this.checkIfFieldsAreEmpty()) {
            loader.dismiss();
            console.log("form vide");
        }
        else {
            if (this.newUserInfo.value.firstName)
                this.user.customer.firstname = this.newUserInfo.value.firstName;
            if (this.newUserInfo.value.lastName)
                this.user.customer.lastname = this.newUserInfo.value.lastName;
            if (this.newUserInfo.value.email)
                this.user.customer.email = this.newUserInfo.value.email;
            if (this.newUserInfo.value.password && this.newUserInfo.value.passwordConfirmation)
                this.user.customer.passwd = this.newUserInfo.value.password;
            console.log(this.user);
            this.settingService.putUser(this.user.customer.id, this.user).subscribe(function (data) {
                console.log(data);
                loader.dismiss();
            });
        }
    };
    /* onSubmit(user: NgForm) {
       let loader = this.loadingCtrl.create({
         content:'please wait...'
       })
       loader.present();
        if(this.user.flag==1){
        this.uploader.uploadAll();
        this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
        let res:any=JSON.parse(response);
        this.user.imageUrl=res.secure_url;
        this.user.publicId=res.public_id;
        console.log("user-"+JSON.stringify(this.user));
        this.settingService.updateUserInfo(this.userId,this.user)
       .subscribe(response=>{
         loader.dismiss();
         console.log("update response-with img-"+JSON.stringify(response));
         this.events.publish('imageUrl',response.imageUrl);
         this.createToaster('user information updated',3000);
        })
           }
       } else {
         console.log("else-user-"+JSON.stringify(this.user));
          this.settingService.updateUserInfo(this.userId,this.user)
         .subscribe(response=>{
           console.log("update response-"+JSON.stringify(response));
           loader.dismiss();
           this.events.publish('imageUrl',this.user.imageUrl);
           this.createToaster('user information updated',3000);
       })
       }
     }*/
    Settings.prototype.checkIfFieldsAreEmpty = function () {
        if (this.newUserInfo.value.firstName)
            return false;
        if (this.newUserInfo.value.lastName)
            return false;
        if (this.newUserInfo.value.email)
            return false;
        if (this.newUserInfo.value.password && this.newUserInfo.value.passwordConfirmation)
            return false;
        return true;
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
            FormBuilder,
            Platform,
            LoadingController,
            ToastController,
            TranslateService,
            UserService,
            SettingsService,
            Storage])
    ], Settings);
    return Settings;
}());
export { Settings };
//# sourceMappingURL=settings.js.map