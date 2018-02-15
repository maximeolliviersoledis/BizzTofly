import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Slides,IonicPage,LoadingController} from 'ionic-angular';
import { OfferService } from './offer.service'; 


@IonicPage()
@Component({
    selector: 'page-offer',
    templateUrl: 'offer.html',
    providers: [OfferService]
})
export class OfferPage {
    @ViewChild(Slides) slides: Slides;
    offerProducts: any[] = [];
    offerPrice: number;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private loadingCtrl:LoadingController,
                private offerItemsService:OfferService) {
    }

    ngOnInit() {
       let loader= this.loadingCtrl.create({
           content:'please wait..'
       })
       loader.present();
        this.offerItemsService.getMenuItems()
        .subscribe(menuItems=>{
            console.log("items-"+JSON.stringify(menuItems));
            this.offerProducts=menuItems;
            loader.dismiss();
        },
        error=>{
            loader.dismiss();
        })

    }

    gotoNextSlide() {
        this.slides.slideNext();
    }

    gotoPrevSlide() {
        this.slides.slidePrev();
    }

    buyNow(productId) {
        this.navCtrl.push("ProductDetailsPage", {
            productId: productId
        });
    }

}
