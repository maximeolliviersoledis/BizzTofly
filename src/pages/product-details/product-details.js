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
import { NavController, NavParams, AlertController, LoadingController, ToastController, IonicPage } from 'ionic-angular';
import { Service } from '../../app/service';
import { Storage } from '@ionic/storage';
import { ProductDetailsService } from './product-details.service';
var ProductDetailsPage = /** @class */ (function () {
    function ProductDetailsPage(navCtrl, loadingCtrl, alertCtrl, toastCtrl, navParams, storage, service, productDetailsService) {
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.service = service;
        this.productDetailsService = productDetailsService;
        this.id_declinaisons = -1;
        this.quantityInCart = 0;
        this.quantity = -1;
        this.initPrice = -1;
        this.count = 1;
        this.ExtraOptions = [];
        this.itemInCart = [];
        this.Cart = [];
        this.prices = [{ value: '' }];
        /*product: any = {
            name:'',
            sizeOption: {},
            extraOption: []
        };*/
        this.product = {
            name: ' ',
            quantity: 0,
            declinaison: [],
            sizeOption: {},
            extraOption: []
        };
        this.productDetails = {};
        this.like = false;
        //Add favourite
        this.visible = true;
        this.favourites = [];
        this.favourite = [];
        this.favouriteItems = [];
        this.productId = navParams.get('productId');
        console.log("product id = " + this.productId);
        console.log(navParams.get('product'));
        this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
        this.storage.get('user').then(function (val) {
            console.log(val);
        });
        if (this.cartItems != null) {
            this.noOfItems = this.cartItems.length;
        }
        /* this.storage.get('favourite').then((favourite) => {
             this.favourites = favourite;
         })
         this.storage.get('favourite').then((favourites) => {
             this.favouriteItems = favourites;
         })*/
    }
    ProductDetailsPage.prototype.ngOnInit = function () {
        var _this = this;
        console.log("ngOnInit() appelé");
        var loader = this.loadingCtrl.create({
            content: 'please wait'
        });
        loader.present();
        //Plus d'appel api, on passe le produit dans la navParam
        var product = this.navParams.get('product');
        if (product) {
            this.productDetails = product;
            var details = this.productDetails;
            this.initPrice = this.productDetails.price;
            var dec = Object.keys(this.productDetails.declinaisons);
            var goodDec = [];
            for (var _i = 0, dec_1 = dec; _i < dec_1.length; _i++) {
                var d = dec_1[_i];
                goodDec.push(this.productDetails.declinaisons[d]);
            }
            this.productDetails.declinaisons = goodDec;
            this.product.productId = details.id;
            this.product.name = details.name;
            this.product.price = details.prices.specific_price;
            this.product.imageUrl = details.image;
            console.log(this.productDetails);
            loader.dismiss();
        }
        else {
            if (this.productId) {
                this.productDetailsService.getMenuItemDetails(this.productId).subscribe(function (data) {
                    console.log(data);
                    _this.productDetails = data;
                    var details = _this.productDetails;
                    _this.initPrice = _this.productDetails.price;
                    var dec = Object.keys(_this.productDetails.declinaisons);
                    var goodDec = [];
                    for (var _i = 0, dec_2 = dec; _i < dec_2.length; _i++) {
                        var d = dec_2[_i];
                        goodDec.push(_this.productDetails.declinaisons[d]);
                    }
                    _this.productDetails.declinaisons = goodDec;
                    _this.product.productId = details.id;
                    _this.product.name = details.name;
                    _this.product.price = details.price;
                    _this.product.imageUrl = details.image;
                    console.log(_this.productDetails);
                });
            }
            loader.dismiss();
        }
        this.checkFavourite();
    };
    ProductDetailsPage.prototype.addToCart = function (productId) {
        /***BUG si on delet eun item du panier qu'on revient sur la page avec la fleche retour arrière et qu'on ajoute à ouveau cet item, le contenu précédemment effacé et de
        nouveau dans le panier***/
        //Contenu de variable non remis à zéro, variable itemInCart gade le contenu de l'ancien panier et variable product//
        var _this = this;
        /******BUG si on ajoute un produit on ajoute un autre et qu'on veut à nouveau ajouter le produit précédent, il se retrouve effacé du panier*****/
        ////RESOLU/////
        /* console.log(productId);
         if(this.productIsAlreadyInCart(this.product)){
             console.log("produit déjà présent");
             for(var i of this.product.declinaison){
                 if(productId == i.combination.id){
                     console.log("BUG OK ");
                 }
             }
         }*/
        console.log(this.itemInCart);
        console.log(this.product);
        console.log(this.declinaison);
        if (!this.declinaison) {
            /**Affiche un message d'erreur indiquant qu'il faut sélectionner une déclinaison avant d'ajouter un produit au panier**/
            var alert_1 = this.alertCtrl.create({
                title: "Please!",
                subTitle: "Veuillez sélectionner une déclinaison avant de passer commande",
                buttons: ['OK']
            });
            alert_1.present();
        }
        else {
            //this.declinaison.endPrice = parseFloat(this.product.price) + parseFloat(this.declinaison.combination.price);
            //this.declinaison.endPrice = parseFloat(this.product.price) + parseFloat(this.declinaison.combination.price);
            var id = this.declinaison.combination.id;
            var index = this.productDetails.declinaisons.findIndex(function (elem) {
                return elem.id === id;
            });
            this.declinaison.endPrice = parseFloat(this.productDetails.declinaisons[index].price);
            console.log(this.declinaison.endPrice);
            this.storage.get('cart').then(function (val) {
                console.log(val);
                _this.Cart = val;
                //this.Cart = JSON.parse(localStorage.getItem("cartItem"));
                /**Si le panier est vide**/
                if (_this.Cart == null) {
                    _this.product.quantity = _this.count;
                    for (var _i = 0, _a = _this.productDetails.declinaisons; _i < _a.length; _i++) {
                        var i = _a[_i];
                        if (_this.declinaison.combination.id === i.id) {
                            _this.declinaison.name = i.name;
                            break;
                        }
                    }
                    _this.declinaison.selectedQuantity = _this.count;
                    //***Correction du second bug***//
                    //On vérifie si le produit possède déjà la déclinaison que l'on souhaite ajouter
                    /*var dec = this.declinaison.combination.id;
                    var decAlreadyExist = this.product.declinaison.findIndex(function(elem){
                        return elem.combination.id == dec;
                    });
    
                    if(decAlreadyExist>=0)
                        this.product.declinaison.splice(0,this.product.declinaison.length);
    
                    this.product.declinaison.push(this.declinaison);
    
                    var prod = this.product;
                    var prodAlreadyExist = this.itemInCart.findIndex(function(elem){
                        return prod.productId == elem.productId;
                    });
    
                    if(prodAlreadyExist>=0)
                        this.itemInCart[prodAlreadyExist] = this.product;
                    else
                        this.itemInCart.push(this.product);*/
                    //*** ***//
                    //Marche absolument pareil que le code au dessus
                    //On enlève le contenu des déclinaisons pour la variable produit et ajoute seulement celle qui nous intéresse
                    //Même principe pour itemInCart sauf que c'est avec les produits
                    _this.product.declinaison.splice(0, _this.product.declinaison.length);
                    _this.product.declinaison.push(_this.declinaison);
                    _this.itemInCart.splice(0, _this.itemInCart.length);
                    _this.itemInCart.push(_this.product);
                    //localStorage.setItem('cartItem', JSON.stringify(this.itemInCart));
                    _this.storage.set('cart', _this.itemInCart);
                    _this.createToaster("Successfully added to cart!", 2000);
                }
                else {
                    /**Sinon on récupère l'item seulement l'item qui nous intéresse àcl'intérieur du panier**/
                    var itemInCart = void 0;
                    for (var i_1 = 0; i_1 <= _this.Cart.length - 1; i_1++) {
                        //****BUg vient surement de ce bout de code et de la ligne 211 this.Cart.push(this.product);****///
                        if (_this.Cart[i_1].productId == productId) {
                            itemInCart = _this.Cart[i_1];
                            _this.Cart.splice(i_1, 1);
                            break;
                        }
                    }
                    var decQuantity = 0;
                    //Si l'item est déjà dans le panier
                    if (itemInCart) {
                        /**Vérifie que la déclinaison a déjà été ajoutée pour le produit**/
                        var id = _this.declinaison.combination.id;
                        var verifPresenceDeclinaison = itemInCart.declinaison.find(function (elem) {
                            return elem.combination.id === id;
                        });
                        if (verifPresenceDeclinaison) {
                            for (var i_2 = 0; i_2 < itemInCart.declinaison.length; i_2++) {
                                if (itemInCart.declinaison[i_2].combination.id === _this.declinaison.combination.id) {
                                    decQuantity = itemInCart.declinaison[i_2].selectedQuantity + _this.count;
                                    itemInCart.declinaison.splice(i_2, 1);
                                }
                            }
                            /**Supprime les anciennes valeurs de la déclinaison de l'élément produit**/
                            var indexOfDec = _this.product.declinaison.findIndex(function (elem) {
                                return elem.combination.id === id;
                            });
                            if (indexOfDec >= 0) {
                                _this.product.declinaison.splice(indexOfDec, 1);
                            }
                        }
                        else {
                            decQuantity = _this.count;
                        }
                        var _loop_1 = function (i_3) {
                            if (!_this.product.declinaison.find(function (elem) {
                                return elem.combination.id === i_3.combination.id;
                            })) {
                                _this.product.declinaison.push(i_3);
                            }
                        };
                        /***Correction du bug !?! à tester**/
                        for (var _b = 0, _c = itemInCart.declinaison; _b < _c.length; _b++) {
                            var i_3 = _c[_b];
                            _loop_1(i_3);
                        }
                    }
                    else {
                        decQuantity = _this.count;
                    }
                    if (_this.declinaison.combination.quantity >= decQuantity) {
                        if (itemInCart) {
                            _this.product.quantity = itemInCart.quantity + _this.count;
                        }
                        else {
                            _this.product.quantity = decQuantity;
                        }
                        _this.declinaison.selectedQuantity = decQuantity;
                        for (var _d = 0, _e = _this.productDetails.declinaisons; _d < _e.length; _d++) {
                            var i = _e[_d];
                            if (_this.declinaison.combination.id === i.id) {
                                _this.declinaison.name = i.name;
                                break;
                            }
                        }
                        _this.product.declinaison.push(_this.declinaison);
                        _this.Cart.push(_this.product);
                        //localStorage.setItem("cartItem",JSON.stringify(this.Cart));
                        _this.storage.set('cart', _this.Cart);
                        _this.createToaster("Successfully added to cart!", 2000);
                    }
                    else {
                        var alert_2 = _this.alertCtrl.create({
                            title: 'Quantity error',
                            subTitle: 'Available quantity is ' + _this.declinaison.combination.quantity + ", and you are currently asking for a quantity of " + decQuantity,
                            buttons: ['OK']
                        });
                        alert_2.present();
                    }
                    /**Vérifie que la quantité déjà présente dans le panier + la nouvelle quanité ne dépasse pas la quantité totale du produit**/
                    /* if(this.declinaison.combination.quantity >= itemInCart.quantity + this.count){
                         this.product.quantity = itemInCart.quantity + this.count;
                         this.declinaison.selectedQuantity = decQuantity;
                         this.product.declinaison.push(this.declinaison);
     
                         for(var i of this.productDetails.declinaisons){
                             if(this.declinaison.combination.id===i.id){
                                 this.product.declinaisonName = i.name;
                                 break;
                             }
                         }
                         console.log("Dans le panier : "+this.product.quantity);
                         this.Cart.push(this.product);
                         localStorage.setItem("cartItem",JSON.stringify(this.Cart));
                     }else{
                         let alert = this.alertCtrl.create({
                             title: 'Quantity error',
                             subTitle: 'Available quantity is '+this.declinaison.combination.quantity+", and you are currently asking for a quantity of "+(itemInCart.quantity+this.count),
                             buttons: ['OK']
                         });
                         alert.present();
                     }*/
                }
            });
        }
        /*if (this.product.sizeOption.value == null) {
            let alert = this.alertCtrl.create({
                title: 'Please!',
                subTitle: 'Select Size and Price!',
                buttons: ['OK']
            });
            alert.present();
        }
        else {
            this.Cart = JSON.parse(localStorage.getItem("cartItem"));
            if (this.Cart == null) {
                this.product.Quantity = this.count;
                if (this.product.sizeOption.specialPrice) {
                    this.product.itemTotalPrice = this.product.Quantity * this.product.sizeOption.specialPrice;
                } else {
                    this.product.itemTotalPrice = this.product.Quantity * this.product.sizeOption.value;
                }
                let proExtraPrice = 0;
                for (let i = 0; i <= this.product.extraOption.length - 1; i++) {
                    proExtraPrice = proExtraPrice + Number(this.product.extraOption[i].selected);
                    this.product.extraPrice = proExtraPrice;
                }

                this.itemInCart.push(this.product);
                localStorage.setItem('cartItem', JSON.stringify(this.itemInCart));

            }
            else {

                for (let i = 0; i <= this.Cart.length - 1; i++) {
                    if (this.Cart[i].productId == productId && this.Cart[i].sizeOption.pname==this.product.sizeOption.pname) {
                        this.Cart.splice(i, 1);

                    }
                }
                this.product.Quantity = this.count;
                if (this.product.sizeOption.specialPrice) {
                    this.product.itemTotalPrice = this.product.Quantity * this.product.sizeOption.specialPrice;
                } else {
                    this.product.itemTotalPrice = this.product.Quantity * this.product.sizeOption.value;
                }
                let proExtraPrice = 0;
                for (let i = 0; i <= this.product.extraOption.length - 1; ++i) {
                    proExtraPrice = proExtraPrice + Number(this.product.extraOption[i].selected);
                    this.product.extraPrice = proExtraPrice;
                }

                this.Cart.push(this.product);
                localStorage.setItem('cartItem', JSON.stringify(this.Cart));
            }
            this.navCtrl.push("CartPage");

        }*/
    };
    ProductDetailsPage.prototype.checkOptions = function (option) {
        if (this.product.extraOption.length !== 0) {
            for (var i = 0; i <= this.product.extraOption.length - 1; i++) {
                if (this.product.extraOption[i].name == option.name) {
                    this.product.extraOption.splice(i, 1);
                    break;
                }
                else {
                    this.product.extraOption.push(option);
                    break;
                }
            }
        }
        else {
            this.product.extraOption.push(option);
        }
    };
    /*sizeOptions(price) {
        this.product.sizeOption = price;
    }*/
    ProductDetailsPage.prototype.add = function () {
        //Non prise en compte de la quantité des déclinaisons
        console.log(this.checkQuantityInCart()); // à revoir, chaque appuie sur le bouton "+" le panier est parcouru
        console.log(this.quantity - this.quantityInCart);
        if (this.quantity > 0 && this.count < (this.quantity - this.quantityInCart)) {
            this.count = this.count + 1;
        }
        else if (this.quantity < 0) {
            var alert_3 = this.alertCtrl.create({
                title: "Please!",
                subTitle: "Veuillez d'abord chosiir une déclinaison",
                buttons: ['OK']
            });
            alert_3.present();
        }
    };
    ProductDetailsPage.prototype.checkQuantityInCart = function () {
        //let productInCart = JSON.parse(localStorage.getItem('cartItem'));
        var productInCart;
        this.storage.get('cart').then(function (val) {
            productInCart = val;
        });
        if (productInCart) {
            for (var _i = 0, productInCart_1 = productInCart; _i < productInCart_1.length; _i++) {
                var product = productInCart_1[_i];
                if (this.productDetails.id === product.productId) {
                    this.quantityInCart = product.quantity;
                    console.log("quantity already in cart = " + this.quantityInCart);
                    return true;
                }
            }
        }
        return false;
    };
    ProductDetailsPage.prototype.remove = function () {
        if (this.count > 1) {
            this.count = this.count - 1;
        }
    };
    ProductDetailsPage.prototype.home = function () {
        this.navCtrl.push("HomePage");
    };
    ProductDetailsPage.prototype.navcart = function () {
        this.navCtrl.push("CartPage", {
            product: this.navParams.get('product')
        });
    };
    ProductDetailsPage.prototype.toggleFavourite = function () {
        this.visible = !this.visible;
    };
    ProductDetailsPage.prototype.addToFavourite = function (productId) {
        var _this = this;
        console.log("addFavourite appelé : " + this.productId);
        this.storage.get('user').then(function (val) {
            var user = val;
            if (user && user.token) {
                _this.storage.get('favourite').then(function (val) {
                    // favouriteList.push(productId);
                    var favouriteList = val;
                    if (favouriteList) {
                    }
                    else {
                        favouriteList = [];
                        favouriteList.push(productId);
                    }
                    _this.storage.set('favourite', favouriteList);
                    _this.productDetailsService.addToFavourite(productId, 1, user.id_customer, 1).subscribe(function (data) {
                        console.log(data);
                    });
                    _this.like = true;
                });
            }
            else {
                _this.createToaster('Please login first!', 3000);
            }
        });
    };
    ProductDetailsPage.prototype.removeFromFavourite = function (productId) {
        var _this = this;
        this.storage.get('user').then(function (val) {
            var user = val;
            if (user.token) {
                _this.storage.get('favourite').then(function (val) {
                    var favouriteList = val;
                    if (favouriteList.length == 1)
                        _this.storage.remove('favourite');
                    else {
                        for (var i = 0; i < favouriteList.length; i++) {
                            if (favouriteList[i] == productId) {
                                favouriteList.splice(i, 1);
                            }
                        }
                        _this.storage.set('favourite', favouriteList);
                    }
                    _this.productDetailsService.removeFromFavourite(productId, 1, user.id_customer).subscribe(function (data) {
                        console.log(data);
                    });
                    _this.like = false;
                });
            }
        });
    };
    /*addToFavourite(productId) {
        console.log("addFavourite appelé : "+this.productId);
        var user: any = {};
        this.storage.get('user').then((val) => {
            console.log(val);
            user = val;
        })
        console.log(user);
        //if(JSON.parse(localStorage.getItem('user')).token){
         if(user && user.token){
            //var favouriteList: any[] = JSON.parse(localStorage.getItem('favourite'));
            var favouriteList = null;
            this.storage.get('favourite').then((val) => {
                favouriteList = val;
            })
            if(favouriteList){
                favouriteList.push(productId);
            }else{
                favouriteList = [];
                favouriteList.push(productId);
            }
            //localStorage.setItem('favourite', JSON.stringify(favouriteList));
            this.storage.set('favourite',favouriteList);
            this.productDetailsService.addToFavourite(productId,1,1,"d5f1da826483ec93e23dabb4c6d10539").subscribe(data => {
                console.log(data);
            })
            this.like = true;
        }else{
            this.createToaster('Please login first!', 3000);
        }
    }*/
    /* removeFromFavourite(productId) {
         console.log("productId"+productId);
         var user = null;
         this.storage.get('user').then((val) => {
             user = val;
         })
         //if (JSON.parse(localStorage.getItem('user')).token) {
         if(user.token){
             //var favouriteList: any [] = JSON.parse(localStorage.getItem('favourite'));
             var favouriteList = null;
             this.storage.get('favourite').then((val)=>{
                 favouriteList = val;
             })
             if(favouriteList.length == 1)
                 this.storage.remove('favourite');
                 //localStorage.removeItem('favourite');
             else{
                 for(var i=0; i<favouriteList.length;i++){
                     console.log(favouriteList[i]);
                     if(favouriteList[i] == productId){
                         console.log("if ok");
                         favouriteList.splice(i,1);
                     }
                 }
                 console.log(favouriteList);
                 //localStorage.setItem('favourite',JSON.stringify(favouriteList));
                 this.storage.set('favourite',favouriteList);
             }
             this.like = false;
         }
     }*/
    ProductDetailsPage.prototype.checkFavourite = function () {
        var _this = this;
        console.log("checkFavourite appele");
        this.storage.get('user').then(function (userData) {
            if (userData && userData.token) {
                _this.productDetailsService.getFavouriteList(userData.id_customer).subscribe(function (data) {
                    console.log(data);
                    if (data && data.length > 0) {
                        var idProduct = _this.productId;
                        _this.like = data.find(function (elem) {
                            return elem.id_product == idProduct;
                        });
                    }
                });
                /*this.storage.get('favourite').then((val)=>{
                    var favouriteList = val;
                    var idProduct = this.productId;
                    console.log(this.productId);
                    if(favouriteList){
                        this.like = favouriteList.find(function(elem){
                            return elem == idProduct;
                        })
                    }
                })*/
            }
        });
    };
    ProductDetailsPage.prototype.createToaster = function (message, duration) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
    };
    ProductDetailsPage.prototype.changerImagePrincipale = function (image) {
        this.productDetails.image = image;
    };
    ProductDetailsPage.prototype.getCorrespondingCombination = function () {
        var _this = this;
        console.log("getCorrespondingCombination()" + this.id_declinaisons);
        /* this.productDetailsService.getDeclinaisons(this.id_declinaisons).subscribe(res => {
             console.log("ok");
         })*/
        this.productDetailsService.getDeclinaisons(this.id_declinaisons)
            .subscribe(function (res) {
            _this.declinaison = res;
            console.log(_this.declinaison.combination.quantity);
            _this.updatePrice(res.combination.unit_price_impact);
            _this.updateQuantity(res.combination.quantity);
            console.log("declinaisons ok");
            console.log(res);
            console.log(res.combination.unit_price_impact);
        });
    };
    ProductDetailsPage.prototype.updatePrice = function (price) {
        if (price != 0) {
            var productPrice = this.productDetails.price;
            this.productDetails.price = parseFloat(productPrice) + parseFloat(price);
        }
        else {
            this.productDetails.price = this.initPrice;
        }
    };
    ProductDetailsPage.prototype.updateQuantity = function (quantity) {
        console.log("Quantité : " + quantity);
        if (quantity >= 0) {
            this.quantity = quantity;
        }
    };
    ProductDetailsPage.prototype.productIsAlreadyInCart = function (product) {
        var cart = JSON.parse(localStorage.getItem('cartItem'));
        if (!cart)
            return false;
        for (var _i = 0, cart_1 = cart; _i < cart_1.length; _i++) {
            var item = cart_1[_i];
            if (item.productId == product.productId) {
                var _loop_2 = function (declinaison) {
                    test = product.declinaison.find(function (elem) {
                        return declinaison.combination.id === elem.combination.id;
                    });
                    if (test) {
                        return { value: true };
                    }
                };
                var test;
                for (var _a = 0, _b = item.declinaison; _a < _b.length; _a++) {
                    var declinaison = _b[_a];
                    var state_1 = _loop_2(declinaison);
                    if (typeof state_1 === "object")
                        return state_1.value;
                }
            }
        }
        return false;
    };
    ProductDetailsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-product-details',
            templateUrl: 'product-details.html',
            providers: [Service, ProductDetailsService]
        }),
        __metadata("design:paramtypes", [NavController,
            LoadingController,
            AlertController,
            ToastController,
            NavParams,
            Storage,
            Service,
            ProductDetailsService])
    ], ProductDetailsPage);
    return ProductDetailsPage;
}());
export { ProductDetailsPage };
//# sourceMappingURL=product-details.js.map