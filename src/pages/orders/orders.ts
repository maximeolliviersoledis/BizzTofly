import {Component} from '@angular/core';
import {NavController, IonicPage,LoadingController} from 'ionic-angular';
import {OrdersService} from './orders.service';

@IonicPage()
@Component({
    selector: 'page-orders',
    templateUrl: 'orders.html',
    providers: [OrdersService]
})
export class OrdersPage {
    orders: any[] = [];
    featured: any[] = [];

    constructor(public navCtrl: NavController,
                private loadingCtrl:LoadingController,
                private orderService: OrdersService) {
    }


    ngOnInit() {

        let loader = this.loadingCtrl.create({
            content:'please wait'
        })
        loader.present();
        this.orderService.getOrders()
            .subscribe(orders => {
                this.orders = orders;
                loader.dismiss();
            },error=>{
                loader.dismiss();
            })
    }

    orderDetails(orderId) {
        this.navCtrl.push("OrderDetailsPage", {
            orderId: orderId
        });
    }

    navcart(){
        this.navCtrl.push("CartPage");
    }

    isOrder(): boolean {
        return this.orders.length == 0 ? false : true;
    }
}
