import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-recap-payment',
  templateUrl: 'recap-payment.html',
})
export class RecapPaymentPage {
  paymentOption: any = {};
  paymentDetails: any = {};
  totalPaid: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit(){
  	this.paymentOption = this.navParams.get('payment');
    this.paymentDetails = this.navParams.get('paymentDetails');
    this.totalPaid = this.navParams.get('totalPaid');
  	console.log(this.paymentOption);
    console.log(this.paymentDetails);
  }

  isCheque(){
  	return this.paymentOption == "cheque" ? true : false;
  }

  isBankWire(){
  	return this.paymentOption == "bankwire" ? true : false;
  }
}
