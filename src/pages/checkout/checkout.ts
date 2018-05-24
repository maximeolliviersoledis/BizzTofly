import {Component} from '@angular/core';
import {NavController, NavParams, IonicPage, LoadingController,AlertController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {CheckoutService} from './checkout.service';
import {PayPal, PayPalPayment, PayPalConfiguration} from '@ionic-native/paypal';
import {Stripe} from '@ionic-native/stripe';
import {UserService } from '../../providers/user-service';
import {Storage} from '@ionic/storage';


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
   // showCradBlock: boolean = false;
    paymentDetails: any = {
        paymentStatus: true
    };
    cardInfo: any = {};
    carrier: any = {};
    public userId:'';

   /* public paymentTypes: any = [
                    {'default': true,'type': 'PayPal','value': 'paypal','logo': 'assets/img/paypal_logo.jpg'},
                    {'default': false, 'type': 'Stripe', 'value': 'stripe', 'logo': 'assets/img/stripe.png'},
                    {'default': false, 'type': 'Cheque', 'value': 'cheque', 'logo': ''},
                    {'default': false, 'type': 'Virement', 'value': 'virement', 'logo': ''},
                    {'default': false, 'type': 'COD', 'value': 'cod', 'logo': ''}];*/
      public paymentTypes: any = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private userService:UserService,
                public checkoutService: CheckoutService,
                public loadingCtrl: LoadingController,
                public alertCtrl:AlertController,
                public payPal: PayPal,
                public stripe: Stripe,
                private storage:Storage) {

             this.orderData = this.navParams.get('orderData');
             console.log(this.navParams.get('cartData'));
             console.log(this.orderData);
    }

    ngOnInit() {
        this.orderData.paymentOption = 'PayPal';
        this.userService.getUser().subscribe(user=>{
        this.userId=user._id;
        })
        this.carrier = this.navParams.get('carrierData');
        console.log(this.objectToArray(this.carrier.carrier_list)[0].instance.id);
        //Permet de récupérer tous les moyens de paiements dispo
        this.checkoutService.getAvailablePayments(0).subscribe(data => {
            console.log(data);
            this.paymentTypes = data;
            console.log(this.paymentTypes);
            console.log(this.paymentTypes[0]);
        })
    }

    choosePaymentType(paymentType){
        console.log(paymentType);
     this.orderData.paymentOption=paymentType;
     this.paymentDetails.paymentType=paymentType;
    }

    checkoutTest(orderDetails: NgForm){
        //Problème avec le prix du transporteur
        for(var payment of this.paymentTypes){
            console.log(payment);
            if(payment.id_module === this.orderData.paymentOption){
                console.log(payment.id_module);
                //this.calculateTotalPrice();
                var cart = this.navParams.get('cartData');
                console.log(cart);
                /*var customer = JSON.parse(localStorage.getItem('user'));
                console.log(customer);*/

           //var modif = this.updateCartInfo(cart.cart.id);
           var modif = this.putCartInfo(cart.cart.id);
           console.log(modif);
            this.checkoutService.putCart(cart.cart.id, modif).subscribe(data => {
                console.log(data);
                //console.log(this.carrier.carrier.id);
                console.log(this.objectToArray(this.carrier.carrier_list)[0].instance);
                var commandeAEnvoyer =  {
                    order: {
                        id_carrier: this.objectToArray(this.carrier.carrier_list)[0].instance.id,
                        id_currency: 1,
                        id_cart: data.cart.id,
                        id_customer: this.navParams.get('cartData').cart.id_customer,
                        module: payment.name,
                        payment: payment.name,
                    //id_shop: 1,
                    id_address_invoice: this.orderData.shippingAddress.address.id,
                    id_address_delivery: this.orderData.shippingAddress.address.id,
                    id_lang: 1,
                    conversion_rate: 1,
                    current_state: 1, // "En attente de paiement par chèque"
                    //total_paid: this.orderData.grandTotal, 
                    //total_paid: this.calculateTotalPrice(), 
                    total_paid: this.navParams.get('totalPrice'),
                    total_paid_real: 0, 
                    total_products: this.orderData.subTotal, 
                    total_products_wt: this.orderData.grandTotal - this.orderData.taxAmount,
                    total_shipping: this.carrier.total_price_with_tax
                }
            };
                //Fonctionne mais renvoi "paiement accepté" au lieu de "paiement en attente"
                this.checkoutService.postOrder(commandeAEnvoyer).subscribe(order =>{
                    console.log(order);
                    /*localStorage.removeItem('cartItem');
                    localStorage.removeItem('id_cart');*/
                    this.storage.remove('cart');
                    localStorage.removeItem('id_cart');
                    this.navCtrl.push('RecapPaymentPage', {
                        payment: this.orderData.paymentOption,
                        order: order
                    });
                    //this.navCtrl.setRoot("ThankyouPage");
                })

            });
        }
    }
}

    checkout(orderDetails: NgForm) {
        console.log(orderDetails);
        if (this.orderData.paymentOption == 'PayPal') {
            const config = {
                PayPalEnvironmentProduction: '',
                PayPalEnvironmentSandbox: payPalEnvironmentSandbox
            }
            /*this.checkoutService.placeOrder(this.orderData)
                .subscribe(order => {
                    this.payPal.init(config).then(() => {
                        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({})).then(() => {
                            let payment = new PayPalPayment(this.orderData.grandTotal, 'USD', 'Description', 'sale');
                            this.payPal.renderSinglePaymentUI(payment).then((success) => {
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
                })*/
        } else if (this.orderData.paymentOption == 'Stripe') {

           /* if(this.orderData.grandTotal >= 50){

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
                                        //this.savePaymentData(order._id, this.paymentDetails);
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
        }*/
        } else if(this.orderData.paymentOption == 'Cheque'){
            
           var cart = this.navParams.get('cartData');
            console.log(cart);
           var customer = JSON.parse(localStorage.getItem('user'));
           console.log(customer);


           //var modif = this.updateCartInfo(cart.cart.id);
           var modif = this.putCartInfo(cart.cart.id);
            console.log(modif);
            //Bug commande non lié au panier. Fonctionne avec un post, mais pas avec un put
            //Obliger de mettre à jour l'adresse de livraison et de facturation du panier
            this.checkoutService.putCart(cart.cart.id, modif).subscribe(data => {
                console.log(data);
                //console.log(this.carrier.carrier.id);

            var commandeAEnvoyer =  {
                order: {
                    id_carrier: this.objectToArray(this.carrier.carrier_list)[0].instance.id,
                    id_currency: 1,
                    id_cart: data.cart.id,
                    id_customer: customer.id_customer,
                    module: "cheque",
                    payment: "Paiement par chèque",
                    //id_shop: 1,
                    id_address_invoice: this.orderData.shippingAddress.address.id,
                    id_address_delivery: this.orderData.shippingAddress.address.id,
                    id_lang: 1,
                    conversion_rate: 1,
                    //current_state: 1, // "En attente de paiement par chèque"
                    //total_paid: this.orderData.grandTotal, 
                   // total_paid: this.calculateTotalPrice(), // Donner le prix exact
                    total_paid: this.navParams.get('totalPrice'),
                    total_paid_real: 0, 
                    total_products: this.orderData.subTotal, 
                    total_products_wt: this.orderData.grandTotal - this.orderData.taxAmount,
                    //total_shipping: 10 //En fonction du transporteur
                }
            };
                //Fonctionne mais renvoi "paiement accepté" au lieu de "paiement en attente"
                this.checkoutService.postOrder(commandeAEnvoyer).subscribe(order =>{
                    console.log(order);
                    localStorage.removeItem('cartItem');
                    localStorage.removeItem('id_cart');
                    this.navCtrl.push('RecapPaymentPage', {
                        payment: this.orderData.paymentOption,
                        order: order
                    });
                    //this.navCtrl.setRoot("ThankyouPage");
                })

            });
        }else if(this.orderData.paymentOption === 'Virement'){
            console.log('Virement choisit');

            var cart = this.navParams.get('cartData');
            console.log(cart);
            var customer = JSON.parse(localStorage.getItem('user'));
            console.log(customer);


           //var modif = this.updateCartInfo(cart.cart.id);
           var modif = this.putCartInfo(cart.cart.id);
            console.log(modif);

            this.checkoutService.putCart(cart.cart.id, modif).subscribe(data => {
                console.log(data);
                //console.log(this.carrier.carrier.id);

            var commandeAEnvoyer =  {
                order: {
                    id_carrier: this.objectToArray(this.carrier.carrier_list)[0].instance.id,
                    id_currency: 1,
                    id_cart: data.cart.id,
                    id_customer: customer.id_customer,
                    module: "bankwire",
                    payment: "Virement bancaire",
                    id_shop: 1,
                    id_address_invoice: this.orderData.shippingAddress.address.id,
                    id_address_delivery: this.orderData.shippingAddress.address.id,
                    id_lang: 1,
                    conversion_rate: 1,
                    current_state: 10, // "En attente de virement bancaire"
                    //total_paid: this.calculateTotalPrice(), 
                    total_paid: this.navParams.get('totalPrice'),
                    total_paid_real: 0, 
                    total_products: this.orderData.subTotal, 
                    total_products_wt: this.orderData.grandTotal - this.orderData.taxAmount,
                    total_shipping: this.carrier.total_price_with_tax //En fonction du transporteur
                }
            };
                this.checkoutService.postOrder(commandeAEnvoyer).subscribe(order =>{
                    console.log(order);
                    localStorage.removeItem('cartItem');
                    localStorage.removeItem('id_cart');
                    this.navCtrl.push('RecapPaymentPage', {
                        payment: this.orderData.paymentOption
                    })
                    //this.navCtrl.setRoot("ThankyouPage");
                })
            });

        }else{
            //Voué à disparaitre cette partie
            localStorage.removeItem('cartItem');
            console.log("commande ok");
            this.navCtrl.setRoot("ThankyouPage");
        }

    }

    putCartInfo(cartId){
        //var id_customer = JSON.parse(localStorage.getItem('user')).id_customer;
        var cart = this.navParams.get('cartData');
        console.log(cart);
        console.log("panier existant");
        var modif = {
            cart: {
                id: cartId,
                id_shop_group: 1, 
                id_shop: 1,
                id_address_delivery: this.orderData.shippingAddress.address.id,
                id_address_invoice: this.orderData.shippingAddress.address.id,
                id_carrier: this.objectToArray(this.carrier.carrier_list)[0].instance.id,
                id_currency: 1,
                id_customer: cart.cart.id_customer,
               // id_guest: null,
                id_lang: 1,
               // recyclable: null,
               // gift: null,
                //gift_message: null,
                //mobile_theme: null,
                //delivery_option: null,
                //secure_key: null,
               // allow_seperated_package: 0,
                //date_add: null,
                //date_upd: null,
                associations: {
                    cart_rows: {
                        cart_row: []
                    }
                }
            }
        };

        for(var items of cart.cart.associations.cart_rows){
            console.log(items);
            var product: any = {};
            product.id_product = items.id_product;
            product.id_product_attribute = items.id_product_attribute;
            product.id_address_delivery = items.id_address_delivery;
            product.quantity = items.quantity;
            modif.cart.associations.cart_rows.cart_row.push(product);        
        }
        console.log(modif);
        return modif;        
    }

    updateCartInfo(cartId){
        //var id_customer = JSON.parse(localStorage.getItem('user')).id_customer;
        var cart = this.navParams.get('cartData');
        console.log(cart);
        console.log("panier existant");
        var modif = {
            cart: {
                //id: cartId,
                id_shop_group: 1, 
                id_shop: 1,
                id_address_delivery: this.orderData.shippingAddress.address.id,
                id_address_invoice: this.orderData.shippingAddress.address.id,
                id_carrier: this.objectToArray(this.carrier.carrier_list)[0].instance.id,
                id_currency: 1,
                id_customer: cart.cart.id_customer,
               // id_guest: null,
                id_lang: 1,
               // recyclable: null,
               // gift: null,
                //gift_message: null,
                //mobile_theme: null,
                //delivery_option: null,
                //secure_key: null,
               // allow_seperated_package: 0,
                //date_add: null,
                //date_upd: null,
                associations: {
                    cart_rows: {
                        cart_row: []
                    }
                }
            }
        };

        for(var items of cart.cart.associations.cart_rows){
            console.log(items);
            var product: any = {};
            product.id_product = items.id_product;
            product.id_product_attribute = items.id_product_attribute;
            product.id_address_delivery = items.id_address_delivery;
            product.quantity = items.quantity;
            modif.cart.associations.cart_rows.cart_row.push(product);        
        }
        console.log(modif);
        return modif;        
    }

    /*placeOrder() {
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
    }*/

    showAlert(message){
      let alert = this.alertCtrl.create({
        subTitle: message,
        buttons: ['OK']
      });
      alert.present();
   }

   /*calculateTotalPrice(){
       var cart = JSON.parse(localStorage.getItem('cartItem'));
       var totalPrice: number = 0;
       var shippingPrice: number = this.carrier.total_price_with_tax;
       console.log("shipping : "+shippingPrice);
       for(var item of cart){
           for(var declinaison of item.declinaison){
               console.log(item);
               console.log(declinaison);
               totalPrice += declinaison.endPrice * declinaison.selectedQuantity;
               console.log(totalPrice);
           }
       }
       totalPrice = totalPrice + shippingPrice;
       console.log(totalPrice);
       return totalPrice;
   }*/

   objectToArray(object){
       let item = Object.keys(object);
       let array = [];
       for(var i of item){
           array.push(object[i]);
       }
       return array;
   }

}
