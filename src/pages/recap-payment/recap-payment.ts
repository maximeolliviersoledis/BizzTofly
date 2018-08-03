import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConstService } from '../../providers/const-service';
@IonicPage()
@Component({
  selector: 'page-recap-payment',
  templateUrl: 'recap-payment.html',
})
export class RecapPaymentPage {
  paymentOption: any = {};
  paymentDetails: any = {};
  totalPaid: number = 0;
  header_data: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private constService:ConstService) {
        this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Recap Payment'};

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

  goToHome(){
    this.navCtrl.setRoot('HomePage');
  }
}
