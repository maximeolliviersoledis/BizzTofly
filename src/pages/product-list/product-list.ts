import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, ToastController, LoadingController, IonicPage, Events} from 'ionic-angular';
import {Service} from '../../app/service';
import {ProductListService} from './product-list.service';
import {Storage} from '@ionic/storage';

@IonicPage()
@Component({
    selector: 'page-product-list',
    templateUrl: 'product-list.html',
    providers: [Service, ProductListService]
})
export class ProductListPage {
    menuItems: any[] = [{
        price: []
    }];
    items: any[] = [];
    menuId: number;
    cartItems: any[];
    noOfItems: number = 0;
    maxItem: number = 0;
    allProductsId: any[] = [];
    noOfItemToLoad: number = 0;
    header_data:any;


    constructor(public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                public service: Service,
                public productListService: ProductListService,
                public navParams: NavParams,
                public toastCtrl: ToastController,
                public storage: Storage,
                private events:Events) {

        this.menuId = navParams.get('MenuId');
        this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Product list'};

    }

    ngOnInit() {
        let loader = this.loadingCtrl.create({
            content: 'please wait'
        })
        loader.present();
            this.productListService.getCategory(this.menuId).subscribe(data => {
                console.log(data);
                this.allProductsId = data.category.associations.products;
                this.maxItem = data.category.associations.products.length;
                var products = data.category.associations.products;

                this.noOfItemToLoad = 0; // Nombre de produit max à charger
                //Inutile de séparer en plusieurs parties le chargement des produits s'il n'y en a pas beaucoup
                if(this.maxItem <= 5){
                    this.noOfItemToLoad = this.maxItem;
                }else{
                    this.noOfItemToLoad = this.maxItem / 2;
                }

                //Récupères tous les produits sans dépasser la limite max autorisée
                for(var i=0; i<this.noOfItemToLoad;i++){
                    this.productListService.getProduct(products[i].id).subscribe(response=>{
                        //console.log(response);
                        //On peut également retirer les id des produits à charger du tableau (évite les doublons)
                        this.items.push(response);
                    })
                }
            })
        loader.dismiss();
    }

    ionViewWillLeave(){
        this.events.publish("hideSearchBar");
    }

    navigateBack(){
        this.navCtrl.pop();
    }

    navigate(productId, item) {
        console.log(productId, item);
        this.navCtrl.push("ProductDetailsPage", {
            productId: productId,
            product: item
        });
    }

    infinite(event){
        var oldItemLength = this.items.length;
        //S'il ne reste pas suffisamment d'item à charger, on charge les derniers restants sinon on en recharge le maximum autorisé
        var nbToLoad = this.maxItem - this.items.length < this.noOfItemToLoad ? this.maxItem : this.noOfItemToLoad + this.items.length; 
        console.log(nbToLoad);
        for(var i=this.items.length; i<nbToLoad;i++)
        {
            this.productListService.getProduct(this.allProductsId[i].id).subscribe(data =>{
                this.items.push(data);
                //Si tous les items sont chargés, on désactive l'infinite scroll
                if(this.items.length == this.maxItem){
                    event.enable(false);
                }
                //Termine le loading de l'infinite scroll lorsque le nombre d'item est atteint
                if(this.items.length==oldItemLength+nbToLoad){
                    event.complete();
                }
            })
        }
    }

    priceIsReduced(product){
        return product.prices.specific_price < product.prices.normal_price ? true : false; 
    }
}
