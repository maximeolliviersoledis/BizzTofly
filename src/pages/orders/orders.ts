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
        var customer = JSON.parse(localStorage.getItem('user'));
        console.log(customer);
        if(customer && customer.id_customer){
            this.orderService.getOrders(customer.id_customer).subscribe(orders => {
                console.log(orders);
                for(var order of orders.orders){
                    this.orderService.getOrderById(order.id).subscribe(data => {
                        console.log(data);
                        this.orders.push(data);
                    })
                }
            })
        }
        loader.dismiss();

        /*this.orderService.getOrders()
            .subscribe(orders => {
                this.orders = orders;
                loader.dismiss();
            },error=>{
                loader.dismiss();
            })*/
    }

    orderDetails(order) {
        this.navCtrl.push("OrderDetailsPage", {
            order: order
        });
    }

    navcart(){
        this.navCtrl.push("CartPage");
    }

    isOrder(): boolean {
        return this.orders.length == 0 ? false : true;
    }
}
