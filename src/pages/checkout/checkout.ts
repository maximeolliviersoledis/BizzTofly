import {Component} from '@angular/core';
import {NavController, NavParams, IonicPage, LoadingController,AlertController, ToastController} from 'ionic-angular';
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
    paymentDetails: any = {
        paymentStatus: true
    };
    cardInfo: any = {};
    carrier: any = {};
    public userId:'';
    public paymentTypes: any = [];
    order_header_data: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private userService:UserService,
                public checkoutService: CheckoutService,
                public loadingCtrl: LoadingController,
                public alertCtrl:AlertController,
                public payPal: PayPal,
                public stripe: Stripe,
                private storage:Storage,
                public toastCtrl:ToastController) {

             this.orderData = this.navParams.get('orderData');
             this.order_header_data = {currentStep: 4, pageName: "Checkout"};
             console.log(this.navParams.get('cartData'));
             console.log(this.orderData);
    }

    ngOnInit() {
        this.orderData.paymentOption = 'PayPal';
        this.carrier = this.navParams.get('carrierData');
        console.log(this.carrier);
        console.log(this.navParams.get('totalPrice') + this.carrier.total_price_with_tax);
        console.log(this.objectToArray(this.carrier.carrier_list)[0].instance.id);
        //Permet de récupérer tous les moyens de paiements dispo
        //Voir si c'est vraiment utile
        this.checkoutService.getAvailablePayments(0).subscribe(data => {
            console.log(data);
            this.paymentTypes = data;
            this.paymentTypes.push({name: "stripe", id_module: 0});
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
        if(this.orderData.paymentOption && this.orderData.paymentOption.name){
            var order = this.prepareOrderToBeSend();
            if(this.orderData.paymentOption.name === "bankwire"){
                console.log("Méthode de paiement = bankwire");
                this.checkoutService.payOrder(this.navParams.get('cartData').cart.id, this.orderData.paymentOption.name).subscribe(data => {
                    //alert(data);
                  //  alert(JSON.parse(data));
                    if(data && typeof JSON.parse(data.state) ==="boolean" && JSON.parse(data.state) == true){
                        this.createToaster("Votre commande a bien été prise en compte",3000);
                        this.storage.remove('cart');
                        localStorage.removeItem('id_cart');

                        this.navCtrl.setRoot('RecapPaymentPage', {
                            payment: this.orderData.paymentOption.name,
                            totalPaid: this.navParams.get('totalPrice'),
                            paymentDetails: data
                        });
                    }else{
                        this.createToaster("Une erreur est survenue lors du passage de votre commande",3000);
                    }
                })
            }else if(this.orderData.paymentOption.name === "cheque"){
                console.log("Méthode de paiement = cheque");
                this.checkoutService.payOrder(this.navParams.get('cartData').cart.id, this.orderData.paymentOption.name).subscribe(data => {
                   // alert(data);
                  //  alert(JSON.parse(data));
                    console.log(data);
                    if(data && typeof JSON.parse(data.state) ==="boolean" && JSON.parse(data.state) == true){
                        this.createToaster("Votre commande a bien été prise en compte",3000);
                        this.storage.remove('cart');
                        localStorage.removeItem('id_cart');
                        this.navCtrl.setRoot('RecapPaymentPage', {
                            payment: this.orderData.paymentOption.name,
                            totalPaid: this.navParams.get('totalPrice'),
                            paymentDetails: data
                        });
                    }else{
                        this.createToaster("Une erreur est survenue lors du passage de votre commande",3000);
                    }
                })
            }else if(this.orderData.paymentOption.name === "paypal"){
                console.log("Méthode de paiement = paypal");
                this.payPal.init({
                        PayPalEnvironmentProduction: '',
                        PayPalEnvironmentSandbox: payPalEnvironmentSandbox
                    }).then(() => {
                        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({})).then(() => {
                            let payment = new PayPalPayment(this.navParams.get('totalPrice'), 'EUR', 'Description', 'Sale');
                            this.payPal.renderSinglePaymentUI(payment).then((success) => {
                                this.showAlert(JSON.stringify(success));
                                this.paymentDetails.transactionId = success.response.id;
                                //Si le paiement est un succès alors on post la commande avec le status succès
                            }, (error) => {
                                console.error(error);
                                this.showAlert("Error: Type = 3 - "+JSON.stringify(error)); //Si une erreur survient à ce niveau ==> paiement = pas un succès
                            });
                        }, (error) => {
                            console.error(error);
                            this.showAlert("Error: Type = 2 - "+JSON.stringify(error)); //Si une erreur survient à ce niveau ==> pb config
                        })
                    }, (error) => {
                        console.error(error);
                        this.showAlert("Error: Type = 1 - "+JSON.stringify(error)); //Si une erreur survient à ce niveau ==> paypal non supporté
                    })
            }else if(this.orderData.paymentOption.name === "stripe"){ //Pas encore implémenté
                console.log("Erreur méthode de paiement = stripe");
                this.stripe.setPublishableKey(publishableKey); //Récupérer sa clé après la création du compte stripe
                //Remplacer par les infos utilisateurs saisit
                let card = {
                    number: '4242424242424242',
                    expMonth: 12,
                    expYear: 2020,
                    cvc: '220'
                    //Possibilité d'ajouter plus d'info concernant le client, utile??
                }

                this.stripe.createCardToken(card)
                .then((data) => {
                    this.showAlert(JSON.stringify(data));
                    this.checkoutService.chargeStripe(JSON.parse(data).id, "EUR", this.navParams.get('totalPrice'), stripe_secret_key)
                        .then((result) => {
                            this.showAlert(JSON.stringify(result));
                           /* let res: any = result;
                            this.paymentDetails.transactionId = res.balance_transaction;
                            this.cardInfo = '';*/
                        }, error => {
                            this.showAlert(JSON.stringify(error));
                        });
                }).catch(
                    error => this.showAlert(JSON.stringify(error))
                );
            }else{ //En théorie ce cas la ne devrait pas arriver
                console.log("Erreur méthode de paiement inconnu");
                this.createToaster("Unknown payment method",3000);
            }
        }else{
            this.createToaster("Veuillez sélectionner un moyen de paiement",3000);
        }
    }

    prepareOrderToBeSend(){
        //var cart = this.checkoutService.putCart(); // Obliger d'envoyer le panier?????????? => oui pour mettre à jour les addresseset option de livraison
        //==> peut etre fait dans la page des transporteurs
        /*this.checkoutService.putCart(this.navParams.get('cartData').cart.id,this.putCartInfo(this.navParams.get('cartData').cart.id)).subscribe(
            data => {
                alert(data);
                alert(JSON.stringify(data))
            }
        ); //A sup*/
        var commandeAEnvoyer =  {
                    order: {
                        id_carrier: this.objectToArray(this.carrier.carrier_list)[0].instance.id,
                        id_currency: 1,
                        id_cart: this.navParams.get('cartData').cart.id,
                        id_customer: this.navParams.get('cartData').cart.id_customer,
                        module: this.orderData.paymentOption.name,
                        payment: this.orderData.paymentOption.name,
                        id_address_invoice: this.orderData.shippingAddress.address.id,
                        id_address_delivery: this.orderData.shippingAddress.address.id,
                        id_lang: 1,
                        conversion_rate: 1,
                        //current_state: 1, //Paramètre inutile, puisque c'est le module appelé qui défini le statut de la commande
                        total_paid: this.navParams.get('totalPrice') + this.carrier.total_price_with_tax,
                        total_paid_real: 0, 
                        total_products: this.orderData.subTotal, 
                        total_products_wt: this.orderData.grandTotal - this.orderData.taxAmount,
                        total_shipping: this.carrier.total_price_with_tax
                    }
        };

        return commandeAEnvoyer;
    }


    /*checkoutTest(orderDetails: NgForm){
        for(var payment of this.paymentTypes){
            console.log(payment);
            if(payment.id_module === this.orderData.paymentOption){
                console.log(payment.id_module);
                var cart = this.navParams.get('cartData');
                console.log(cart);
           var modif = this.putCartInfo(cart.cart.id);
           console.log(modif);
            this.checkoutService.putCart(cart.cart.id, modif).subscribe(data => {
                console.log(data);
                console.log(this.objectToArray(this.carrier.carrier_list)[0].instance);
                var commandeAEnvoyer =  {
                    order: {
                        id_carrier: this.objectToArray(this.carrier.carrier_list)[0].instance.id,
                        id_currency: 1,
                        id_cart: data.cart.id,
                        id_customer: this.navParams.get('cartData').cart.id_customer,
                        module: payment.name,
                        payment: payment.name,
                    id_address_invoice: this.orderData.shippingAddress.address.id,
                    id_address_delivery: this.orderData.shippingAddress.address.id,
                    id_lang: 1,
                    conversion_rate: 1,
                    current_state: 1, // "En attente de paiement par chèque"
                    total_paid: this.navParams.get('totalPrice') + this.carrier.total_price_with_tax,
                    total_paid_real: 0, 
                    total_products: this.orderData.subTotal, 
                    total_products_wt: this.orderData.grandTotal - this.orderData.taxAmount,
                    total_shipping: this.carrier.total_price_with_tax
                }
            };
                this.checkoutService.postOrder(commandeAEnvoyer).subscribe(order =>{
                    console.log(order);
                    this.storage.remove('cart');
                    localStorage.removeItem('id_cart');
                    this.createToaster("Votre commande a bien été prise en compte",3000);

                    this.navCtrl.push("HomePage");
                })

            });
        }
    }
}*/

    checkoutInit(orderDetails: NgForm) {
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
                    total_paid: this.navParams.get('totalPrice') + this.carrier.total_price_with_tax,
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
                    /*this.navCtrl.push('RecapPaymentPage', {
                        payment: this.orderData.paymentOption,
                        order: order
                    });*/
                    this.createToaster("Votre commande a bien été prise en compte",3000);
                    this.navCtrl.push("HomePage");
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
                    total_paid: this.navParams.get('totalPrice') + this.carrier.total_price_with_tax,
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
                    this.createToaster("Votre commande a bien été prise en compte",3000);
                    this.navCtrl.push("HomePage");
                    /*this.navCtrl.push('RecapPaymentPage', {
                        payment: this.orderData.paymentOption
                    })*/
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

    //Fonctionne mais fonction dégeux
    //Ne fonctionne que pour une seule addresse
    //Il faudrait faire une fonction faisant l'équivalent de la serialize() en php
    formatDeliveryOption(carrierId){
        var delivery_option: string = 'a:1:{i:'+this.orderData.shippingAddress.address.id+';s:'+(carrierId.toString().length+1)+':"'+carrierId+',";}'
        return delivery_option;
    }

    putCartInfo(cartId){
        //var id_customer = JSON.parse(localStorage.getItem('user')).id_customer;
        //format à envoyer a:1:{i:93;s:2:"2,";} ou 'a:1:{i:93;s:3:"17,";}' pour delivery option

        //a:[index_array]{i:id_address;s::}
           //$var['93'] = '2,'; équivalent php sérialiser
           //'a:1:{i:93;s:3:"17,";}'
           //a = array, ':1' = length '{}': contenu du tableau, i = index ':93' = address, 's' = string ':2' = string.length '"2,"' = a la chaine
        


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
                delivery_option: this.formatDeliveryOption(this.objectToArray(this.carrier.carrier_list)[0].instance.id),
                id_lang: 1,
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

    /*updateCartInfo(cartId){
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
                delivery_option: this.formatDeliveryOption(this.objectToArray(this.carrier.carrier_list)[0].instance.id),
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
    }*/

    showAlert(message){
      let alert = this.alertCtrl.create({
        subTitle: message,
        buttons: ['OK']
      });
      alert.present();
   }

   objectToArray(object){
       let item = Object.keys(object);
       let array = [];
       for(var i of item){
           array.push(object[i]);
       }
       return array;
   }

    createToaster(message, duration) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
    }
}
