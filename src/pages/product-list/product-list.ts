import {Component} from '@angular/core';
import {NavController, NavParams, ToastController, LoadingController, IonicPage} from 'ionic-angular';
import {Service} from '../../app/service';
import {ProductListService} from './product-list.service';

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
    noOfItems: number;


    constructor(public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                public service: Service,
                public productListService: ProductListService,
                public navParams: NavParams,
                public toastCtrl: ToastController) {

        this.menuId = navParams.get('MenuId')
        this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
        if (this.cartItems != null) {
            this.noOfItems = this.cartItems.length;
        }
    }

    ngOnInit() {
        let loader = this.loadingCtrl.create({
            content: 'please wait'
        })
        loader.present();
        this.productListService.getMenuItems(this.menuId)
            .subscribe(response => {
                console.log(JSON.stringify(response));
                loader.dismiss();
                this.menuItems = response;
                this.items = this.menuItems;
            }, error => {
                loader.dismiss();
            })
    }

    initializeItems() {
        this.items = this.menuItems;
    }


    getItems(ev: any) {
        this.initializeItems();
        let val = ev.target.value;
        if (val && val.trim() != '') {
            this.items = this.items.filter((data) => {
                return (data.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
    }


    navigate(productId) {
        this.navCtrl.push("ProductDetailsPage", {
            productId: productId
        });
    }

    navcart() {
        this.navCtrl.push("CartPage");
    }


}
