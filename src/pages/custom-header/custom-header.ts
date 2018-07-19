import { Component,Input } from '@angular/core';
import { IonicPage, NavController, NavParams, Keyboard, Events, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Service } from '../../app/service';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';


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
              private pageTransition:NativePageTransitions,
              public keyboard:Keyboard,
              private events:Events,
              public platform:Platform) {


        this.searching = false;
        this.searchPlaceholder = "Que recherchez-vous?";

        this.storage.get('cart').then((data)=>{
            if(data){
                for(var items of data){
                    this.noOfItems += items.quantity;
                }
            }
        })

        this.events.subscribe("updateCartBadge", (quantity) => {
            console.log(quantity);
            this.noOfItems = quantity;
        });

        this.events.subscribe("hideSearchBar", () => {
            console.log("hideSearchBar");
            this.displaySearchBar = false;
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

    ionViewWillLeave(){
        this.displaySearchBar = false;
    }

    gotoHome() {
        this.navCtrl.setRoot("HomePage");
    }

    displayLastSearch: boolean = false;
    noResultFound: boolean = false;
    onSearch($event){
        this.searchPlaceholder = "Que recherchez-vous?";
        this.noResultFound = false;
        console.log(this.searchInput);
        console.log(this.keyboard.hasFocusedTextInput());
        if(this.searchInput.length > 2){
            this.searching = true;
            this.service.search('query='+this.searchInput+'&language=1')
            .subscribe((response) => {     
                this.searching = false;
                if(response.products){                    
                    this.searchResults = response.products;
                }else{
                    this.searchResults = [];
                    this.noResultFound = true;
                    this.searchPlaceholder = "Aucun résultat";
                 //   this.displayLastSearch = false;
                }
            })
        }else{
            this.searchResults = [];
        }
    }

    offSearch($event){
        this.displayLastSearch = false;
        this.noResultFound = false;
        /*if(this.keyboard.isOpen())
            this.keyboard.close();*/
        if(this.platform.is('ios') && this.keyboard.isOpen())
            setTimeout(this.keyboard.close(), 500);
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

    goToSearchPage($event){
      console.log(this.searchResults);
      if($event.keyCode === 13 && this.searchResults.length > 0)
          this.navCtrl.push("SearchPage", {
              results: this.searchResults
          });
    }

    //Temporary disabled on ios
    enableCancelButton(){
        if(this.platform.is('ios'))
            return false;

        return true;
    }

    deleteLastSearch(search){
        console.log(search);
        for(var i=0; i<this.lastSearch.length;i++){
            if(this.lastSearch[i] === search){
                this.lastSearch.splice(i,i+1);
            }
        }
        if(this.lastSearch.length == 0){
            this.storage.remove('search');
        }else{
            this.storage.set('search', this.lastSearch);
        }
    }
}
