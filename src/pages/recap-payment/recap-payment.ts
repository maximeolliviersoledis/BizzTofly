import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RecapPaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recap-payment',
  templateUrl: 'recap-payment.html',
})
export class RecapPaymentPage {
  paymentOption: any = {};
  orderDetails: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit(){
    //Voir si cette page est vraiment utile ??
  	this.paymentOption = this.navParams.get('payment');
    this.orderDetails = this.navParams.get('order');
    console.log(this.orderDetails);
  	console.log(this.paymentOption);
  }

  isCheque(){
  	return this.paymentOption === "Cheque" ? true : false;
  }

  isBankWire(){
  	return this.paymentOption === "Virement" ? true : false;
  }
}
