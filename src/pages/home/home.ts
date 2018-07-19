import {Component, ViewChild} from '@angular/core';
import {NavController, IonicPage, LoadingController, Slides, Searchbar, Events} from 'ionic-angular';
import {Service} from '../../app/service';
import {HomeService} from './home.service';
import {Storage} from '@ionic/storage';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions';
import {ConstService} from '../../providers/const-service';
//import * as CryptoJS from 'crypto-js';
import CryptoJS from 'crypto-js';
import Base64Url from 'base64url';

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [Service, HomeService, NativePageTransitions]
})
export class HomePage {
    categories: any[];
    cartItems: any[];
    displayLastSearch: boolean = false;
    noOfItems: number = 0;
    slideProducts: any[] = [];
    currentProduct: any = {};
    welcomeProducts: any[] = [];
    header_data: any;
    @ViewChild(Slides) slides: Slides;

    constructor(public navCtrl: NavController,
                public service: Service,
                public homeService: HomeService,
                public loadingCtrl: LoadingController,
                private storage:Storage,
                private pageTransition:NativePageTransitions,
                private event:Events,
                private constService:ConstService) {
        //A sup juste pour tester le jwt
       /* var test_header = {
            "alg": "HS512",
            "typ": "JWT"
        };

        var content = {
            "message": "My message",
            "data": "Some other datas"
        };
        var content_hash = Base64Url.encode(JSON.stringify(content));
        var header_hash = Base64Url.encode(JSON.stringify(test_header));
        var verif = CryptoJS.HmacSHA512(header_hash+"."+content_hash, "mysecretkey");
       /* console.log(verif.toString());
        console.log(header_hash+"."+content_hash+"."+Base64Url.encode(verif.toString()));
        console.log(Base64Url.encode(verif.toString()));

        this.homeService.testJWT("data="+header_hash+"."+content_hash+"."+Base64Url.encode(verif.toString())).subscribe((data) => {

        })*/

        //var content_hash = CryptoJS.HmacSHA256(JSON.stringify(content)).toString();
        //var header_hash = CryptoJS.HmacSHA256(JSON.stringify(test_header)).toString();
       // var verif = CryptoJS

        this.storage.get('cart').then((cartData)=>{
            this.cartItems = cartData;
            if(this.cartItems != null) {
                for(var items of this.cartItems){
                    this.noOfItems += items.quantity;
                }
            }
        })
        this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'BizzToFly'};     
    }
    /*ionViewWillLeave(){
     let options: NativeTransitionOptions = {
        direction: 'up',
        duration: 500,
        slowdownfactor: 3,
        slidePixels: 20,
        iosdelay: 100,
        androiddelay: 150,
        fixedPixelsTop: 0,
        fixedPixelsBottom: 60
       };

     this.pageTransition.slide(options);
    }*/

    /**
    * Toutes les options pour les transitions
    * Slide options : duration, direction, delay, slowdownfactor, slidePixels, fixedPixelsTop, fixedPixelsBottom
    * Fade options : duration, delay
    * Drawer options : duration, action ("open","close"), origin("right"), delay
    * Flip options : duration, direction, delay, backgroundColor
    * direction values : ['up', 'bottom', 'left', 'right']
    **/
    ionViewDidLoad() {
       this.constService.presentLoader();
       this.storage.get('user').then((userData) => {
           var customerId = userData && userData.id_customer ? userData.id_customer : null;
           this.getSlideProducts(customerId);
           this.getAccueilProducts(customerId);
       })
       this.constService.dismissLoader();
    }

    ionViewWillLeave(){
        this.event.publish("hideSearchBar");
    }

    navigate(MenuId) {
        console.log(MenuId);
        this.navCtrl.push("ProductListPage",
            {MenuId: MenuId}
        );
    }

    navcart() {
        let options: NativeTransitionOptions = {
            direction: 'up',
            duration: 500,
            slowdownfactor: 3,
            slidePixels: 200,
            iosdelay: 100,
            androiddelay: 1500,
            fixedPixelsTop: 100,
            fixedPixelsBottom: 100
        };
        this.pageTransition.slide(options); //Erreur cordova missing
        this.navCtrl.push("CartPage");
    }

    goToProductPage(productId, product = null, productName = null) {
        product != null ? this.navCtrl.push("ProductDetailsPage", {
            product: product
        }) : this.navCtrl.push("ProductDetailsPage", {
            productId: productId
        });           
    }

    getSlideProducts(customerId){
        var id = JSON.parse(localStorage.getItem('appli_settings')).slide_category;
        this.homeService.getCategory(id, customerId).subscribe(data => {
            this.slideProducts = data;
            this.currentProduct = this.slideProducts[0];
        })
    }

    getAccueilProducts(customerId){
        var id = JSON.parse(localStorage.getItem('appli_settings')).accueil_category;
        this.homeService.getCategory(id, customerId).subscribe(data => {
               this.welcomeProducts = data;            
        })
    }

    onChange(next){
        console.log(this.slides.realIndex);
        this.slides.autoplayDisableOnInteraction = false;
        this.currentProduct = this.slideProducts[this.slides.realIndex];
    }
}
