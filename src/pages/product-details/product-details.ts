import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, LoadingController, ToastController, IonicPage} from 'ionic-angular';
import {Service} from '../../app/service';
import {Storage} from '@ionic/storage';
import {ProductDetailsService} from './product-details.service';

@IonicPage()
@Component({
    selector: 'page-product-details',
    templateUrl: 'product-details.html',
    providers: [Service, ProductDetailsService]
})
export class ProductDetailsPage {
    count: number = 1;
    productId: number;
    noOfItems: number;
    cartItems: any[];
    ExtraOptions: any[] = [];
    itemInCart: any[] = [];
    Cart: any[] = [];
    prices: any[] = [{value: ''}];
    product: any = {
        name:'',
        sizeOption: {},
        extraOption: []
    };
    productDetails: any = {};
    like: boolean = false;

    constructor(public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                public toastCtrl: ToastController,
                public navParams: NavParams,
                public storage: Storage,
                public service: Service,
                public productDetailsService: ProductDetailsService) {

        this.productId = navParams.get('productId');
        this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
        if (this.cartItems != null) {
            this.noOfItems = this.cartItems.length;
        }
        this.storage.get('favourite').then((favourite) => {
            this.favourites = favourite;
        })
        this.storage.get('favourite').then((favourites) => {
            this.favouriteItems = favourites;
        })
    }

    ngOnInit() {
        let loader = this.loadingCtrl.create({
            content: 'please wait'
        })

        loader.present();
        this.productDetailsService.getMenuItemDetails(this.productId)
            .subscribe(product => {
                console.log("product-"+JSON.stringify(product));
                loader.dismiss();
                let details:any=product;
                this.productDetails = product;
                this.product.productId = details._id;
                this.product.name = details.title;
                this.product.imageUrl = details.thumb;
                this.product.ratingFlag=0;
                this.product.rating=0;
            }, error => {
                loader.dismiss();
            })
            
        if(localStorage.getItem('token')){
           this.checkfavourite();
        }
 
    }

    checkfavourite() {
        this.productDetailsService.checkFavourite(this.productId)
            .subscribe(res => {
                this.like = res.resflag;
            })
    }


    addToCart(productId) {
        if (this.product.sizeOption.value == null) {
            let alert = this.alertCtrl.create({
                title: 'Please!',
                subTitle: 'Select Size and Price!',
                buttons: ['OK']
            });
            alert.present();
        }
        else {
            this.Cart = JSON.parse(localStorage.getItem("cartItem"));
            if (this.Cart == null) {
                this.product.Quantity = this.count;
                if (this.product.sizeOption.specialPrice) {
                    this.product.itemTotalPrice = this.product.Quantity * this.product.sizeOption.specialPrice;
                } else {
                    this.product.itemTotalPrice = this.product.Quantity * this.product.sizeOption.value;
                }
                let proExtraPrice = 0;
                for (let i = 0; i <= this.product.extraOption.length - 1; i++) {
                    proExtraPrice = proExtraPrice + Number(this.product.extraOption[i].selected);
                    this.product.extraPrice = proExtraPrice;
                }

                this.itemInCart.push(this.product);
                localStorage.setItem('cartItem', JSON.stringify(this.itemInCart));

            }
            else {

                for (let i = 0; i <= this.Cart.length - 1; i++) {
                    if (this.Cart[i].productId == productId && this.Cart[i].sizeOption.pname==this.product.sizeOption.pname) {
                        this.Cart.splice(i, 1);

                    }
                }
                this.product.Quantity = this.count;
                if (this.product.sizeOption.specialPrice) {
                    this.product.itemTotalPrice = this.product.Quantity * this.product.sizeOption.specialPrice;
                } else {
                    this.product.itemTotalPrice = this.product.Quantity * this.product.sizeOption.value;
                }
                let proExtraPrice = 0;
                for (let i = 0; i <= this.product.extraOption.length - 1; ++i) {
                    proExtraPrice = proExtraPrice + Number(this.product.extraOption[i].selected);
                    this.product.extraPrice = proExtraPrice;
                }

                this.Cart.push(this.product);
                localStorage.setItem('cartItem', JSON.stringify(this.Cart));
            }
            this.navCtrl.push("CartPage");

        }
    }

    checkOptions(option) {
        if (this.product.extraOption.length !== 0) {
            for (let i = 0; i <= this.product.extraOption.length - 1; i++) {
                if (this.product.extraOption[i].name == option.name) {
                    this.product.extraOption.splice(i, 1);
                    break;
                }
                else {
                    this.product.extraOption.push(option);
                    break;
                }
            }
        }
        else {
            this.product.extraOption.push(option);
        }
    }

    sizeOptions(price) {
        this.product.sizeOption = price;
    }

    add() {
        if (this.count < 10) {
            this.count = this.count + 1;
        }
    }

    remove() {
        if (this.count > 1) {
            this.count = this.count - 1;
        }
    }

    home() {
        this.navCtrl.push("HomePage");
    }

    navcart() {
        this.navCtrl.push("CartPage");
    }

    //Add favourite

    visible = true;
    favourites: any[] = [];
    favourite: any[] = [];
    favouriteItems: any[] = [];


    toggleFavourite() {
        this.visible = !this.visible;
    }

    addToFavourite(productId) {
        if (localStorage.getItem('token')) {
            this.productDetailsService.addToFavourite(this.productId)
                .subscribe(res => {
                    console.log("liked!!!");
                    this.like = true;
                    this.createToaster('added to favourites!', 3000);
                })
        } else {
            this.createToaster('please login first!', 3000);
        }
    }

    removeFromFavourite(productId) {
        if (localStorage.getItem('token')) {
            this.productDetailsService.removeToFavourite(this.productId)
                .subscribe(res => {
                    console.log("unliked!!!");
                    this.like = false;
                    this.createToaster('removed from favourites!', 3000);
                })
        }

    }

    createToaster(message, duration) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
    }


}

