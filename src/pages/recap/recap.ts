import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RecapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit(){
  	this.cartData = this.navParams.get('cartData');
  	this.orderData = this.navParams.get('orderData');
  	this.carrierData = this.navParams.get('carrierData');

  	console.log(this.cartData);
  	console.log(this.orderData);
    console.log(this.orderData.cart[0].imageUrl);
    this.totalPrice = this.totalPriceWithTax();
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
       var cart = JSON.parse(localStorage.getItem('cartItem'));
       var totalPrice: number = 0;       
       for(var item of cart){
           for(var declinaison of item.declinaison){
               totalPrice += declinaison.endPrice * declinaison.selectedQuantity;
           }
       }
       totalPrice + this.carrierData.total_price_with_tax;
       return totalPrice;
  }

  goToPayment(){
    this.navCtrl.push('CheckoutPage', {
      cartData: this.cartData,
      orderData: this.orderData,
      carrierData: this.carrierData
    })
  }

}
