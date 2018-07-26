import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Slides,IonicPage, Events} from 'ionic-angular';
import { OfferService } from './offer.service'; 
import { Storage } from '@ionic/storage';
import { ConstService } from '../../providers/const-service';


@IonicPage()
@Component({
    selector: 'page-offer',
    templateUrl: 'offer.html',
    providers: [OfferService]
})
export class OfferPage {
    @ViewChild(Slides) slides: Slides;
    productsInPromo: any[] = [];
    header_data: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private offerService:OfferService,
                private storage:Storage,
                private events:Events,
                private constService:ConstService) {
        this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Offers'};        
    }

    ngOnInit() {
      this.constService.presentLoader();
      this.storage.get('user').then(userData => {
        var customerId = userData && userData.id_customer ? userData.id_customer : null;
        this.offerService.getAllProducts(customerId).subscribe(data => {
          this.productsInPromo = data;
        })
      })
      this.constService.dismissLoader();
    }

    ionViewWillLeave(){
        this.events.publish("hideSearchBar");
    }

    gotoNextSlide() {
        this.slides.slideNext();
    }

    gotoPrevSlide() {
        this.slides.slidePrev();
    }

    buyNow() {
        this.navCtrl.push("ProductDetailsPage", {
            //productId: productId
            product: this.productsInPromo[this.slides.realIndex] //OK car les produits sont envyés dans l'ordre croissant de leur id
        });
    }

}
