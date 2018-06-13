import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {RatingService} from './rating.service';
import {Storage} from '@ionic/storage';


@IonicPage()
@Component({
    selector: 'page-rating',
    templateUrl: 'rating.html',
    providers:[RatingService]
})
export class RatingPage {

  review: any = {
    productId: 0,
    customerId: 0,
    rating: 3,
    comment: '',
    title: ''
  }
  comments: any[] = [];
  header_data: any;
  user: any;
  displayForm:boolean = false;
  
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private ratingService:RatingService,
              private storage:Storage,
              public toastCtrl:ToastController) {

            this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Rate product'};

            this.storage.get('user').then((data)=>{
              this.user = data;
              this.ratingService.getComments(this.navParams.get('productId'),this.user && this.user.id_customer ? this.user.id_customer:0).subscribe(data => {
                this.comments = data;
              })
            })
           }

           onSubmit(f){
             this.storage.get('user').then((data)=>{
               if(!data){
                 this.toastCtrl.create({
                      message: "Veuillez vous connecter avant de laisser un commentaire",
                      duration: 2000
                  }).present();
                 this.navCtrl.push("LoginPage");
               }
               else{
                 this.ratingService.postComments(this.navParams.get('productId'), data.id_customer, this.review.rating, this.review.title, this.review.comment).subscribe((data)=>{
                   console.log(data);
                 })
               }
             })
           }

           usefullComment(comment){
             console.log(comment);
             if(this.user)
               this.ratingService.postCommentUsefulness(comment.id_product_comment,this.user.id_customer,true).subscribe(data =>{
                 console.log(data);
               });
           }

           uselessComment(comment){
             console.log(comment);
             if(this.user)
               this.ratingService.postCommentUsefulness(comment.id_product_comment,this.user.id_customer,false).subscribe(data => {
                 console.log(data);
               });
           }

           reportComment(comment){
             console.log(comment);
             if(this.user)
               this.ratingService.postReportComment(comment.id_product_comment, this.user.id_customer).subscribe(data => {
                 console.log(data);
               })
           }  

           show(){
             this.displayForm = !this.displayForm;
           }

}
