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
    orderId: string;
    status: any = {
        userNotification: []
    };

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private loadingCtrl:LoadingController,
                public orderStatusService: OrderStatusService) {

        this.orderId = this.navParams.get("orderId");
    }

    ionViewDidLoad() {
        /*console.log('ionViewDidLoad OrderStatusPage');
        let loader =this.loadingCtrl.create({
            content:'please wait'
        })
        loader.present();
        this.orderStatusService.getStatus(this.orderId)
            .subscribe(status => {
                console.log("status-"+JSON.stringify(status));
                this.status = status;
                loader.dismiss();
            },error=>{
                loader.dismiss();
            })*/
    }

}
