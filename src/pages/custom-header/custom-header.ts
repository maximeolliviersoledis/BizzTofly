import { Component,Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Service } from '../../app/service';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions';


@IonicPage()
@Component({
  selector: 'custom-header',
  templateUrl: 'custom-header.html',
  providers: [Service, NativePageTransitions]
})
export class CustomHeaderPage {

      header_data: any;
      cartItems:any[];
      noOfItems:number = 0;
      searchInput: string;
      searchResults: any[];
      searching: boolean;
      searchPlaceholder: string;
      lastSearch: any[] = [];
      
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage:Storage,
              private service:Service,
              private pageTransition:NativePageTransitions) {


        this.searching = false;
        this.searchPlaceholder = "Que recherchez-vous?";

        this.storage.get('cart').then((data)=>{
            if(data){
                for(var items of data){
                    this.noOfItems += items.quantity;
                }
            }
        })
  }

  @Input()
    set header(header_data: any) {
        this.header_data = header_data;
    }

    get header() {
        return this.header_data;
    }

    gotoCart() {
        if(!this.header_data.isCart){
             /*let options: NativeTransitionOptions = {
                direction: 'up',
                action: "open",
                origin: "left",
                duration: 500,
                slowdownfactor: 3,
                slidePixels: 0,
                iosdelay: 100,
                androiddelay: 150,
                fixedPixelsTop: 0,
                fixedPixelsBottom: 0
               };

            this.pageTransition.drawer(options);*/
            this.navCtrl.push("CartPage");
        }
    }

    gotoHome() {
        this.navCtrl.setRoot("HomePage");
    }

    displayLastSearch: boolean = false;
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
            console.log(this.lastSearch);
        })
    }

    completeUserInput(keyword){
        this.searchInput = keyword;
        this.displayLastSearch = false;
        this.onSearch(null);
    }

    saveSearchInput(keyword){
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

    goToProductPage(productId, productName = null) {
        console.log(productId);
        this.displayLastSearch = false;
        this.saveSearchInput(productName);           
        this.navCtrl.push("ProductDetailsPage", {
            productId: productId
        });
    }
    
    displaySearchBar: boolean = false;
    showSearchBar(){
        this.displaySearchBar = !this.displaySearchBar;
        this.displayLastSearch = false;
    }

}
