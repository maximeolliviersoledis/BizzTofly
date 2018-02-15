import {Component, ViewChild} from '@angular/core';
import {Nav, Platform,Events} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Service} from '../app/service';
import {OneSignal} from '@ionic-native/onesignal';
import {SocialSharing} from '@ionic-native/social-sharing';
import {SocketService } from '../providers/socket-service';
import {UserService} from '../providers/user-service';
import {TranslateService} from 'ng2-translate';


@Component({
    templateUrl: 'app.html',
    selector: 'MyApp',
    providers: [Service, OneSignal,SocialSharing]

})
export class MyApp {
    noOfItems: number;
    newsCounter: number;
    offerCounter = 0;
    @ViewChild(Nav) nav: Nav;

    rootPage: any;
    imageUrl:string='assets/img/profile.jpg';

    constructor(public platform: Platform,
                public service: Service,
                public socketService:SocketService,
                private userService:UserService,
                statusBar: StatusBar,
                splashScreen: SplashScreen,
                public oneSignal: OneSignal,
                public socialSharing:SocialSharing,
                public events:Events,
                public translateService:TranslateService) {
         alert('ici1');

        platform.ready().then((res) => {
            if (res == 'cordova') {
                this.oneSignal.startInit('230d3e93-0c29-49bd-ac82-ecea8612464e', '714618018341');
                this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
                this.oneSignal.handleNotificationReceived().subscribe(() => {
                });
                this.oneSignal.handleNotificationOpened().subscribe(() => {
                    console.log("notification opened!");
                });
                this.oneSignal.endInit();
            }
            statusBar.styleDefault();
            splashScreen.hide();
        });


        this.service.getData()
            .subscribe((response) => {
                this.newsCounter = response.newsList.length;
                for (let i = 0; i <= response.menuItems.length - 1; i++) {
                    if (response.menuItems[i].offer != null) {
                        this.offerCounter = this.offerCounter + 1;

                    }
                }
            })
    }

     ngOnInit(): any {
        alert('ici2');
        if (!this.isLogin()) {
            this.rootPage = "LoginPage";
        }
        else {
            this.rootPage = "HomePage";
            this.socketService.establishConnection();
            this.renderImage();
            this.listenEvents();
        }
        this.useTranslateService();
    }


    private useTranslateService(){
      // let value= localStorage.getItem('language');
      // let language = value!=null ? value:'en';
      // this.translateService.use(language);
      let value= localStorage.getItem('language');
      let language = value!=null ? value:'en';
      language=='ar'?this.platform.setDir('rtl', true):this.platform.setDir('ltr', true);;
      this.translateService.use(language);
    }
    
   private renderImage(){
       if(this.isLogin()){
        this.userService.getUser()
        .subscribe(user=>{
         this.imageUrl=user.imageUrl!=null?this.imageUrl=user.imageUrl:this.imageUrl='assets/img/profile.jpg';
        }, error =>{
         this.nav.setRoot("LoginPage");
        })
       }
        
    }

   public listenEvents(){
        this.events.subscribe('imageUrl',(imageUrl)=>{
            this.imageUrl=imageUrl;
            //console.log("listen----->>>>>>"+imageUrl);
            this.renderImage();
        })
    }


    isLogin() {
        return localStorage.getItem('token') != null;
    }


    home() {
        this.nav.setRoot("HomePage");
    }

    catagory() {
        this.nav.push("CategoryPage");
    }

    gotoCart() {
        this.nav.push("CartPage");
    }

    yourOrders() {
        this.nav.push("OrdersPage");
    }

    favourite() {
        this.nav.push("FavouritePage");
    }

    bookTable(){
        this.nav.push("TableBookingPage");
    }

    bookHistory(){
        this.nav.push("BookingHistoryPage");
    }

    offer() {
        this.nav.push("OfferPage");
    }

    news() {
        this.nav.push("NewsPage");
    }

    contact() {
        this.nav.push("ContactPage");
    }

    settings() {
        this.nav.push("Settings");
    }

    aboutUs() {
        this.nav.push("AboutUsPage");
    }
     invite() {
    this.socialSharing.share("share Restaurant App with friends to get credits", null, null, 'https://ionicfirebaseapp.com/#/');
  }
    
    chat(){
      this.nav.push("ChatPage");
    }
     orderStatus(){
      this.nav.push("OrderStatusPage");
    }
    login() {
        this.nav.setRoot("LoginPage");
    }

    logout() {
        localStorage.removeItem('token');
        this.events.publish('imageUrl','assets/img/profile.jpg')
        this.nav.setRoot("LoginPage");
    }

    isCart() {
      let cart = JSON.parse(localStorage.getItem('cartItem'));
      cart != null?this.noOfItems = cart.length:this.noOfItems=null;
    return true;  
  }

}
