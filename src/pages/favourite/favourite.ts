import {Component} from '@angular/core';
import {NavController, NavParams, IonicPage, LoadingController, ToastController, Events} from 'ionic-angular';
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
    noOfItems: number = 0;
    bg: any;
    header_data: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public storage: Storage,
                public userService: UserService,
                public favouriteService: FavouriteService,
                private events:Events) {

        this.bg = 'assets/img/bg.jpg';
        this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Favourite'};        

    }
    favouriteList: any[] = [];
    ngOnInit() {
        this.storage.get('user').then((userData)=>{
            if(userData && userData.token){
                this.favouriteService.getFavourite(userData.id_customer).subscribe(data => {
                    console.log(data);
                    for(var product of data){
                        this.favouriteService.getProduct(product.id_product).subscribe(product => {
                            this.favouriteItems.push(product);
                        })
                    }                    
                })
            }
        })
    }
    
    ionViewWillLeave(){
        this.events.publish("hideSearchBar");
    }

    navcart() {
        this.navCtrl.push("CartPage");
    }

    //Possibilité de réellement payer sa liste de souhait grâce au module presta
    buyNow(productId) {
        this.navCtrl.push("ProductDetailsPage", {
            productId: productId
        });
    }

    removeFromFavourites(productId){
        this.storage.get('user').then((userData)=>{
            if(userData && userData.token){
                this.favouriteService.removeFromFavourite(productId, 1,userData.id_customer).subscribe(data => {
                    console.log(data);
                    for(var i=0; i<this.favouriteItems.length;i++){
                        if(this.favouriteItems[i].id == productId){
                            this.favouriteItems.splice(i,1);
                        }
                    }
                })
            }
        })
    }


    isFavourite(): boolean {
        return this.favouriteItems.length == 0 ? false : true;
    }


    isLoggedin(): boolean {
        return JSON.parse(localStorage.getItem('userLoggedIn')) ? true : false;
    }


    createToaster(message, duration) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
    }

    home() {
        this.navCtrl.setRoot("HomePage");
    }
}
