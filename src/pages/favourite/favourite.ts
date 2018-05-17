import {Component} from '@angular/core';
import {NavController, NavParams, IonicPage, LoadingController, ToastController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {UserService} from '../../providers/user-service';
import {FavouriteService} from './favourite.service';


@IonicPage()
@Component({
    selector: 'page-favourite',
    templateUrl: 'favourite.html',
    providers: [FavouriteService]
})
export class FavouritePage {
    favouriteItems: any[] = [];
    cartItems: any[] = [];
    noOfItems: number;
    bg: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public storage: Storage,
                public userService: UserService,
                public favouriteService: FavouriteService) {

        this.bg = 'assets/img/bg.jpg';
        this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
        if (this.cartItems != null) {
            this.noOfItems = this.cartItems.length;
        }
    }
    favouriteList: any[] = [];
    ngOnInit() {
        this.favouriteList = JSON.parse(localStorage.getItem('favourite'));
        for(var favourite of this.favouriteList){
            this.favouriteService.getProduct(favourite).subscribe(data => {
                this.favouriteItems.push(data);
            })
        }
    }

    navcart() {
        this.navCtrl.push("CartPage");
    }

    buyNow(productId) {
        this.navCtrl.push("ProductDetailsPage", {
            productId: productId
        });
    }

    removeFromFavourites(productId){
        console.log("remove : "+productId);
        for(var i=0; i<this.favouriteItems.length;i++){
            if(this.favouriteItems[i].id == productId){
                this.favouriteItems.splice(i,1);
            }

            if(this.favouriteList[i] == productId){
                this.favouriteList.splice(i,1);
                localStorage.setItem('favourite',JSON.stringify(this.favouriteList));
            }
        }
    }


    isFavourite(): boolean {
        return this.favouriteItems.length == 0 ? false : true;
    }


    isLoggedin(): boolean {
        return JSON.parse(localStorage.getItem('user')).token ? true : false;
    }


    createToaster(message, duration) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
    }

    home() {
        this.navCtrl.push("HomePage");
    }
}
