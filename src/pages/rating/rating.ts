import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {RatingService} from './rating.service';


@IonicPage()
@Component({
    selector: 'page-rating',
    templateUrl: 'rating.html',
    providers:[RatingService]
})
export class RatingPage {

  review: any = {
    menuItem:'',
    order:'',
    rating: '',
    comment: ''
  }
  itemId: '';
  index: '';
  orderId: '';
  reviews: any[] = [];
  
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private ratingService:RatingService) {

             this.review.menuItem = this.navParams.get('itemId');
             this.review.order = this.navParams.get('orderId');
             let review = this.navParams.get('review');
             this.review.rating=review.rating;
             this.review.comment=review.comment;
           }


    onSubmit() {
        console.log('review obj' + JSON.stringify(this.review));
        this.ratingService.submitReview(this.review)
        .subscribe(review=>{
          console.log("review-"+JSON.stringify(review));
          this.review.comment='';
          this.navCtrl.push("OrderDetailsPage",{
            orderId:this.review.order
          })
        })

    }

}
