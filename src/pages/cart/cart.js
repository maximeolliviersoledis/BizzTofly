var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { IonicPage, AlertController, NavParams, NavController, PopoverController, ToastController } from "ionic-angular";
import { CartService } from './cart.service';
import { Storage } from '@ionic/storage';
var CartPage = /** @class */ (function () {
    function CartPage(navCtrl, navParams, alertCtrl, popoverCtrl, toastCtrl, cartService, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.popoverCtrl = popoverCtrl;
        this.toastCtrl = toastCtrl;
        this.cartService = cartService;
        this.storage = storage;
        this.taxAmount = 0;
        this.couponDiscount = 0;
        this.promotion = [];
        this.cartData = {};
        console.log(navParams.get('product'));
        //this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
    }
    CartPage.prototype.ngOnInit = function () {
        var _this = this;
        console.log("ngOnInit() panier appelé");
        this.storage.get('cart').then(function (data) {
            _this.cartItems = data;
            if (_this.cartItems != null) {
                console.log(_this.cartItems);
                _this.noOfItems = _this.cartItems.length;
                _this.cartService.getCoupons().subscribe(function (coupons) {
                    _this.coupons = coupons;
                    _this.getPromotion();
                    console.log(_this.promotion);
                    _this.calculatePrice();
                });
            }
        });
    };
    /*deleteItem(data) {
        for (let i = 0; i <= this.cartItems.length - 1; i++) {
            if (this.cartItems[i].productId == data.productId && this.cartItems[i].sizeOption.pname==data.sizeOption.pname) {
                this.cartItems.splice(i, 1);
            }
        }
        if (this.cartItems.length == 0) {
            localStorage.removeItem('cartItem');
            this.noOfItems = null;
        } else {
            this.calculatePrice();
            localStorage.setItem('cartItem', JSON.stringify(this.cartItems));
            this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
            this.noOfItems = this.noOfItems - 1;
        }
        this.applyCoupon();
    }*/
    CartPage.prototype.deleteItem = function (data) {
        var _this = this;
        console.log(data);
        for (var i = 0; i < this.cartItems.length; i++) {
            for (var j = 0; j < this.cartItems[i].declinaison.length; j++) {
                if (this.cartItems[i].declinaison[j].combination.id == data.combination.id && this.cartItems[i].declinaison[j].name == data.name) {
                    this.cartItems[i].declinaison.splice(j, 1);
                }
            }
            if (this.cartItems[i].declinaison == 0) {
                this.cartItems.splice(i, 1);
            }
        }
        if (this.cartItems.length == 0) {
            //localStorage.removeItem('cartItem');
            this.storage.remove('cart');
            this.noOfItems = null;
        }
        else {
            this.calculatePrice();
            //localStorage.setItem('cartItem', JSON.stringify(this.cartItems));
            this.storage.set('cart', this.cartItems);
            //this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
            this.storage.get('cart').then(function (data) {
                _this.cartItems = data;
            });
            this.noOfItems = this.noOfItems - 1;
        }
        this.applyCoupon();
        //this.applyReduction();
    };
    CartPage.prototype.applyCoupon = function () {
        var subTotals = this.subTotalPrice;
        this.deductedPrice = Number((this.couponDiscount / 100 * subTotals).toFixed(2));
        subTotals = subTotals - this.deductedPrice;
        this.grandTotal = Number((subTotals + this.taxAmount).toFixed(2));
        //this.createToaster('Coupon applied successfully', '3000');
    };
    //Système de promotion(réduction brut et pourcentage) fonctionnel mais usine à gaz
    CartPage.prototype.applyReduction = function () {
        console.log("Prix avant réduction = " + this.subTotalPrice);
        for (var _i = 0, _a = this.cartItems; _i < _a.length; _i++) {
            var item = _a[_i];
            for (var _b = 0, _c = item.declinaison; _b < _c.length; _b++) {
                var declinaison = _c[_b];
                for (var _d = 0, _e = this.promotion; _d < _e.length; _d++) {
                    var promo = _e[_d];
                    console.log("Promo en cours : " + promo.specific_price.id);
                    if (promo.specific_price.id_product == item.productId && promo.specific_price.id_product_attribute == declinaison.combination.id) {
                        console.log("Réduction pour la déclinaison " + declinaison.name);
                        if (declinaison.selectedQuantity >= promo.specific_price.from_quantity && promo.specific_price.reduction_type == "amount") {
                            console.log("Réduction déclinaison amount accepté : " + promo.specific_price.reduction);
                            this.subTotalPrice -= parseFloat(promo.specific_price.reduction);
                        }
                        else if (declinaison.selectedQuantity >= promo.specific_price.from_quantity && promo.specific_price.reduction_type == "percentage") {
                            console.log("Réduction déclinaison percent accepté : " + promo.specific_price.reduction);
                            this.subTotalPrice = this.subTotalPrice - declinaison.selectedQuantity * declinaison.endPrice; // On retire le montant avant la promo
                            this.subTotalPrice += (declinaison.selectedQuantity * declinaison.endPrice) * promo.specific_price.reduction; // On applique la réduction
                        }
                    }
                    else if (promo.specific_price.id_product == item.productId && promo.specific_price.id_product_attribute == 0) {
                        console.log("Réduction pour le produit " + item.name);
                        if (item.quantity >= promo.specific_price.from_quantity && promo.specific_price.reduction_type == "amount") {
                            console.log("Réduction produit amount accepté : " + promo.specific_price.reduction);
                            this.subTotalPrice -= parseFloat(promo.specific_price.reduction);
                        }
                        else if (item.quantity >= promo.specific_price.from_quantity && promo.specific_price.reduction_type == "percentage") {
                            console.log("Réduction produit percent accepté : " + promo.specific_price.reduction);
                            this.subTotalPrice = this.subTotalPrice - item.quantity * item.price; // On retire le montant avant la promo
                            this.subTotalPrice += (item.quantity * item.price) * promo.specific_price.reduction; // On applique la réduction
                        }
                    }
                    else {
                        console.log("Aucune promo trouvé pour le produit " + item.name);
                    }
                }
            }
        }
        console.log("Prix après réduction = " + this.subTotalPrice);
    };
    CartPage.prototype.getPromotion = function () {
        //Si aucune condition d'appliquée sur la promo, id_product = 0
        //Si une condtion est appliquée mais pas sur une catégorie, l'applique sur id_product 1 par défaut
        //Il faudrait pouvoir récupérer toutes les promos et garde seulement celles qui sont encores actives
        //Ou directement récupérer les promos atives (le serveur s'occupe du traitement)
        /*this.cartService.getSpecificPrices(54).subscribe( res => {
            console.log(res);
            this.promotion.push(res);
        })
        this.cartService.getSpecificPrices(18).subscribe( res => {
            console.log(res);
            this.promotion.push(res);
        })
        this.cartService.getSpecificPrices(35).subscribe( res => {
            console.log(res);
            this.promotion.push(res);
        })*/
    };
    /*checkout() {
      let amountDetails:any={};
       amountDetails.grandTotal=this.grandTotal;
       amountDetails.subTotal=this.subTotalPrice;
       amountDetails.tax=this.taxAmount;
       amountDetails.couponDiscount=this.couponDiscount;
       amountDetails.deductedPrice=this.deductedPrice;

      if(JSON.parse(localStorage.getItem('user')).token){
          console.log(this.cartItems);
          var panier = this.sendCart();
          var idCart = localStorage.getItem('id_cart');

          if(idCart){
              console.log(panier);
              this.cartService.putCart(idCart, panier).subscribe(data => {
                  console.log(data);
                  this.navCtrl.push("AddressListPage",{
                  amountDetails:amountDetails,
                  cartData: data
              });
              })
          }else{
            this.cartService.postCart(panier).subscribe(data => {
                console.log(data);
                this.navCtrl.push("AddressListPage",{
                amountDetails:amountDetails,
                cartData: data
              });
            })

        }
      } else {
       this.navCtrl.push("LoginPage",{
        amountDetails:amountDetails,
        flag:0
      });
     }

    }*/
    CartPage.prototype.checkout = function () {
        var _this = this;
        var amountDetails = {};
        amountDetails.grandTotal = this.grandTotal;
        amountDetails.subTotal = this.subTotalPrice;
        amountDetails.tax = this.taxAmount;
        amountDetails.couponDiscount = this.couponDiscount;
        amountDetails.deductedPrice = this.deductedPrice;
        this.storage.get('user').then(function (user) {
            if (user.token) {
                console.log(_this.cartItems);
                var panier = _this.sendCart(user.id_customer);
                var idCartData = localStorage.getItem('id_cart');
                if (idCartData) {
                    console.log(panier);
                    _this.cartService.putCart(idCartData, panier).subscribe(function (data) {
                        console.log(data);
                        _this.navCtrl.push("AddressListPage", {
                            amountDetails: amountDetails,
                            cartData: data
                        });
                    });
                }
                else {
                    _this.cartService.postCart(panier).subscribe(function (data) {
                        console.log(data);
                        _this.navCtrl.push("AddressListPage", {
                            amountDetails: amountDetails,
                            cartData: data
                        });
                    });
                }
            }
            else {
                _this.navCtrl.push("LoginPage", {
                    amountDetails: amountDetails,
                    flag: 0
                });
            }
        });
    };
    CartPage.prototype.calculatePrice = function () {
        var proGrandTotalPrice = 0;
        for (var i = 0; i <= this.cartItems.length; i++) {
            if (this.cartItems[i]) {
                for (var j = 0; j < this.cartItems[i].declinaison.length; j++) {
                    proGrandTotalPrice += this.cartItems[i].declinaison[j].selectedQuantity * this.cartItems[i].declinaison[j].endPrice;
                    console.log("proGrandtotalprice : " + proGrandTotalPrice);
                }
                this.subTotalPrice = Number(proGrandTotalPrice.toFixed(2));
                this.applyReduction();
            }
        }
        this.taxAmount = Number(((5 / 100) * this.subTotalPrice).toFixed(2));
        this.grandTotal = Number((this.subTotalPrice + this.taxAmount).toFixed(2));
        /*let proGrandTotalPrice = 0;
        for (let i = 0; i <= this.cartItems.length; i++) {
            if (this.cartItems[i] != null) {
                if (this.cartItems[i].extraPrice != null) {
                    proGrandTotalPrice = proGrandTotalPrice + this.cartItems[i].itemTotalPrice + this.cartItems[i].extraPrice;
                } else {
                    proGrandTotalPrice = proGrandTotalPrice + this.cartItems[i].itemTotalPrice;
                }
                this.subTotalPrice = Number(proGrandTotalPrice.toFixed(2));
            }
        }
        this.taxAmount = Number(((5 / 100) * this.subTotalPrice).toFixed(2));
        this.grandTotal = Number((this.subTotalPrice + this.taxAmount).toFixed(2));*/
    };
    CartPage.prototype.add = function (dataDeclinaison, dataItem) {
        //A optimiser, mets trop de temps pour seulement incrémenter la quantité de 1
        console.log(dataDeclinaison);
        console.log(dataItem);
        if (dataDeclinaison.selectedQuantity < dataDeclinaison.combination.quantity) {
            dataDeclinaison.selectedQuantity += 1;
            for (var i = 0; i < this.cartItems.length; i++) {
                if (this.cartItems[i].productId == dataItem.productId) {
                    for (var j = 0; j < this.cartItems[i].declinaison.length; j++) {
                        if (this.cartItems[i].declinaison[j].combination.id == dataDeclinaison.combination.id) {
                            this.cartItems[i].declinaison[j].selectedQuantity = dataDeclinaison.selectedQuantity;
                            this.cartItems[i].quantity += 1;
                            this.storage.set('cart', this.cartItems);
                            break;
                        }
                    }
                }
            }
        }
        else {
            var alert_1 = this.alertCtrl.create({
                title: "Quantity error!",
                subTitle: "Your are trying to get more than you can",
                buttons: ['OK']
            });
            alert_1.present();
        }
        this.calculatePrice();
        this.applyCoupon();
        // this.applyReduction();
        /*if (data.quantity < 20) {
            data.quantity = data.quantity + 1;
            for (let i = 0; i <= this.cartItems.length - 1; i++) {
                if (this.cartItems[i].productId == data.productId && this.cartItems[i].sizeOption.pname==data.sizeOption.pname) {
                    this.cartItems[i].quantity = data.quantity;
                    if (this.cartItems[i].sizeOption.specialPrice) {
                        this.cartItems[i].itemTotalPrice = (data.quantity * this.cartItems[i].sizeOption.specialPrice);
                    } else {
                        this.cartItems[i].itemTotalPrice = (data.quantity * this.cartItems[i].sizeOption.value);
                    }
                }
            }
            localStorage.setItem('cartItem', JSON.stringify(this.cartItems));
            this.calculatePrice();
            this.applyCoupon();
        }*/
    };
    CartPage.prototype.remove = function (data) {
        if (data.selectedQuantity > 1) {
            var index = this.cartItems.findIndex(function (elem) {
                return elem.productId == data.combination.id_product;
            });
            var indexOfDec = this.cartItems[index].declinaison.findIndex(function (elem) {
                return elem.combination.id == data.combination.id;
            });
            this.cartItems[index].declinaison[indexOfDec].selectedQuantity -= 1;
            //localStorage.setItem('cartItem',JSON.stringify(this.cartItems));      
            this.storage.set('cart', this.cartItems);
        }
        this.calculatePrice();
        this.applyCoupon();
        //this.applyReduction();
        /*if (data.quantity > 1) {
            data.quantity = data.quantity - 1;
            for (let i = 0; i <= this.cartItems.length - 1; i++) {
                if (this.cartItems[i].productId == data.productId && this.cartItems[i].sizeOption.pname==data.sizeOption.pname) {
                    this.cartItems[i].quantity = data.quantity;
                    if (this.cartItems[i].sizeOption.specialPrice) {
                        this.cartItems[i].itemTotalPrice = (data.quantity * this.cartItems[i].sizeOption.specialPrice);
                    } else {
                        this.cartItems[i].itemTotalPrice = (data.quantity * this.cartItems[i].sizeOption.value);
                    }
                }
            }
            localStorage.setItem('cartItem', JSON.stringify(this.cartItems));
            this.calculatePrice();
            this.applyCoupon();
        }*/
    };
    CartPage.prototype.createToaster = function (message, duration) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
    };
    CartPage.prototype.isCart = function () {
        return this.cartItems == null || this.cartItems.length == 0 ? false : true;
        //return localStorage.getItem('cartItem') == null || this.cartItems.length == 0 ? false : true;
        //return localStorage.getItem('id_cart') == null || this.cartItems.length ==0 ? false : true;
    };
    CartPage.prototype.gotoHome = function () {
        this.navCtrl.push("HomePage");
    };
    CartPage.prototype.deleteAllItem = function () {
        //Si on delete tout et qu'on fait un retour arrière avec la fléche, et qu'on ajoute un article dans le panier, les anciens aricles sont encore présents dans le panier
        this.cartItems.splice(0, this.cartItems.length);
        // localStorage.removeItem('cartItem');
        this.storage.remove('cart');
    };
    CartPage.prototype.sendCart = function (customerId) {
        var id_cart = JSON.parse(localStorage.getItem('id_cart'));
        if (id_cart) {
            console.log("panier existant");
            var modif = {
                cart: {
                    id: id_cart,
                    id_shop_group: null,
                    id_shop: null,
                    id_address_delivery: null,
                    id_address_invoice: null,
                    id_carrier: 0,
                    id_currency: 1,
                    id_customer: customerId,
                    id_guest: null,
                    id_lang: 1,
                    recyclable: null,
                    gift: null,
                    gift_message: null,
                    mobile_theme: null,
                    delivery_option: null,
                    secure_key: null,
                    allow_seperated_package: 0,
                    date_add: null,
                    date_upd: null,
                    associations: {
                        cart_rows: {
                            cart_row: []
                        }
                    }
                }
            };
            for (var _i = 0, _a = this.cartItems; _i < _a.length; _i++) {
                var items = _a[_i];
                console.log(items);
                for (var _b = 0, _c = items.declinaison; _b < _c.length; _b++) {
                    var declinaison = _c[_b];
                    console.log(declinaison);
                    var product = {};
                    product.id_product = items.productId;
                    product.id_product_attribute = declinaison.combination.id;
                    product.id_address_delivery = null;
                    product.quantity = declinaison.selectedQuantity;
                    modif.cart.associations.cart_rows.cart_row.push(product);
                }
            }
            console.log(modif);
            return modif;
        }
        else {
            console.log(customerId);
            var panier = {
                cart: {
                    id_shop_group: null,
                    id_shop: null,
                    id_address_delivery: null,
                    id_address_invoice: null,
                    id_carrier: 0,
                    id_currency: 1,
                    id_customer: customerId,
                    id_guest: null,
                    id_lang: 1,
                    recyclable: null,
                    gift: null,
                    gift_message: null,
                    mobile_theme: null,
                    delivery_option: null,
                    secure_key: null,
                    allow_seperated_package: 0,
                    date_add: null,
                    date_upd: null,
                    associations: {
                        cart_rows: {
                            cart_row: []
                        }
                    }
                }
            };
            for (var _d = 0, _e = this.cartItems; _d < _e.length; _d++) {
                var items = _e[_d];
                console.log(items);
                for (var _f = 0, _g = items.declinaison; _f < _g.length; _f++) {
                    var declinaison = _g[_f];
                    console.log(declinaison);
                    var product = {};
                    product.id_product = items.productId;
                    product.id_product_attribute = declinaison.combination.id;
                    product.id_address_delivery = null;
                    product.quantity = declinaison.selectedQuantity;
                    panier.cart.associations.cart_rows.cart_row.push(product);
                }
            }
            console.log(panier);
            return panier;
        }
    };
    CartPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-cart',
            templateUrl: 'cart.html',
            providers: [CartService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AlertController,
            PopoverController,
            ToastController,
            CartService,
            Storage])
    ], CartPage);
    return CartPage;
}());
export { CartPage };
//# sourceMappingURL=cart.js.map