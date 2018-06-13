import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
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
	map: GoogleMap;
  header_data:any;
  shops: any[] = [];

  constructor(public navCtrl: NavController,
  			  public navParams: NavParams, 
  			  public shopsService:ShopsService,
  			  private storage:Storage, public platform:Platform) {
        this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Shops'};        
  }

  ionViewDidLoad() {
    /*this.shopsService.getShops().subscribe(data => {
      console.log(data);
    })*/
  }

  navcart(){
  	this.navCtrl.push("CartPage");
  }

  loadMap(){
    this.map = GoogleMaps.create('map');
   /*this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
    	console.log("map is ready");
    })*/
    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(()=>{
    	console.log("map ready");
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
}
