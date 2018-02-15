import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import {BookingHistoryService} from './booking-history.service';
import {UserService } from '../../providers/user-service';

@IonicPage()
@Component({
  selector: 'page-booking-history',
  templateUrl: 'booking-history.html',
  providers:[BookingHistoryService]
})
export class BookingHistoryPage {

  public bookings: Array<{}>;
  private uid: string;
  private username: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl:LoadingController,
              private userService:UserService,
              private bookingHistoryService:BookingHistoryService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingHistoryPage');
    let loader = this.loadingCtrl.create({
      content:'please wait'
    })
    loader.present();
    this.userService.getUser().subscribe(user=>{
      this.bookingHistoryService.getBookingHistory(user._id)
    .subscribe(res=>{
      console.log("history-"+JSON.stringify(res));
      this.bookings=res;
      loader.dismiss();
    })
    })
    
  }

}
