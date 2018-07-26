import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SearchService } from './search.service';
import { ConstService } from '../../providers/const-service';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: [SearchService]
})
export class SearchPage {
  header_data: any;
  searchResults: any;
  displayNoContent: boolean = false;
  maxItem: number = 0;
  items: any[] = [];
  nbOfItemToLoad: number = 8; //Charge les items 5 par 5, ce chiffre peut-être défini par le module de paramtrage

  constructor(public navCtrl: NavController, public navParams: NavParams, private searchService:SearchService, public constService:ConstService) {
        this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Search results'};  	
        this.searchResults = this.navParams.get('results');
        this.maxItem = this.searchResults.length;
        var number = JSON.parse(localStorage.getItem('appli_settings'));
        this.nbOfItemToLoad = number && number.nb_item_infinite_scroll ? number.nb_item_infinite_scroll : 5;
  }

  ionViewDidLoad() {
    if(this.searchResults == null)
    	this.displayNoContent = true;
    else{
        for(var i = 0; i<this.nbOfItemToLoad; i++){
          this.searchService.getProduct(this.searchResults[i].id).subscribe(data => {
            this.items.push(data);
          });
        }
     }      
   }

  goToProductPage(productId){
  	this.navCtrl.push('ProductDetailsPage', {
  		"productId": productId
  	})
  }

  infinite($event){
    //Si le nombre de produit restant à charger est inférieur au nombre de produit à charger alors charge les produits restants, 
    //sinon charge le nombre de produit à charger normal
    var nbOfProductToLoad = this.maxItem - this.items.length < this.nbOfItemToLoad ? this.maxItem : this.nbOfItemToLoad + this.items.length; 

    for(var i = this.items.length; i < nbOfProductToLoad; i++){
      this.searchService.getProduct(this.searchResults[i].id).subscribe(data => {
        this.items.push(data);

        if(this.items.length == this.maxItem)
          $event.enable(false);

        if(this.items.length == this.items.length - nbOfProductToLoad)
          $event.complete();
      })
    }
  }
}
