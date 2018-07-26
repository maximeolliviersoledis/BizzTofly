import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams,LoadingController} from 'ionic-angular';
import {OrderStatusService} from './order-status.service';

@IonicPage()
@Component({
    selector: 'page-order-status',
    templateUrl: 'order-status.html',
    providers: [OrderStatusService]
})
export class OrderStatusPage {
    order: any = {};
    allStatus: any[] = [];
    currentStateDetails: any = {};
    header_data: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private loadingCtrl:LoadingController,
                public orderStatusService: OrderStatusService) {

        this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Order Status'};        
      this.order = this.navParams.get('order').order;
      console.log(this.order);
    }

    ionViewDidLoad() {
        this.orderStatusService.getAllStatus().subscribe((statusData) => {
            this.allStatus = this.objectToArray(statusData.order_states);
            this.currentStateDetails = this.allStatus.find((elem) => {
                return elem.id == this.order.current_state;
            });

           this.orderStatusService.getStatusById(this.currentStateDetails.id).subscribe(statusDetails => {
               this.currentStateDetails = statusDetails;
           })
        })
    }

    orderIsPaid(){
        return this.currentStateDetails.order_state.paid == 1 || this.currentStateDetails.order_state.paid == '1' ? true : false;
    }

    orderWillBeSoonDelivered(){
        var state = this.currentStateDetails.order_state;
        return ((state.shipped == '1' || state.shipped == 1) && (state.delivery == '1' || state.delivery == 1)) ? true : false;
    }

    private objectToArray(object){
      let item = Object.keys(object);
      let array = [];
      for(var i of item){
        array.push(object[i]);
      }
      return array;
    }

}
