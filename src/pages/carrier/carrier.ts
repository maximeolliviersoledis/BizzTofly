import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController } from 'ionic-angular';
import { CarrierService } from './carrier.service';
import {Storage} from '@ionic/storage';
import {CgvPage} from '../cgv/cgv';

@IonicPage()
@Component({
  selector: 'page-carrier',
  templateUrl: 'carrier.html',
  providers:[CarrierService]
})
export class CarrierPage {
	carriers: any[] =  [];
	carrier: any = {};
  acceptCGV: boolean = false;
  header_data: any;
  order_header_data: any;
  orderData: any = {
    address: {},
    cardDetails: {},
    status: 'pending'
  };
  constructor(public navCtrl: NavController, 
  			  public navParams: NavParams,
  			  public carrierService: CarrierService,
    		  public alertCtrl:AlertController,
          private storage:Storage,
          public popoverCtrl:PopoverController
  			  ) {
        this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Carrier'};        
        this.order_header_data = {currentStep: 2, pageName: "Carrier"};
        this.orderData = this.navParams.get('orderData');

  }

  ngOnInit(){
    console.log("ngOnInit() carrier appelé");
    //var customer = JSON.parse(localStorage.getItem('user'));
    this.storage.get('user').then((customer)=>{
      var cart = this.navParams.get('cartData');
      console.log(cart);
      console.log(customer);
      this.carrierService.getAllCarriers(customer.id_customer,cart.cart.id).subscribe(data => {
        console.log(data);
        for(var carrier of this.objectToArray(data[0])){
          console.log(carrier);
          console.log(this.objectToArray(this.objectToArray(carrier.carrier_list)[0].instance.delay)[0]);
          console.log(this.objectToArray(carrier.carrier_list)[0].logo);
          if(this.objectToArray(carrier.carrier_list)[0].logo)
            carrier.image = this.carrierService.getCarrierImageUrl(this.objectToArray(carrier.carrier_list)[0].logo);
          else
            carrier.image = false;
          this.carriers.push(carrier);
        }
        console.log(this.carriers);
      /*for(var test of this.objectToArray(data[0])){
        //console.log(test);
        console.log(this.objectToArray(test.carrier_list)[0]);
        this.carriers.push(this.objectToArray(test.carrier_list)[0]);
      }*/
      
    });
    })
    
  	/*this.carrierService.getAllCarriers().subscribe(data => {
  		console.log(data);
  		for(var carrier of data.carriers){
  			this.carrierService.getCarrierById(carrier.id).subscribe(response => {
  				console.log(response);
  				this.carriers.push(response);
  			})
  		}
  	});*/
  }

  selectCarrier(carrier){
    console.log(carrier);
  	this.carrier = carrier;
  }

  goToPayment(){
  	if(this.carrier && this.carrier.carrier_list && this.acceptCGV){
      this.carrierService.putCart(this.navParams.get('cartData').cart.id,this.putCartInfo(this.navParams.get('cartData').cart.id)).subscribe(() => {
          this.navCtrl.push("RecapPage", {
          amountDetails: this.navParams.get('amountDetails'), //Obliger de passer ce param pour le retour arrière
          orderData: this.navParams.get('orderData'),
          cartData: this.navParams.get('cartData'),
          carrierData: this.carrier
        })
      });
  	}else if(!this.acceptCGV){
  		this.showAlert('Veuillez accepter les cgv !');
  	}else{
      this.showAlert('Veuillez sélectionner un transporteur !');
    }
  }

  private showAlert(message) {
    let alert = this.alertCtrl.create({
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  showCGV($event){
    /*let popover = this.popoverCtrl.create(CgvPage);
    popover.present({
      ev: $event
    });*/
    this.navCtrl.push("CgvPage");
  }

  objectToArray(object){
    if(object){
      let item = Object.keys(object);
      let array = [];
      for(var i of item){
        array.push(object[i]);
      }
      return array;
    }else{
      return [];
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
                //delivery_option: '2,',
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
}
