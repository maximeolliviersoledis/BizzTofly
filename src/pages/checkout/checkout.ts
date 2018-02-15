import {Component} from '@angular/core';
import {NavController, NavParams, IonicPage, LoadingController,AlertController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {CheckoutService} from './checkout.service';
import {PayPal, PayPalPayment, PayPalConfiguration} from '@ionic-native/paypal';
import {Stripe} from '@ionic-native/stripe';
import {UserService } from '../../providers/user-service';


const payPalEnvironmentSandbox = 'AcgkbqWGamMa09V5xrhVC8bNP0ec9c37DEcT0rXuh7hqaZ6EyHdGyY4FCwQC-fII-s5p8FL0RL8rWPRB';
const publishableKey = 'pk_test_mhy46cSOzzKYuB2MuTWuUb34';
const stripe_secret_key = 'sk_test_GsisHcPqciYyG8arVfVe2amE';

@IonicPage()
@Component({
    selector: 'page-checkout',
    templateUrl: 'checkout.html',
    providers: [CheckoutService, PayPal, Stripe]
})
export class CheckoutPage {
    orderDetails: any = {};
    orderData: any = {
        address: {},
        cardDetails: {},
        status: 'pending'
    };
    showCradBlock: boolean = false;
    paymentDetails: any = {
        paymentStatus: true
    };
    cardInfo: any = {};
    public userId:'';

    public paymentTypes: any = [
                    {'default': true,'type': 'PayPal','value': 'paypal','logo': 'assets/img/paypal_logo.jpg'},
                    {'default': false, 'type': 'Stripe', 'value': 'stripe', 'logo': 'assets/img/stripe.png'},
                    {'default': false, 'type': 'COD', 'value': 'cod', 'logo': ''}];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private userService:UserService,
                public checkoutService: CheckoutService,
                public loadingCtrl: LoadingController,
                public alertCtrl:AlertController,
                public payPal: PayPal,
                public stripe: Stripe) {

             this.orderData = this.navParams.get('orderData');
             console.log("order-data-"+JSON.stringify(this.orderData));
    }

    ngOnInit() {
        this.orderData.paymentOption = 'PayPal';
        this.userService.getUser().subscribe(user=>{
        this.userId=user._id;
        })
    }

    choosePaymentType(paymentType){
     this.orderData.paymentOption=paymentType;
     this.paymentDetails.paymentType=paymentType;
    }

    checkout(orderDetails: NgForm) {
        if (this.orderData.paymentOption == 'PayPal') {
            const config = {
                PayPalEnvironmentProduction: '',
                PayPalEnvironmentSandbox: payPalEnvironmentSandbox
            }
            //console.log("order-obj-" + JSON.stringify(this.orderData));
            this.checkoutService.placeOrder(this.orderData)
                .subscribe(order => {
                    //console.log("order-" + JSON.stringify(order));
                    this.payPal.init(config).then(() => {
                        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({})).then(() => {
                            let payment = new PayPalPayment(this.orderData.grandTotal, 'USD', 'Description', 'sale');
                            this.payPal.renderSinglePaymentUI(payment).then((success) => {
                                //this.paypalPayments =success;
                                //console.log("payment_response-" + JSON.stringify(success));
                                this.paymentDetails.transactionId = success.response.id;
                                this.savePaymentData(order._id, this.paymentDetails);
                            }, (error) => {
                                console.error(error);
                            });
                        }, (error) => {
                            console.error(error);
                        })
                    }, (error) => {
                        console.error(error);
                    })
                })
        } else if (this.orderData.paymentOption == 'Stripe') {

            if(this.orderData.grandTotal >= 50){

            let loader = this.loadingCtrl.create({
                content: 'please wait..'
            })
            loader.present();
            this.checkoutService.placeOrder(this.orderData)
                .subscribe(order => {
                    this.stripe.setPublishableKey(publishableKey);
                    let card = {
                        number: this.cardInfo.cardNumber,
                        expMonth: this.cardInfo.expiryMonth,
                        expYear: this.cardInfo.expiryYear,
                        cvc: this.cardInfo.cvc
                    };
                    this.stripe.createCardToken(card)
                          .then(token => {
                        let stripe_token: any = token;
                        if (token) {
                            //console.log("source-token_"+JSON.stringify(stripe_token));
                            this.checkoutService.chargeStripe(stripe_token.id, "USD", Math.round(this.orderData.grandTotal), stripe_secret_key)
                                    .then((result) => {
                                        //console.log("stripe-result-"+JSON.stringify(result));
                                        let res: any = result;
                                        this.paymentDetails.transactionId = res.balance_transaction;
                                        loader.dismiss();
                                        this.cardInfo = '';
                                        this.savePaymentData(order._id, this.paymentDetails);
                                    }, error => {
                                       // console.log("error-"+JSON.stringify(error));
                                        loader.dismiss();
                                    });
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            loader.dismiss();
                            this.showAlert(error);
                        });
                }, error => {
                    loader.dismiss();
                })
        } else {
            
            this.showAlert('Amount should be greater than $50.');
        }
        } else {
            this.placeOrder();
        }

    }

    placeOrder() {
        let loader = this.loadingCtrl.create({
            content: 'please wait'
        })
        loader.present();
        this.checkoutService.placeOrder(this.orderData)
            .subscribe(order => {
                //console.log("order_placed-"+JSON.stringify(order));
                loader.dismiss();
                this.saveLoyaltyData(order.orderID);
                localStorage.removeItem('cartItem');
                this.navCtrl.setRoot("ThankyouPage");
            }, error => {
                loader.dismiss();
            })
    }

    savePaymentData(orderId, paymentDetails) {
        this.checkoutService.savePaymentDetails(orderId, paymentDetails)
            .subscribe(response => {
                this.saveLoyaltyData(orderId);
                //console.log("payment-"+JSON.stringify(response));
                localStorage.removeItem('cartItem');
                this.navCtrl.setRoot("ThankyouPage");
            },error=>{
               console.log("payment-errorr-"+JSON.stringify(error)); 
            })
    }

    saveLoyaltyData(orderId){
             if(this.orderData.appliedLoyalty){
                let   loyaltyData = {
                       credit:false,
                       points:this.orderData.loyaltyPoints,
                       orderId:orderId,
                       dateAndTime:Date.now()
                     };
                this.checkoutService.saveLoyaltyPoints(this.userId,loyaltyData)
                .subscribe(result=>{
                    //console.log("loalty_result-"+JSON.stringify(result));
                })
                 }
    }

    showAlert(message){
      let alert = this.alertCtrl.create({
        subTitle: message,
        buttons: ['OK']
      });
      alert.present();
   }


}
