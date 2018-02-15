import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BookTableService } from './table-booking.service';


@IonicPage()
@Component({
  selector: 'page-table-booking',
  templateUrl: 'table-booking.html',
  providers:[BookTableService]
})

export class TableBookingPage {
 
 public bookingInfo:any={
    //tableNumber:'',
    time:'',
    date:'',
    person: '',
    status: 'pending',
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private bookTableService:BookTableService
              ) {
  }

  
  onClickBookTable(){
    //console.log("data-"+JSON.stringify(this.bookingInfo));
    this.bookTableService.bookTable(this.bookingInfo)
    .subscribe(res=>{
      //console.log("response-"+JSON.stringify(res));
    })
  }

}
