import {Component, ViewChild} from '@angular/core';
import {NavController, IonicPage, LoadingController, Slides} from 'ionic-angular';
import {Service} from '../../app/service';
import {HomeService} from './home.service';

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [Service, HomeService]
})
export class HomePage {
    categories: any[];
   // featured: any[];
    cartItems: any[];
    noOfItems: number;
    searchInput: string;
    searchResults: any[];
    searching: boolean;
    searchPlaceholder: string;
    slideProducts: any[] = [];
    currentProduct: any = {};
    @ViewChild(Slides) slides: Slides;

    constructor(public navCtrl: NavController,
                public service: Service,
                public homeService: HomeService,
                public loadingCtrl: LoadingController) {

        this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
        if (this.cartItems != null) {
            this.noOfItems = this.cartItems.length;
        }
        this.searching = false;
        this.searchPlaceholder = "Que recherchez-vous?";
    }

    ionViewDidLoad() {
        let loader = this.loadingCtrl.create({
            content: 'please wait..'
        })
        loader.present();
        this.homeService.getCategories()
            .subscribe(response => {
                this.categories = response;
                for(var i of this.categories){
                    i.image = this.homeService.getImageUrlForCategory(i.id_category);
                }
                loader.dismiss();
            }, error => {
                loader.dismiss();
            })

       this.getSlideProducts();

    }

    navigate(MenuId) {
        console.log(MenuId);
        this.navCtrl.push("ProductListPage",
            {MenuId: MenuId}
        );
    }

    navcart() {
        this.navCtrl.push("CartPage");
    }

    onSearch($event){
        this.searchPlaceholder = "Que recherchez-vous?";
        if(this.searchInput.length > 2){
            this.searching = true;
            this.service.search('query='+this.searchInput+'&language=1')
            .subscribe((response) => {     
                this.searching = false;           
                if(response.products){                    
                    this.searchResults = response.products;
                }else{
                    this.searchInput = "";
                    this.searchPlaceholder = "Aucun résultat";
                }
            })
        }else{
            this.searchResults = [];
        }
       
    }

    offSearch($event){

    }

    goToProductPage(productId) {
        console.log(productId);
        this.navCtrl.push("ProductDetailsPage", {
            productId: productId
        });
    }

    getSlideProducts(){
        this.homeService.getSlideCategorie().subscribe(data => {
            this.slideProducts = data;
            this.currentProduct = this.slideProducts[0];
        })
    }

    goToProduct(){
        this.goToProductPage(this.currentProduct.id_product);
    }

    onChange(next){
        console.log(this.slides.realIndex);
        this.currentProduct = this.slideProducts[this.slides.realIndex];
        /*var id = this.currentProduct.id_product;
        var index = this.slideProducts.findIndex(function(elem){
            return elem.id_product === id;
        })
        if(next){
            /*if(++index > this.slideProducts.length-1){
                index--;
            }
            this.currentProduct = this.slideProducts[index];
        }
        else{
            /*if(--index < 0 )
                index++;
            this.currentProduct = this.slideProducts[index];
        }*/
    }
}
