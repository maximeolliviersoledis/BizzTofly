import {Component} from '@angular/core';
import {NavController, NavParams, IonicPage,LoadingController} from 'ionic-angular';
import {Service} from '../../app/service';
import {OrderDetailsService} from './order-details.service';

@IonicPage()
@Component({
    selector: 'page-order-details',
    templateUrl: 'order-details.html',
    providers: [OrderDetailsService]

})
export class OrderDetailsPage {
    orderId: '';
    orderDetails: any = {};
    private review:any={};
    private loader:any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private loadingCtrl:LoadingController,
                public service: Service,
                public orderDetailsService: OrderDetailsService) {

                this.orderId = this.navParams.get('orderId')
    }


    ionViewDidEnter() {
        this.loader =this.loadingCtrl.create({
            content:'please wait'
        })
         this.loader.present();
        this.orderDetailsService.getOrderDetails(this.orderId)
            .subscribe(order => {
                this.orderDetails = order;
                this.loader.dismiss();
                console.log("order-details-"+JSON.stringify(this.orderDetails));
               // this.getReviews();
            },error=>{
                 this.loader.dismiss();
            })

    }

    private getReviews(){
          this.orderDetailsService.getRating(this.orderId)
            .subscribe(review=>{
                console.log("review-"+JSON.stringify(review));
                this.review=review;
                  this.loader.dismiss();
              // this.getRatings();
            
            })
    }

   private getRatings(){
         for (let i = 0; i < this.orderDetails.cart.length; i++) {
                for (let j = 0; j < this.review.length; j++) {
                 if(this.orderDetails.cart[i].productId==this.review[j].menuItem){
                   this.orderDetails.cart[i].rating=this.review[j].rating;
                   this.orderDetails.cart[i].ratingFlag=1;
                   this.orderDetails.cart[i].comment=this.review[j].comment;
                 }
               }
            } 
    }

    rate(itemId) {
        console.log("id---"+itemId);
        this.navCtrl.push("RatingPage",{
            itemId:itemId,
            orderId: this.orderId,
            review:this.review
        });
    }

    trackOrder() {
        this.navCtrl.push("OrderStatusPage",
            {orderId: this.orderId});
    }

    buyAgain(productId){
        this.navCtrl.push("ProductDetailsPage",{
            productId:productId
        })
    }
}
