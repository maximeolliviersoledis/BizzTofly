import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocationService } from '../location/location.service';
/**
 * Generated class for the ShopDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-shop-details',
 	templateUrl: 'shop-details.html',
 	providers: [LocationService]
 })
 export class ShopDetailsPage {
 	shop: any;
 	header_data: any;

 	constructor(public navCtrl: NavController, public navParams: NavParams, public locationService:LocationService) {
 		this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Shops'};  
 		this.shop = this.navParams.get('shop');
 		if(!this.shop){
 			this.locationService.getShop(this.navParams.get('id')).subscribe(data => {
 				this.shop = data;
 				if(this.shop.id_image)
        			this.shop.imageUrl = this.locationService.getImageUrl(this.shop.id_image);
 				this.shop.hours = this.formatHours();
 			})
 		}else{
 			this.shop.hours = this.formatHours();
 		} 

 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad ShopDetailsPage');
 	}

 	formatHours(){
 		var ret = this.shop.hours.split(';');
 		return ret
 	}

 }
