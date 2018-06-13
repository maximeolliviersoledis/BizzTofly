import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'custom-order-header',
  templateUrl: 'custom-order-header.html',
})
export class CustomOrderHeaderPage {
      order_header_data: any;
      nbOfStep: any[] = ['1','2','3','4'];
      pages: any[] = ["AddressList","Carrier","Recap","Checkout"];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

    @Input()
    set headerDATA(order_header_data: any) {
        this.order_header_data = order_header_data;
        console.log(this.navParams);
    }

    get headerDATA() {
        return this.order_header_data;
    }

    goToSelectedPage(stepNb){
      if(stepNb < this.order_header_data.currentStep){
        this.navCtrl.push(this.pages[stepNb-1]+"Page", this.navParams); //Marche mais doit prendre ne compte les navParams
      }
    }
}
