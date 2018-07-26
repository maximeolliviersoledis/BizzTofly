import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ConstService} from '../../providers/const-service';

@IonicPage()
@Component({
  selector: 'page-recap',
  templateUrl: 'recap.html',
})
export class RecapPage {
  cartData: any = {};
  orderData: any = {};
  carrierData: any = {};
  products: any[] = [];
  totalPrice: number = 0;
  totalPriceWithCarrier: number = 0;
  header_data: any;
  order_header_data: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage, private constService:ConstService) {
        this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Summary'};        
        this.order_header_data = {currentStep: 3, pageName: "Recap"};
  }

  ngOnInit(){
  	this.cartData = this.navParams.get('cartData');
  	this.orderData = this.navParams.get('orderData');
  	this.carrierData = this.navParams.get('carrierData');
    console.log(this.carrierData);
  	console.log(this.cartData);
  	console.log(this.orderData);
    console.log(this.orderData.cart[0].imageUrl);
    this.totalPriceWithTax();
    //this.totalPrice = this.totalPriceWithTax();
  	//this.getAllProducts();
  }

  getAllProducts(){
  	for(var product of this.orderData.cart){
  		console.log(product);
  		for(var item of product.declinaison){
  			console.log(item);
  			this.products.push(item);
  		}
  	}
  }

  totalProductPrice(price, quantity){
  	var productPrice = price * quantity;
  	//this.totalPrice += productPrice;
  	return productPrice;
  }

  totalPriceWithTax(){
       //var cart = JSON.parse(localStorage.getItem('cartItem'));
       this.storage.get('cart').then((cart)=>{
         var totalPrice: number = 0;       
         for(var item of cart){
           for(var declinaison of item.declinaison){
             totalPrice += declinaison.endPrice * declinaison.selectedQuantity;
           }
         }
         //totalPrice + this.carrierData.total_price_with_tax;
         this.totalPrice = totalPrice;
         this.totalPriceWithCarrier = this.totalPrice + this.carrierData.total_price_with_tax;
       })

      //return totalPrice;
    }

  goToPayment(){
    this.navCtrl.push('CheckoutPage', {
      amountDetails: this.navParams.get('amountDetails'), //Obliger de passer ce param pour le retour arrière
      cartData: this.cartData,
      orderData: this.orderData,
      carrierData: this.carrierData,
      totalPrice: this.totalPrice
    })
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

}
