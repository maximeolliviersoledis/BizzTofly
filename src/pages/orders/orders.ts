import {Component} from '@angular/core';
import {NavController, IonicPage,LoadingController, Platform, Events} from 'ionic-angular';
import {OrdersService} from './orders.service';
import {Storage} from '@ionic/storage';
import {ConstService} from '../../providers/const-service';

@IonicPage()
@Component({
    selector: 'page-orders',
    templateUrl: 'orders.html',
    providers: [OrdersService]
})
export class OrdersPage {
    orders: any[] = [];
    featured: any[] = [];
    header_data:any;
    nbOfItemToLoad: number;
    maxItem: number = 0;
    allOrders: any[] = [];

    constructor(public navCtrl: NavController,
                private loadingCtrl:LoadingController,
                private orderService: OrdersService,
                private storage:Storage,
                private platform:Platform,
                private events:Events,
                private constService:ConstService) {
        this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Orders'};        
        var number = JSON.parse(localStorage.getItem('appli_settings'));
        this.nbOfItemToLoad = number && number.nb_item_infinite_scroll ? number.nb_item_infinite_scroll : 10;
    }

    ngOnInit() {
        this.constService.presentLoader();
        this.storage.get('user').then((customer) => {
            if(customer && customer.id_customer){
                this.orderService.getOrders(customer.id_customer).subscribe(orders => {
                    console.log(orders);                  
                    this.allOrders = orders.orders;
                    this.maxItem = orders.orders.length;
                    /*for(var order of orders.orders){
                        this.orderService.getOrderById(order.id).subscribe(data => {
                            console.log(data);
                            //data.order.date_add = data.order.date_add.replace(/-/g, "/");
                            //Pour ios essayer de remplacer les tires par des ':'
                            this.orders.push(data);
                        })
                    }*/
                    for(var i = 0; i < this.nbOfItemToLoad; i++){
                        this.orderService.getOrderById(orders.orders[i].id).subscribe(data => {
                            this.orders.push(data);
                        })
                    }
                })
            }
            this.constService.dismissLoader();
        }).catch(() => {
            this.constService.dismissLoader();
        })
    }

    ionViewWillLeave(){
        this.events.publish("hideSearchBar");
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

    infinite($event){
        /*let oldItemLength = this.orders.length;
        console.log(oldItemLength + this.nbOfItemToLoad);
        for(var i = this.orders.length; i < this.nbOfItemToLoad + this.orders.length; i++){
          this.orderService.getOrderById(this.allOrders[i].id).subscribe(data => {
            this.orders.push(data);
            console.log(this.orders.length, i);
            if(this.orders.length == this.maxItem)
              $event.enable(false);

            if(this.orders.length == oldItemLength)
              $event.complete();
          })
        }*/

        var nbOfOrderToLoad =  this.maxItem - this.orders.length < this.nbOfItemToLoad ? this.maxItem : this.nbOfItemToLoad + this.orders.length; 
        console.log(nbOfOrderToLoad);
        for(let i = this.orders.length; i < nbOfOrderToLoad; i++){
            console.log(i);
            this.orderService.getOrderById(this.allOrders[i].id).subscribe(data => {
                this.orders.push(data);

                if(this.orders.length == this.maxItem)
                  $event.enable(false);

                if(this.orders.length == nbOfOrderToLoad)
                  $event.complete();
            })          
        }
    }
    
}
