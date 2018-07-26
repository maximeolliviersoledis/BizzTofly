import {Component} from '@angular/core';
import {NavController, NavParams, IonicPage, LoadingController,AlertController, ToastController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {CheckoutService} from './checkout.service';
import {PayPal, PayPalPayment, PayPalConfiguration} from '@ionic-native/paypal';
import {Stripe} from '@ionic-native/stripe';
import {UserService } from '../../providers/user-service';
import {Storage} from '@ionic/storage';
import {ConstService} from '../../providers/const-service';

//const payPalEnvironmentSandbox = 'AcgkbqWGamMa09V5xrhVC8bNP0ec9c37DEcT0rXuh7hqaZ6EyHdGyY4FCwQC-fII-s5p8FL0RL8rWPRB';
const payPalEnvironmentSandbox = 'ATPQQMVbCNqTWLm6Lyp2OWoKbcFx7xFrv9OkIjaSqCjAyU6N4YEXiiYNgWl_VJu5WINZ44Ab-obw7d7B';
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
                public toastCtrl:ToastController,
                private constService:ConstService) {

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
           // this.paymentTypes.push({name: "stripe", id_module: 0});
            console.log(this.paymentTypes);
            console.log(this.paymentTypes[0]);
        })
    }

    choosePaymentType(paymentType){
        console.log(paymentType);
        this.orderData.paymentOption=paymentType;
        this.paymentDetails.paymentType=paymentType;
    }


    checkout(orderDetails: NgForm){
        if(this.orderData.paymentOption && this.orderData.paymentOption.name){
            var order = this.prepareOrderToBeSend();
            if(this.orderData.paymentOption.name === "bankwire"){
                console.log("Méthode de paiement = bankwire");
                this.checkoutService.payOrder(this.navParams.get('cartData').cart.id, this.orderData.paymentOption.name).subscribe(data => {
                    if(data && typeof JSON.parse(data.state) ==="boolean" && JSON.parse(data.state) == true){
                        this.constService.createToast({message: "Your order has been successfully passed", duration: 3000});
                        this.storage.remove('cart');
                        localStorage.removeItem('id_cart');

                        this.navCtrl.setRoot('RecapPaymentPage', {
                            payment: this.orderData.paymentOption.name,
                            totalPaid: this.navParams.get('totalPrice'),
                            paymentDetails: data
                        });
                    }else{
                        this.constService.createToast({message: "An error has occured during your order", duration: 3000});
                    }
                })
            }else if(this.orderData.paymentOption.name === "cheque"){
                console.log("Méthode de paiement = cheque");
                this.checkoutService.payOrder(this.navParams.get('cartData').cart.id, this.orderData.paymentOption.name).subscribe(data => {
                    console.log(data);
                    if(data && typeof JSON.parse(data.state) ==="boolean" && JSON.parse(data.state) == true){
                        this.constService.createToast({message: "Your order has been successfully passed", duration: 3000});
                        this.storage.remove('cart');
                        localStorage.removeItem('id_cart');
                        this.navCtrl.setRoot('RecapPaymentPage', {
                            payment: this.orderData.paymentOption.name,
                            totalPaid: this.navParams.get('totalPrice'),
                            paymentDetails: data
                        });
                    }else{
                        this.constService.createToast({message: "An error has occured during your order", duration: 3000});
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
                                this.checkoutService.payOrder(this.navParams.get('cartData').cart.id, this.orderData.paymentOption.name).subscribe(data =>{
                                    if(data != false){
                                        this.storage.remove('cart');
                                        localStorage.removeItem('id_cart');
                                        this.constService.createToast({message: "Your order has been successfully passed", duration: 3000});
                                        this.navCtrl.setRoot('HomePage');
                                    }else{
                                        this.constService.createAlert({title: "Payment error", message: "An error has occured during your order. Please try again later"});
                                    }
                                });
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
            }else if(this.orderData.paymentOption.name === "stripe_official"){ //Pas encore implémenté
                console.log("Méthode de paiement = stripe");
                console.log(this.cardInfo);
                this.stripe.setPublishableKey(publishableKey); //Récupérer sa clé après la création du compte stripe

                let card = {
                    number: this.cardInfo.cardNumber,
                    expMonth: parseInt(this.cardInfo.expiryMonth),
                    expYear: parseInt(this.cardInfo.expiryYear),
                    cvc: this.cardInfo.cvc
                };

                this.stripe.createCardToken(card).then((data: any) => {
                    this.showAlert(JSON.stringify(data));
                    //Le prix doit être exprimé en centimes, pas de flottant accepté
                    this.checkoutService.chargeStripe(data.id, "EUR", this.navParams.get('totalPrice') * 100, stripe_secret_key).then((result) => {
                        console.log("success:");
                        console.log(result);
                        this.showAlert(JSON.stringify(result));
                        if(result.paid && result.status == "succeeded"){
                            this.constService.createToast({message: "Your order has been successfully passed", duration: 3000});
                            this.checkoutService.payOrder(this.navParams.get('cartData').cart.id, this.orderData.paymentOption.name).subscribe(data =>{
                                console.log(data);
                                if(data && data.state == true){
                                    this.storage.remove('cart');
                                    localStorage.removeItem('id_cart');
                                    this.navCtrl.setRoot('HomePage');
                                }
                            }, error => {
                                this.constService.createAlert({title: "Payment error", message: "An unknown error has occured during the payment proccess"});
                            })
                        }else{
                            this.constService.createAlert({title: "Payment error", message: "The message is incorrect. Are you sure to provide the rigth values"});
                        }
                    }).catch(error => {
                        console.log("error:");
                        console.log(JSON.stringify(error));
                        this.showAlert(JSON.stringify(error));
                    })
                }).catch( error => {
                    this.showAlert(JSON.stringify(error));
                })



               /* this.stripe.createCardToken(card)
                .then((data) => {
                    this.showAlert(JSON.stringify(data));
                    this.checkoutService.chargeStripe(JSON.parse(data).id, "EUR", this.navParams.get('totalPrice'), stripe_secret_key)
                        .then((result) => {
                            this.showAlert(JSON.stringify(result));
                           /* let res: any = result;
                            this.paymentDetails.transactionId = res.balance_transaction;
                            this.cardInfo = '';
                        }, error => {
                            this.showAlert(JSON.stringify(error));
                        });
                }).catch(
                    error => this.showAlert(JSON.stringify(error))
                );*/
            }else{ //En théorie ce cas la ne devrait pas arriver
                console.log("Erreur méthode de paiement inconnu");
                this.constService.createToast({message: "Unknown payment method", duration: 3000});
            }
        }else{
            this.constService.createToast({message: "You have to select a payment method", duration: 3000});
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
                id_currency: this.constService.currency.id,
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
}
