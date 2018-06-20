import {Component, ViewChild} from '@angular/core';
import {NavController, IonicPage, LoadingController, Slides, Searchbar} from 'ionic-angular';
import {Service} from '../../app/service';
import {HomeService} from './home.service';
import {Storage} from '@ionic/storage';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions';

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [Service, HomeService, NativePageTransitions]
})
export class HomePage {
    categories: any[];
   // featured: any[];
    cartItems: any[];
    displayLastSearch: boolean = false;
    noOfItems: number = 0;
    searchInput: string;
    searchResults: any[];
    searching: boolean;
    searchPlaceholder: string;
    lastSearch: any[] = [];
    slideProducts: any[] = [];
    currentProduct: any = {};
    welcomeProducts: any[] = [];
    @ViewChild(Slides) slides: Slides;
    @ViewChild(Searchbar) searchbar: Searchbar;

    constructor(public navCtrl: NavController,
                public service: Service,
                public homeService: HomeService,
                public loadingCtrl: LoadingController,
                private storage:Storage,
                private pageTransition:NativePageTransitions) {

        //this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
        
        this.storage.get('cart').then((cartData)=>{
            this.cartItems = cartData;
            if(this.cartItems != null) {
                for(var items of this.cartItems){
                    this.noOfItems += items.quantity;
                }
            }
        })

        this.searching = false;
        this.searchPlaceholder = "Que recherchez-vous?";
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
        let loader = this.loadingCtrl.create({
            content: 'please wait..'
        })
        loader.present();
       /* this.homeService.getCategories()
            .subscribe(response => {
                this.categories = response;
                for(var i of this.categories){
                    i.image = this.homeService.getImageUrlForCategory(i.id_category);
                }
                loader.dismiss();
            }, error => {
                loader.dismiss();
            })*/

       this.storage.get('user').then((userData) => {
           var customerId = userData && userData.id_customer ? userData.id_customer : null;
           this.getSlideProducts(customerId);
           this.homeService.getAccueilProduct(customerId).subscribe(data => {
               console.log(data);
               this.welcomeProducts = data;
           })
       })

       loader.dismiss();
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

    noResultFound: boolean = false;
    onSearch($event){
        this.searchPlaceholder = "Que recherchez-vous?";
        this.noResultFound = false;

        if(this.searchInput.length > 2){
            this.searching = true;
            this.service.search('query='+this.searchInput+'&language=1')
            .subscribe((response) => {     
                this.searching = false;
                if(response.products){                    
                    this.searchResults = response.products;
                }else{
                    //this.searchInput = "";
                    this.searchResults = [];
                    this.noResultFound = true;
                    this.searchPlaceholder = "Aucun résultat";
                    this.displayLastSearch = false;
                }
            })
        }else{
            this.searchResults = [];
        }
    }

    offSearch($event){
        this.displayLastSearch = false;
        this.noResultFound = false;
    }
    onFocus($event){
        console.log("onFocus appelé");
        this.displayLastSearch = true;
        this.storage.get('search').then(data => {
            this.lastSearch = data;
        })
    }

    completeUserInput(keyword){
        console.log(this.searchbar);
        this.searchInput = keyword;
        this.displayLastSearch = false;
        this.onSearch(null);
    }

    saveSearchInput(keyword){
        if(keyword){
            this.storage.get('search').then(data => {
                this.lastSearch = data;
            })
            if(this.lastSearch){
                var keywordAlreadyPresent = this.lastSearch.find(function(elem){
                    return elem == keyword;
                })

                if(!keywordAlreadyPresent)
                    this.lastSearch.splice(0,0,keyword);
            }else{
                this.lastSearch = [];
                this.lastSearch.push(keyword);
            }
            this.storage.set('search',this.lastSearch);
        }
    }

    goToProductPage(productId, product = null, productName = null) {
        this.saveSearchInput(productName);
        product != null ? this.navCtrl.push("ProductDetailsPage", {
            product: product
        }) : this.navCtrl.push("ProductDetailsPage", {
            productId: productId
        });           
    }

    getSlideProducts(customerId){
        this.homeService.getSlideCategorie(customerId).subscribe(data => {
            this.slideProducts = data;
            this.currentProduct = this.slideProducts[0];
        })
    }

  /*  goToProduct(){
        this.goToProductPage(this.currentProduct.id_product);
    }*/

    onChange(next){
        console.log(this.slides.realIndex);
        this.slides.autoplayDisableOnInteraction = false;
        this.currentProduct = this.slideProducts[this.slides.realIndex];
    }
}
