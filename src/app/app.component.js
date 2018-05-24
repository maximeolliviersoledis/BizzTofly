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
import { TranslateService } from 'ng2-translate';
import { Storage } from '@ionic/storage';
import { CategoryService } from '../pages/category/category.service';
var MyApp = /** @class */ (function () {
    function MyApp(platform, service, socketService, 
    //private userService:UserService,
    statusBar, splashScreen, oneSignal, socialSharing, events, translateService, storage, category) {
        var _this = this;
        this.platform = platform;
        this.service = service;
        this.socketService = socketService;
        this.oneSignal = oneSignal;
        this.socialSharing = socialSharing;
        this.events = events;
        this.translateService = translateService;
        this.storage = storage;
        this.category = category;
        this.offerCounter = 0;
        this.imageUrl = 'assets/img/profile.jpg';
        this.categories = [];
        this.displayAllCategories = false;
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
        /*if(this.isLogin()){
         this.userService.getUser()
         .subscribe(user=>{
          this.imageUrl=user.imageUrl!=null?this.imageUrl=user.imageUrl:this.imageUrl='assets/img/profile.jpg';
         }, error =>{
          this.nav.setRoot("LoginPage");
         })
        }*/
        if (!this.isLogin()) {
            this.nav.setRoot("LoginPage");
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
        return JSON.parse(localStorage.getItem('userLoggedIn')) != null;
    };
    MyApp.prototype.home = function () {
        this.nav.setRoot("HomePage");
    };
    MyApp.prototype.catagory = function () {
        //this.nav.push("CategoryPage");
        /*this.category.categoryService.getAllCategories().subscribe(data => {
            console.log(data);
        })*/
        /* if(!this.categories || this.categories.length == 0){
             this.category.getCategories().subscribe(data=>{
                 console.log(data);
                 //this.categories = data;
                 for(var category of data){
                     if(category)
                 }
             })*/
        var _this = this;
        if (!this.categories || this.categories.length == 0) {
            this.category.getCategory(2).subscribe(function (data) {
                if (data.category.level_depth <= 2) {
                    for (var _i = 0, _a = data.category.associations.categories; _i < _a.length; _i++) {
                        var child = _a[_i];
                        _this.category.getCategory(child.id).subscribe(function (childData) {
                            _this.categories.push(childData);
                        });
                    }
                }
            });
        }
        this.displayAllCategories = !this.displayAllCategories;
        console.log(this.displayAllCategories);
    };
    MyApp.prototype.categoryList = function () {
        this.nav.push("CategoryPage");
    };
    MyApp.prototype.goToProductList = function (category) {
        var _this = this;
        /*console.log("goToProductList appelé");
        this.displayAllCategories = !this.displayAllCategories;
        this.nav.push("ProductListPage", {
            MenuId: categoryId
        });*/
        if (category.category.level_depth <= 2 && category.category.associations.categories) {
            for (var _i = 0, _a = category.category.associations.categories; _i < _a.length; _i++) {
                var child = _a[_i];
                var childAlreadyPresent = this.categories.findIndex(function (elem) {
                    return elem.category.id == child.id;
                });
                if (childAlreadyPresent == -1) {
                    this.category.getCategory(child.id).subscribe(function (data) {
                        _this.categories.splice(_this.categories.indexOf(category) + 1, 0, data);
                        //this.categories.push(data);
                    });
                }
            }
            /*for(var i=0;i<category.category.associations.categories.length;i++){
                var childAlreadyPresent = this.categories.find(function(elem){
                    return elem.category.id == category.category.associations.categories[i];
                })
                if(!childAlreadyPresent){
                    this.category.getCategory(category.category.associations.categories[i].id).subscribe(data => {
                        this.categories.splice(i,0,data);
                        //this.categories.push(data);
                    })
                }
            }*/
        }
        else {
            this.displayAllCategories = !this.displayAllCategories;
            this.nav.push("ProductListPage", {
                MenuId: category.category.id
            });
        }
    };
    MyApp.prototype.getIndex = function () {
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
    /*bookTable(){
        this.nav.push("TableBookingPage");
    }

    bookHistory(){
        this.nav.push("BookingHistoryPage");
    }*/
    MyApp.prototype.offer = function () {
        this.nav.push("OfferPage");
    };
    /*news() {
        this.nav.push("NewsPage");
    }*/
    MyApp.prototype.contact = function () {
        this.nav.push("ContactPage");
    };
    MyApp.prototype.settings = function () {
        this.nav.push("Settings");
    };
    MyApp.prototype.aboutUs = function () {
        this.nav.push("AboutUsPage");
    };
    /* invite() {
    this.socialSharing.share("share Restaurant App with friends to get credits", null, null, 'https://ionicfirebaseapp.com/#/');
  }
    
    chat(){
      this.nav.push("ChatPage");
    }*/
    MyApp.prototype.orderStatus = function () {
        this.nav.push("OrderStatusPage");
    };
    MyApp.prototype.login = function () {
        this.nav.setRoot("LoginPage");
    };
    MyApp.prototype.logout = function () {
        /*localStorage.removeItem('token');
        localStorage.removeItem('user');*/
        this.storage.remove('user');
        localStorage.removeItem('userLoggedIn');
        this.events.publish('imageUrl', 'assets/img/profile.jpg');
        this.nav.setRoot("LoginPage");
    };
    MyApp.prototype.isCart = function () {
        //let cart = JSON.parse(localStorage.getItem('cartItem'));
        /*this.storage.get('cart').then((data)=>{
            data != null && data.length != null ?this.noOfItems = data.length:this.noOfItems=null;
        })*/
        var cart = JSON.parse(localStorage.getItem('cartLength'));
        cart != null ? this.noOfItems = cart : this.noOfItems = null;
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
            providers: [Service, OneSignal, SocialSharing, CategoryService]
        }),
        __metadata("design:paramtypes", [Platform,
            Service,
            SocketService,
            StatusBar,
            SplashScreen,
            OneSignal,
            SocialSharing,
            Events,
            TranslateService,
            Storage,
            CategoryService])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map