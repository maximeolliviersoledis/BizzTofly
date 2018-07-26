import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, IonicPage, Events} from 'ionic-angular';
import {Nav, Platform} from 'ionic-angular';
import {AboutUsService} from './about-us-service';

@IonicPage()
@Component({
    selector: 'page-about-us',
    templateUrl: 'about-us.html',
    providers: [AboutUsService]
})
export class AboutUsPage {
    @ViewChild(Nav) nav: Nav;
    header_data:any;
    aboutUs: any;

    constructor(public platform: Platform,
                public navCtrl: NavController,
                public navParams: NavParams,
                private events:Events,
                private aboutService:AboutUsService) {
        this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'About Us'};        
    }

    ionViewDidLoad(){
        this.aboutService.getAboutUs().subscribe((data) => {
            this.aboutUs = data.content.content[0].value;
        })
    }

    ionViewWillLeave(){
        this.events.publish("hideSearchBar");
    }

    getCmsImage(){
        
    }

    /*goToSlide() {
        this.slides.slideTo(2, 500);
    }

    gotogoogleMap() {
        this.navCtrl.push("LocationPage");
    }*/
}
