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
import { NavController, Events, AlertController, NavParams, IonicPage, LoadingController, Platform } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { LoginService } from './login.service';
import { UserService } from '../../providers/user-service';
import { SocketService } from '../../providers/socket-service';
import { Storage } from '@ionic/storage';
var LoginPage = /** @class */ (function () {
    function LoginPage(navCtrl, navParams, alertCtrl, events, fb, facebook, googlePlus, loadingCtrl, twitter, platform, loginService, userService, socketService, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
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
        this.storage = storage;
        this.cart = [];
        /*product: any = {
            name: ' ',
            quantity: 0,
            declinaison: []
        }*/
        this.declinaisons = [];
        this.products = [];
    }
    LoginPage.prototype.onLogin = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: 'please wait'
        });
        loader.present();
        console.log(this.user.value);
        this.loginService.login(this.user.value)
            .subscribe(function (user) {
            console.log(user);
            loader.dismiss();
            if (user.token) {
                /*localStorage.setItem('token',user.token);
                localStorage.setItem('user',JSON.stringify(user));*/
                console.log(user.id_customer);
                _this.storage.set('user', user);
                localStorage.setItem('userLoggedIn', JSON.stringify(true));
                _this.checkIfCartExist(user);
                if (_this.navParams.get("flag") == 0) {
                    _this.navCtrl.setRoot("CartPage");
                }
                else {
                    _this.navCtrl.setRoot("HomePage");
                    // this.socketService.establishConnection();
                    //this.renderImage();
                }
            }
            else if (user.error) {
                var alert_1 = _this.alertCtrl.create({
                    title: "Erreur login",
                    subTitle: "Noms d'utilisateurs ou mot de passe incorrect",
                    buttons: ['OK']
                });
                alert_1.present();
            }
            else {
                console.log("Une erreur inconnue est survenue");
                var alert_2 = _this.alertCtrl.create({
                    title: "Erreur!",
                    subTitle: "Une erreur inconnue est survenue",
                    buttons: ['OK']
                });
                alert_2.present();
            }
        }, function (error) {
            loader.dismiss();
        });
    };
    LoginPage.prototype.ngOnInit = function () {
        var emailRegex = "^[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,4}$";
        //Possibilité de se connecter que lorsque l'utilisateur saisit une adresse mail conforme à la regex si dessus
        //De plus, le mot de passe saisit doit faire au minimum 5 caractères (se mettre en accord avec la page d'inscription)
        this.user = this.fb.group({
            email: ['test2@test.fr', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
            password: ['testtest', Validators.compose([Validators.required, Validators.minLength(5)])],
        });
        /*this.user = this.fb.group({
            email: ['info@ionicfirebaseapp.com', Validators.required],
            password: ['123456', Validators.required],

        });*/
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
    LoginPage.prototype.checkIfCartExist = function (user) {
        var _this = this;
        var cartId = -1;
        //Récupères les paniers en cours de l'utilisateur
        this.loginService.getCartForCustomer(user.id_customer).subscribe(function (data) {
            console.log(data);
            //Récupères le dernier panier s'il n'est pas vide et n'a pas été commandé
            if (data.carts && data.carts[0].id) { //&& data.carts[0].id_address_invoice == 0 && data.carts[0].associations
                var alert_3 = _this.alertCtrl.create({
                    title: "Panier trouvé",
                    subTitle: "Un panier à votre nom a été trouvé en ligne.\n Souhaitez vous le chargez ? (Attention, si vous aviez déjà un panier d'enregistré celui-ci sera perdu)",
                    buttons: [
                        {
                            text: 'Oui',
                            handler: function () {
                                console.log('Oui clicked');
                                cartId = data.carts[0].id;
                                _this.getExistingCart(cartId);
                            }
                        },
                        {
                            text: 'Non',
                            handler: function () {
                                console.log('Non clicked');
                                localStorage.removeItem('id_cart');
                            }
                        }
                    ]
                });
                alert_3.present();
            }
        });
    };
    // declinaison: any = {};
    LoginPage.prototype.getExistingCart = function (cartId) {
        var _this = this;
        this.loginService.getCart(cartId).subscribe(function (cartData) {
            console.log(cartData);
            localStorage.setItem('id_cart', cartData.cart.id);
            //console.log(cartData.cart.associations.cart_rows);
            if (localStorage.getItem('cartItem'))
                localStorage.removeItem('cartItem');
            for (var _i = 0, _a = cartData.cart.associations.cart_rows; _i < _a.length; _i++) {
                var item = _a[_i];
                //console.log(item);
                //this.getProducts(item.id_product);
                //this.getDeclinaisons(item.id_product_attribute);
                _this.addToCart(item.id_product, item.id_product_attribute, item.quantity);
            }
            //console.log(this.products);
            // console.log(this.declinaisons);
            // console.log(this.cart);
        });
    };
    LoginPage.prototype.addToCart = function (productId, declinaisonId, quantity) {
        var _this = this;
        var product = {
            name: '',
            quantity: 0,
            declinaison: []
        };
        var declinaison = {};
        if (declinaisonId > 0) {
            this.loginService.getDeclinaisons(declinaisonId).subscribe(function (data) {
                _this.declinaisons.push(data);
                declinaison = data;
                var productAlreadyFind = _this.products.find(function (elem) {
                    return elem.id == productId;
                });
                if (!productAlreadyFind) {
                    _this.loginService.getMenuItemDetails(productId).subscribe(function (data) {
                        _this.products.push(data);
                        console.log(data);
                        declinaison.selectedQuantity = parseInt(quantity);
                        //declinaison.endPrice = data.price;
                        var id = declinaison.combination.id;
                        var index = _this.objectToArray(data.declinaisons).findIndex(function (elem) {
                            return elem.id === id;
                        });
                        declinaison.endPrice = parseFloat(_this.objectToArray(data.declinaisons)[index].price);
                        console.log(declinaison.endPrice);
                        product.name = data.name;
                        product.productId = productId;
                        product.quantity += parseInt(quantity);
                        product.imageUrl = data.image;
                        var decli = _this.objectToArray(data.declinaisons);
                        for (var _i = 0, decli_1 = decli; _i < decli_1.length; _i++) {
                            var dec = decli_1[_i];
                            if (dec.id == declinaisonId)
                                declinaison.name = dec.name;
                        }
                        product.declinaison.push(declinaison);
                        console.log(product);
                        _this.cart.push(product);
                        //localStorage.setItem('cartItem',JSON.stringify(this.cart));
                        _this.storage.set('cart', _this.cart);
                    });
                }
            });
        }
        else if (productId > 0) {
            this.loginService.getMenuItemDetails(productId).subscribe(function (data) {
                _this.products.push(data);
                _this.cart.push(product);
                //localStorage.setItem('cartItem',JSON.stringify(this.cart));
                _this.storage.set('cart', _this.cart);
            });
        }
        else {
            console.log("Cart was empty");
        }
    };
    /**
    * Méthode permettant de cast un object en array
    * @param object : object à cast
    * @return array : array équivalent à l'objet
    */
    LoginPage.prototype.objectToArray = function (object) {
        var item = Object.keys(object);
        var array = [];
        for (var _i = 0, item_1 = item; _i < item_1.length; _i++) {
            var i = item_1[_i];
            array.push(object[i]);
        }
        return array;
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
            AlertController,
            Events,
            FormBuilder,
            Facebook,
            GooglePlus,
            LoadingController,
            TwitterConnect,
            Platform,
            LoginService,
            UserService,
            SocketService,
            Storage])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.js.map