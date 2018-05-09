import {Component} from '@angular/core';
import {NavController, IonicPage, LoadingController} from 'ionic-angular';
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
    featured: any[];
    cartItems: any[];
    noOfItems: number;


    constructor(public navCtrl: NavController,
                public service: Service,
                public homeService: HomeService,
                public loadingCtrl: LoadingController) {

        this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
        if (this.cartItems != null) {
            this.noOfItems = this.cartItems.length;
        }

        this.service.getData()
            .subscribe((response) => {
                this.featured = response.featured;
            })
    }

    ionViewDidLoad() {
        let loader = this.loadingCtrl.create({
            content: 'please wait..'
        })
        loader.present();
        this.homeService.getCategories()
            .subscribe(response => {
                this.categories = response;
                console.log(this.categories);
                loader.dismiss();
            }, error => {
                loader.dismiss();
            })

        this.homeService.getUpcomings()
            .subscribe(upcomings => {
            })
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

}
