import { Component,Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'custom-header',
  templateUrl: 'custom-header.html',
})
export class CustomHeaderPage {

      header_data: any;
      cartItems:any[];
      noOfItems:number;
      searchBarVisible=true;
      
  constructor(public navCtrl: NavController,
              public navParams: NavParams) {

     this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
        if (this.cartItems != null) {
            this.noOfItems = this.cartItems.length;
        }
  }

  @Input()
    set header(header_data: any) {
        this.header_data = header_data;
    }

    get header() {
        return this.header_data;
    }

 searchToggle(){
  this.searchBarVisible=!this.searchBarVisible;    
  }

    gotoCart() {
        this.navCtrl.push("CartPage");
    }

    gotoHome() {
        this.navCtrl.setRoot("HomePage");
    }

}
