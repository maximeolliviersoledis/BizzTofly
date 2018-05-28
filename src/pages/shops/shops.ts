import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ShopsService} from './shops.service';
import {Storage} from '@ionic/storage';
import {GoogleMap, GoogleMaps, GoogleMapOptions, GoogleMapsEvent, Marker} from '@ionic-native/google-maps';

@IonicPage()
@Component({
  selector: 'page-shops',
  templateUrl: 'shops.html',
  providers: [ShopsService]
})
export class ShopsPage {
	noOfItems: number = 0;
	map: GoogleMap;
  constructor(public navCtrl: NavController,
  			  public navParams: NavParams, 
  			  public shopsService:ShopsService,
  			  private storage:Storage) {
  	this.storage.get('cart').then((data)=>{
  		console.log(data);
  		if(data)
  			for(var item of data)
  				this.noOfItems += item.quantity;
  	})

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopsPage');
    this.map = GoogleMaps.create('map_canvas');
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
    	console.log("map is ready");
    })
    /*let mapOptions: GoogleMapOptions = {
      camera: {
         target: {
           lat: 43.0741904,
           lng: -89.3809802
         },
         zoom: 18,
         tilt: 30
       }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    let marker: Marker = this.map.addMarkerSync({
      title: 'Ionic',
      icon: 'blue',
      animation: 'DROP',
      position: {
        lat: 43.0741904,
        lng: -89.3809802
      }
    });*/
   /* marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      alert('clicked');
    });*/
  }

  navcart(){
  	this.navCtrl.push("CartPage");
  }

}
