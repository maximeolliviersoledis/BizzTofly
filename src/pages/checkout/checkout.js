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
import { NavController, NavParams, IonicPage, LoadingController, AlertController } from 'ionic-angular';
import { CheckoutService } from './checkout.service';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import { Stripe } from '@ionic-native/stripe';
import { UserService } from '../../providers/user-service';
var payPalEnvironmentSandbox = 'AcgkbqWGamMa09V5xrhVC8bNP0ec9c37DEcT0rXuh7hqaZ6EyHdGyY4FCwQC-fII-s5p8FL0RL8rWPRB';
var publishableKey = 'pk_test_mhy46cSOzzKYuB2MuTWuUb34';
var stripe_secret_key = 'sk_test_GsisHcPqciYyG8arVfVe2amE';
var CheckoutPage = /** @class */ (function () {
    function CheckoutPage(navCtrl, navParams, userService, checkoutService, loadingCtrl, alertCtrl, payPal, stripe) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.userService = userService;
        this.checkoutService = checkoutService;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.payPal = payPal;
        this.stripe = stripe;
        this.orderDetails = {};
        this.orderData = {
            address: {},
            cardDetails: {},
            status: 'pending'
        };
        this.showCradBlock = false;
        this.paymentDetails = {
            paymentStatus: true
        };
        this.cardInfo = {};
        this.paymentTypes = [
            { 'default': true, 'type': 'PayPal', 'value': 'paypal', 'logo': 'assets/img/paypal_logo.jpg' },
            { 'default': false, 'type': 'Stripe', 'value': 'stripe', 'logo': 'assets/img/stripe.png' },
            { 'default': false, 'type': 'COD', 'value': 'cod', 'logo': '' }
        ];
        this.orderData = this.navParams.get('orderData');
        console.log("order-data-" + JSON.stringify(this.orderData));
    }
    CheckoutPage.prototype.ngOnInit = function () {
        var _this = this;
        this.orderData.paymentOption = 'PayPal';
        this.userService.getUser().subscribe(function (user) {
            _this.userId = user._id;
        });
    };
    CheckoutPage.prototype.choosePaymentType = function (paymentType) {
        this.orderData.paymentOption = paymentType;
        this.paymentDetails.paymentType = paymentType;
    };
    CheckoutPage.prototype.checkout = function (orderDetails) {
        var _this = this;
        if (this.orderData.paymentOption == 'PayPal') {
            var config_1 = {
                PayPalEnvironmentProduction: '',
                PayPalEnvironmentSandbox: payPalEnvironmentSandbox
            };
            //console.log("order-obj-" + JSON.stringify(this.orderData));
            this.checkoutService.placeOrder(this.orderData)
                .subscribe(function (order) {
                //console.log("order-" + JSON.stringify(order));
                _this.payPal.init(config_1).then(function () {
                    _this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({})).then(function () {
                        var payment = new PayPalPayment(_this.orderData.grandTotal, 'USD', 'Description', 'sale');
                        _this.payPal.renderSinglePaymentUI(payment).then(function (success) {
                            //this.paypalPayments =success;
                            //console.log("payment_response-" + JSON.stringify(success));
                            _this.paymentDetails.transactionId = success.response.id;
                            _this.savePaymentData(order._id, _this.paymentDetails);
                        }, function (error) {
                            console.error(error);
                        });
                    }, function (error) {
                        console.error(error);
                    });
                }, function (error) {
                    console.error(error);
                });
            });
        }
        else if (this.orderData.paymentOption == 'Stripe') {
            if (this.orderData.grandTotal >= 50) {
                var loader_1 = this.loadingCtrl.create({
                    content: 'please wait..'
                });
                loader_1.present();
                this.checkoutService.placeOrder(this.orderData)
                    .subscribe(function (order) {
                    _this.stripe.setPublishableKey(publishableKey);
                    var card = {
                        number: _this.cardInfo.cardNumber,
                        expMonth: _this.cardInfo.expiryMonth,
                        expYear: _this.cardInfo.expiryYear,
                        cvc: _this.cardInfo.cvc
                    };
                    _this.stripe.createCardToken(card)
                        .then(function (token) {
                        var stripe_token = token;
                        if (token) {
                            //console.log("source-token_"+JSON.stringify(stripe_token));
                            _this.checkoutService.chargeStripe(stripe_token.id, "USD", Math.round(_this.orderData.grandTotal), stripe_secret_key)
                                .then(function (result) {
                                //console.log("stripe-result-"+JSON.stringify(result));
                                var res = result;
                                _this.paymentDetails.transactionId = res.balance_transaction;
                                loader_1.dismiss();
                                _this.cardInfo = '';
                                _this.savePaymentData(order._id, _this.paymentDetails);
                            }, function (error) {
                                // console.log("error-"+JSON.stringify(error));
                                loader_1.dismiss();
                            });
                        }
                    })
                        .catch(function (error) {
                        console.log(error);
                        loader_1.dismiss();
                        _this.showAlert(error);
                    });
                }, function (error) {
                    loader_1.dismiss();
                });
            }
            else {
                this.showAlert('Amount should be greater than $50.');
            }
        }
        else {
            this.placeOrder();
        }
    };
    CheckoutPage.prototype.placeOrder = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: 'please wait'
        });
        loader.present();
        this.checkoutService.placeOrder(this.orderData)
            .subscribe(function (order) {
            //console.log("order_placed-"+JSON.stringify(order));
            loader.dismiss();
            _this.saveLoyaltyData(order.orderID);
            localStorage.removeItem('cartItem');
            _this.navCtrl.setRoot("ThankyouPage");
        }, function (error) {
            loader.dismiss();
        });
    };
    CheckoutPage.prototype.savePaymentData = function (orderId, paymentDetails) {
        var _this = this;
        this.checkoutService.savePaymentDetails(orderId, paymentDetails)
            .subscribe(function (response) {
            _this.saveLoyaltyData(orderId);
            //console.log("payment-"+JSON.stringify(response));
            localStorage.removeItem('cartItem');
            _this.navCtrl.setRoot("ThankyouPage");
        }, function (error) {
            console.log("payment-errorr-" + JSON.stringify(error));
        });
    };
    CheckoutPage.prototype.saveLoyaltyData = function (orderId) {
        if (this.orderData.appliedLoyalty) {
            var loyaltyData = {
                credit: false,
                points: this.orderData.loyaltyPoints,
                orderId: orderId,
                dateAndTime: Date.now()
            };
            this.checkoutService.saveLoyaltyPoints(this.userId, loyaltyData)
                .subscribe(function (result) {
                //console.log("loalty_result-"+JSON.stringify(result));
            });
        }
    };
    CheckoutPage.prototype.showAlert = function (message) {
        var alert = this.alertCtrl.create({
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    };
    CheckoutPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-checkout',
            templateUrl: 'checkout.html',
            providers: [CheckoutService, PayPal, Stripe]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            UserService,
            CheckoutService,
            LoadingController,
            AlertController,
            PayPal,
            Stripe])
    ], CheckoutPage);
    return CheckoutPage;
}());
export { CheckoutPage };
//# sourceMappingURL=checkout.js.map