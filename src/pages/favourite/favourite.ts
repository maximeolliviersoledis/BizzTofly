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
    noOfItems: number = 0;
    bg: any;
    header_data: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public storage: Storage,
                public userService: UserService,
                public favouriteService: FavouriteService) {

        this.bg = 'assets/img/bg.jpg';
        /*this.storage.get('cart').then((data)=>{
            this.cartItems = data;
            if(this.cartItems){
                for(var items of this.cartItems){
                    this.noOfItems += items.quantity;
                }
            }
        })*/
        this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Favourite'};        

    }
    favouriteList: any[] = [];
    ngOnInit() {
        //this.favouriteList = JSON.parse(localStorage.getItem('favourite'));
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
        /*this.storage.get('favourite').then((favourite) => {
            this.favouriteList = favourite;
            if(this.favouriteList && this.favouriteList.length){
                for(var favourite of this.favouriteList){
                    this.favouriteService.getProduct(favourite).subscribe(data => {
                        this.favouriteItems.push(data);
                    })
                }
            }
        })*/

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
        /*console.log("remove : "+productId);
        for(var i=0; i<this.favouriteItems.length;i++){
            if(this.favouriteItems[i].id == productId){
                this.favouriteItems.splice(i,1);
            }

            if(this.favouriteList[i] == productId){
                this.favouriteList.splice(i,1);
                //localStorage.setItem('favourite',JSON.stringify(this.favouriteList));
                this.storage.set('favourite', this.favouriteList);
            }
        }*/
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
        this.navCtrl.push("HomePage");
    }
}
