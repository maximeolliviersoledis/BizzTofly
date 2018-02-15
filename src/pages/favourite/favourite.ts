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

    ngOnInit() {
        this.getWishlist();
    }

    navcart() {
        this.navCtrl.push("CartPage");
    }

    buyNow(productId) {
        this.navCtrl.push("ProductDetailsPage", {
            productId: productId
        });
    }


    isFavourite(): boolean {
        return this.favouriteItems.length == 0 ? false : true;
    }


    removeFromFavourites(productId) {
        this.favouriteService.removeFromFavourite(productId)
            .subscribe(response => {
                console.log("res--" + JSON.stringify(response));
                this.getWishlist();
            })

    }

    getWishlist() {
        if (this.isLoggedin()) {
            let loader = this.loadingCtrl.create({
                content: 'please wait...'
            })
            loader.present();
            this.userService.getUser()
                .subscribe(user => {
                    this.favouriteService.getFavourites(user._id)
                        .subscribe(response => {
                            this.favouriteItems = response;
                            console.log("fav-list-"+JSON.stringify(response));
                            loader.dismiss();
                        }, (error) => {
                            loader.dismiss();
                        })
                })
        }
    }

    isLoggedin(): boolean {
        return localStorage.getItem('token') ? true : false;
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
