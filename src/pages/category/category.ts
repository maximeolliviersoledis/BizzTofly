import {Component} from '@angular/core';
import {NavController,NavParams, IonicPage,LoadingController} from 'ionic-angular';
import {Service} from '../../app/service';
import {CategoryService} from './category.service';
import {Storage} from '@ionic/storage';


@IonicPage()
@Component({
    selector: 'page-category',
    templateUrl: 'category.html',
    providers: [Service, CategoryService]
})
export class CategoryPage {
    categories: any[] = [];
    level: number = 2;
    lastCategoryId: number = 0;
    noOfItems: number = 0;
        /**Searchbar**/
    searchInput: string;
    searchResults: any[];
    searching: boolean;
    searchPlaceholder: string;
    lastSearch: any[] = [];
    constructor(public navCtrl: NavController,
                private loadingCtrl:LoadingController,
                public categoryService:CategoryService,
                public nav:NavParams,
                private storage:Storage,
                public service:Service) {

        this.storage.get('cart').then((data)=>{
            if(data){
                for(var items of data){
                    this.noOfItems += items.quantity;
                }
            }
        })
     }

    ionViewDidLoad(){
        let loader=this.loadingCtrl.create({
            content:'please wait'
        })
        loader.present();

        this.categoryService.getCategory(2).subscribe(categories => {
             this.lastCategoryId = categories.category.id;
             console.log(this.lastCategoryId);
             var subCategories = categories.category.associations;
             if(subCategories && subCategories.categories){
                 for(var sub of subCategories.categories){
                     this.categoryService.getCategory(sub.id).subscribe(category => {
                         if(category.category.level_depth>=2 && category.category.active == 1){
                            var categ: any = {};
                            categ.id = category.category.id;
                            categ.id_parent = category.category.id_parent;
                            categ.name = category.category.name[0].value;
                            categ.description = category.category.description[0].value;
                            categ.level = category.category.level_depth;
                            categ.image = this.categoryService.getUrlForImage(categ.id);
                            if(category.category.associations && category.category.associations.categories)
                                categ.id_enfants = category.category.associations.categories;

                            this.categories.push(categ);
                        }
                     })
                 }
             }

            this.searching = false;
            this.searchPlaceholder = "Que recherchez-vous?";
             loader.dismiss();
        })

        /*this.categoryService.getAllCategories().subscribe(categories => {

            for(var id of categories.categories){
                this.categoryService.getCategory(id.id).subscribe(category => {
                    if(category.category.level_depth>=2 && category.category.active == 1){
                        var categ: any = {};
                        categ.id = category.category.id;
                        categ.id_parent = category.category.id_parent;
                        categ.name = category.category.name[0].value;
                        categ.description = category.category.description[0].value;
                        categ.level = category.category.level_depth;
                        if(category.category.associations && category.category.associations.categories)
                            categ.id_enfants = category.category.associations.categories;

                        this.categories.push(categ);
                    }
                    console.log(this.categories);
                });
            }
            loader.dismiss();
        })*/
        /*this.categoryService.getCategories()
        .subscribe(categories=>{
            console.log("res-"+JSON.stringify(categories));
            this.categories=categories;
            loader.dismiss();
        },error=>{
            loader.dismiss();
        })*/
    }

    getSubCategories(categoryId){
        var index = this.categories.findIndex(function(elem){
            return elem.id == categoryId;
        })
        console.log(this.categories[index].id_enfants.length);
        for(var child of this.categories[index].id_enfants){
            var childAlreadyPresent = this.categories.find(function(elem){
                return elem.id == child.id;
            })

            if(!childAlreadyPresent){
                this.categoryService.getCategory(child.id).subscribe(category => {
                    console.log(category);
                    var categ: any = {};
                    categ.id = category.category.id;
                    categ.image = this.categoryService.getUrlForImage(categ.id);
                    categ.id_parent = category.category.id_parent;
                    categ.name = category.category.name[0].value;
                    categ.description = category.category.description[0].value;
                    categ.level = category.category.level_depth;

                    if(category.category.associations && category.category.associations.categories)
                        categ.id_enfants = category.category.associations.categories;

                    this.categories.push(categ);
                })
            }
        }
    }


    goBack(){
        console.log(this.categories);
        if(this.level>2){
            console.log("lastCategory avant  = "+this.lastCategoryId);
            var id = this.lastCategoryId;
            var index = this.categories.findIndex(function(elem){
                return elem.id == id;
            })
            this.lastCategoryId = this.categories[index].id_parent;
            console.log("lastCategory = "+this.lastCategoryId);
            this.level--;
        }
    }

    navigate(category) {
        if(category.id_enfants){
            this.lastCategoryId = category.id;
            this.getSubCategories(category.id);
            this.level++;
        }else{
            this.navCtrl.push("ProductListPage",
            {
                MenuId: category.id,
            });
        }
    }


    navcart() {
        this.navCtrl.push("CartPage");
    }

    /**Searchbar**/
    displayLastSearch: boolean = false;
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
        console.log("offSearch");
        this.displayLastSearch = false;
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
        this.displaySearchBar = false;
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
