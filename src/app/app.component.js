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
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Service } from '../app/service';
import { OneSignal } from '@ionic-native/onesignal';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SocketService } from '../providers/socket-service';
import { UserService } from '../providers/user-service';
import { TranslateService } from 'ng2-translate';
var MyApp = /** @class */ (function () {
    function MyApp(platform, service, socketService, userService, statusBar, splashScreen, oneSignal, socialSharing, events, translateService) {
        var _this = this;
        this.platform = platform;
        this.service = service;
        this.socketService = socketService;
        this.userService = userService;
        this.oneSignal = oneSignal;
        this.socialSharing = socialSharing;
        this.events = events;
        this.translateService = translateService;
        this.offerCounter = 0;
        this.imageUrl = 'assets/img/profile.jpg';
        platform.ready().then(function (res) {
            // alert('ici11');
            if (res == 'cordova') {
                _this.oneSignal.startInit('230d3e93-0c29-49bd-ac82-ecea8612464e', '714618018341');
                _this.oneSignal.inFocusDisplaying(_this.oneSignal.OSInFocusDisplayOption.InAppAlert);
                _this.oneSignal.handleNotificationReceived().subscribe(function () {
                });
                _this.oneSignal.handleNotificationOpened().subscribe(function () {
                    console.log("notification opened!");
                });
                _this.oneSignal.endInit();
            }
            statusBar.styleDefault();
            splashScreen.hide();
        });
        this.service.getData()
            .subscribe(function (response) {
            _this.newsCounter = response.newsList.length;
            for (var i = 0; i <= response.menuItems.length - 1; i++) {
                if (response.menuItems[i].offer != null) {
                    _this.offerCounter = _this.offerCounter + 1;
                }
            }
        });
    }
    MyApp.prototype.ngOnInit = function () {
        // alert('ici22');
        if (!this.isLogin()) {
            this.rootPage = "LoginPage";
        }
        else {
            this.rootPage = "HomePage";
            this.socketService.establishConnection();
            this.renderImage();
            this.listenEvents();
        }
        this.useTranslateService();
    };
    MyApp.prototype.useTranslateService = function () {
        // let value= localStorage.getItem('language');
        // let language = value!=null ? value:'en';
        // this.translateService.use(language);
        var value = localStorage.getItem('language');
        var language = value != null ? value : 'en';
        language == 'ar' ? this.platform.setDir('rtl', true) : this.platform.setDir('ltr', true);
        ;
        this.translateService.use(language);
    };
    MyApp.prototype.renderImage = function () {
        var _this = this;
        if (this.isLogin()) {
            this.userService.getUser()
                .subscribe(function (user) {
                _this.imageUrl = user.imageUrl != null ? _this.imageUrl = user.imageUrl : _this.imageUrl = 'assets/img/profile.jpg';
            }, function (error) {
                _this.nav.setRoot("LoginPage");
            });
        }
    };
    MyApp.prototype.listenEvents = function () {
        var _this = this;
        this.events.subscribe('imageUrl', function (imageUrl) {
            _this.imageUrl = imageUrl;
            //console.log("listen----->>>>>>"+imageUrl);
            _this.renderImage();
        });
    };
    MyApp.prototype.isLogin = function () {
        return localStorage.getItem('token') != null;
    };
    MyApp.prototype.home = function () {
        this.nav.setRoot("HomePage");
    };
    MyApp.prototype.catagory = function () {
        this.nav.push("CategoryPage");
    };
    MyApp.prototype.gotoCart = function () {
        this.nav.push("CartPage");
    };
    MyApp.prototype.yourOrders = function () {
        this.nav.push("OrdersPage");
    };
    MyApp.prototype.favourite = function () {
        this.nav.push("FavouritePage");
    };
    MyApp.prototype.bookTable = function () {
        this.nav.push("TableBookingPage");
    };
    MyApp.prototype.bookHistory = function () {
        this.nav.push("BookingHistoryPage");
    };
    MyApp.prototype.offer = function () {
        this.nav.push("OfferPage");
    };
    MyApp.prototype.news = function () {
        this.nav.push("NewsPage");
    };
    MyApp.prototype.contact = function () {
        this.nav.push("ContactPage");
    };
    MyApp.prototype.settings = function () {
        this.nav.push("Settings");
    };
    MyApp.prototype.aboutUs = function () {
        this.nav.push("AboutUsPage");
    };
    MyApp.prototype.invite = function () {
        this.socialSharing.share("share Restaurant App with friends to get credits", null, null, 'https://ionicfirebaseapp.com/#/');
    };
    MyApp.prototype.chat = function () {
        this.nav.push("ChatPage");
    };
    MyApp.prototype.orderStatus = function () {
        this.nav.push("OrderStatusPage");
    };
    MyApp.prototype.login = function () {
        this.nav.setRoot("LoginPage");
    };
    MyApp.prototype.logout = function () {
        localStorage.removeItem('token');
        this.events.publish('imageUrl', 'assets/img/profile.jpg');
        this.nav.setRoot("LoginPage");
    };
    MyApp.prototype.isCart = function () {
        var cart = JSON.parse(localStorage.getItem('cartItem'));
        cart != null ? this.noOfItems = cart.length : this.noOfItems = null;
        return true;
    };
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html',
            selector: 'MyApp',
            providers: [Service, OneSignal, SocialSharing]
        }),
        __metadata("design:paramtypes", [Platform,
            Service,
            SocketService,
            UserService,
            StatusBar,
            SplashScreen,
            OneSignal,
            SocialSharing,
            Events,
            TranslateService])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map