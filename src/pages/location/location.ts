import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import { LocationService } from './location.service';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions';

@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
  providers: [LocationService, NativePageTransitions]
})
export class LocationPage {
  zoom: number= 9;
  header_data: any;
  shops: any [] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public locationService:LocationService, public pageTransition:NativePageTransitions, private events:Events) {
        this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Shops'};        
  }
  ngOnInit(){
    this.locationService.getShops().subscribe(data => {
      this.shops = data;
      for(var i=0; i<this.shops.length;i++){
        this.shops[i].latitude = parseFloat(this.shops[i].latitude);
        this.shops[i].longitude = parseFloat(this.shops[i].longitude);
      }
    });

  }

  ionViewWillLeave(){
    this.events.publish("hideSearchBar");
  }

  /*ionViewWillLeave(){
     let options: NativeTransitionOptions = {
        direction: 'up',
        duration: 500,
        slowdownfactor: 3,
        slidePixels: 20,
        iosdelay: 100,
        androiddelay: 150,
        fixedPixelsTop: 0,
        fixedPixelsBottom: 60
       };

     this.pageTransition.fade(options);
    }*/

}
