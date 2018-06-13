import {Component, ViewChild} from '@angular/core';
import {Nav, Platform,Events, NavController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Service} from '../app/service';
import {OneSignal} from '@ionic-native/onesignal';
import {SocialSharing} from '@ionic-native/social-sharing';
import {SocketService } from '../providers/socket-service';
import {TranslateService} from 'ng2-translate';
import {Storage} from '@ionic/storage';
import {CategoryService} from '../pages/category/category.service';
import {FCM} from '@ionic-native/fcm';
import {UniqueDeviceID} from '@ionic-native/unique-device-id';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions';
import {Network} from '@ionic-native/network';

@Component({
    templateUrl: 'app.html',
    selector: 'MyApp',
    providers: [Service,SocialSharing,CategoryService, FCM, UniqueDeviceID, NativePageTransitions, Network]

})
export class MyApp {
    noOfItems: number;
    newsCounter: number;
    offerCounter = 0;
    @ViewChild(Nav) nav: Nav;
    rootPage: any;
    imageUrl:string='assets/img/profile.jpg';
    appliSettings: any = {};

    constructor(public platform: Platform,
                public service: Service,
                public socketService:SocketService,
                statusBar: StatusBar,
                splashScreen: SplashScreen,
                public socialSharing:SocialSharing,
                public events:Events,
                public translateService:TranslateService,
                private storage:Storage,
                public category:CategoryService,
                private fcm:FCM,
                private uniqueDeviceId:UniqueDeviceID,
                public nativeTransition:NativePageTransitions,
                private network:Network) {

        this.service.getAppliSettings().subscribe(data => {
            this.appliSettings = data;
            localStorage.setItem('appli_settings', JSON.stringify(this.appliSettings));
            console.log(this.appliSettings);
        })

        platform.ready().then((res) => {
            if (res == 'cordova') {
                //Peut permettre d'agir en conséquence lors de la perte de connexion pendant l'utilisation de l'appli
                this.network.onDisconnect().subscribe(data => {
                    alert('Vous avez été déconnecté');
                })

                this.network.onConnect().subscribe(data =>{
                    alert('Vous êtes connecté');
                })

                

                alert(this.network.type);
               // alert(this.network.downlinkMax);
                this.fcm.getToken().then(token => {
                    this.uniqueDeviceId.get().then(uuid => {
                        this.service.getNotification(uuid,token).subscribe((data)=> {
                            alert(data);
                        })
                    })                    
                }).catch((error) => {
                    alert(error);
                });

                this.enableNotification();
                //this.oneSignal.startInit('230d3e93-0c29-49bd-ac82-ecea8612464e', '714618018341');
                /*this.oneSignal.startInit('b8136cb8-5acd-42b5-ad2c-38598c360287','383564956806');
                //this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert); //Affiche une alerte classique avec le titre et le texte de la notif
                this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification); //Affiche une notif dans la barre de notif
                this.oneSignal.handleNotificationReceived().subscribe((data) => {
                    console.log(data);
                    alert(JSON.stringify(data));
                    alert('Notification received');
                });
                this.oneSignal.handleNotificationOpened().subscribe(() => {
                    console.log("notification opened!");
                    alert('Notification opened');
                });
                this.oneSignal.endInit();*/
            }

            statusBar.styleDefault();
            splashScreen.hide();
        });
    }

     ngOnInit(): any {
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

    private enableNotification(){
        //Prise en compte de l'activation ou non des notifs (à tester)
        //Marche pas
        console.log(localStorage.getItem('notification'));
        var activ = JSON.parse(localStorage.getItem('notification'));
        if(activ){ 
            console.log("Notif activ");
            this.fcm.onNotification().subscribe(data => {
                alert(JSON.stringify(data));
                if(data.wasTapped){
                    if(data.landing != 0){
                        let params = data.landing.split('/');
                                this.nav.setRoot(params[0],{
                                   productId: params[1]
                                });
                    }
                }else{
                     alert("Data wasn't tapped!");
                }
            })
        }else{
            alert("Notif not activated");
            //Envoyer vers presta la désactivation des notifs
            this.events.unsubscribe('notification:changed', () => {
                alert('EventListener unsubscribe');
            });
        }
    }

    private useTranslateService(){
      let value= localStorage.getItem('language');
      let language = value!=null ? value:'en';
      language=='ar'?this.platform.setDir('rtl', true):this.platform.setDir('ltr', true);;
      this.translateService.use(language);
    }
    
   private renderImage(){
       if(!this.isLogin()){
           this.nav.setRoot("LoginPage");
       }else{
           this.storage.get('image').then((data)=>{
               if(data)
                   this.imageUrl = data;
           })
       }
    }

   public listenEvents(){
        console.log(this.events);
        this.events.subscribe('image:changed',(imageUrl)=>{
            this.imageUrl = imageUrl;
        })
        this.events.subscribe('notification:changed', () => {
            if(this.platform.is('cordova'))
                this.enableNotification()
        });
    }

    isLogin() {
        return JSON.parse(localStorage.getItem('userLoggedIn')) != null;
    }

    home() {
        this.nav.setRoot("HomePage");
    }

    categories: any[] = [];
    displayAllCategories: boolean = false;
    displayChildCategories: boolean = false;
    catagory() {
            if(!this.categories || this.categories.length == 0){
                this.category.getCategory(2).subscribe(data => {
                    if(data.category.level_depth <= 2){
                        for(var child of data.category.associations.categories){
                            this.category.getCategory(child.id).subscribe(childData => {
                                this.categories.push(childData);
                            })
                        }
                    }
                })
            }
        this.displayAllCategories = !this.displayAllCategories;
    }

    categoryList(){
        this.nav.push("CategoryPage");
    }

    goToProductList(category){
        if(category.category.level_depth <= 2 && category.category.associations.categories){
            for(var child of category.category.associations.categories){
                var childAlreadyPresent = this.categories.findIndex(function(elem){
                    return elem.category.id == child.id;
                })
                if(childAlreadyPresent == -1){
                    this.category.getCategory(child.id).subscribe(data => {
                        this.categories.splice(this.categories.indexOf(category)+1,0,data);
                    })
                }
            }
        }else{
            this.displayAllCategories = !this.displayAllCategories;
            this.nav.push("ProductListPage", {
                MenuId: category.category.id
            });
        }
    }

    private getIndex(){

    }

    gotoCart() {
        let options: NativeTransitionOptions = {
            direction: 'left', //up, left, right, down
            duration: 500,
            slowdownfactor: 3,
            slidePixels: 20,
            iosdelay: 100,
            androiddelay: 150,
            fixedPixelsTop: 0,
            fixedPixelsBottom: 60
        };
        this.nativeTransition.slide(options); //Pas trop mal
        this.nav.push("CartPage");
    }

    yourOrders() {
        let options: NativeTransitionOptions = {
            direction: 'up',
            duration: 500,
            slowdownfactor: 3,
            slidePixels: 20,
            iosdelay: 100,
            androiddelay: 150,
            fixedPixelsTop: 0,
            fixedPixelsBottom: 60
        };
        this.nativeTransition.flip(options); //Bof
        this.nav.push("OrdersPage");
    }

    favourite() {        
        let options: NativeTransitionOptions = {
            direction: 'up',
            duration: 1000,
            slowdownfactor: 3,
            slidePixels: 20,
            iosdelay: 100,
            androiddelay: 500,
            fixedPixelsTop: 0,
            fixedPixelsBottom: 60
        };
        this.nativeTransition.fade(options); //Pas trop mal
        this.nav.push("FavouritePage");
    }

    /*bookTable(){
        this.nav.push("TableBookingPage");
    }

    bookHistory(){
        this.nav.push("BookingHistoryPage");
    }*/

    offer() {
        this.nav.push("OfferPage");
    }

    /*news() {
        this.nav.push("NewsPage");
    }*/

    contact() {
        //Bug reste sur le côté droite de l'écran
        //Le bug est surement causé par le menu (pas tout à fait fermer quand la transition s'exeute) => il faudrait s'assurer que le menu soit totalement 
        //fermer avant de push la vue
        //Bug tout le temps en fait => l'animation ne va ps jusqu'au bout
        let options: NativeTransitionOptions = {
            direction: 'up',
            action: "close", //action: "open" => provoque le bug
            origin: "right",
            duration: 500,
            slowdownfactor: 3,
            slidePixels: 0,
            iosdelay: 100,
            androiddelay: 150,
            fixedPixelsTop: 0,
            fixedPixelsBottom: 0
        };
        this.nativeTransition.drawer(options); 
        this.nav.push("ContactPage");
    }

    settings() {
        this.nav.push("Settings");
    }

    aboutUs() {
        this.nav.push("AboutUsPage");
    }
    /* invite() {
    this.socialSharing.share("share Restaurant App with friends to get credits", null, null, 'https://ionicfirebaseapp.com/#/');
  }
    
    chat(){
      this.nav.push("ChatPage");
    }*/
     orderStatus(){
      this.nav.push("OrderStatusPage");
    }
    login() {
        this.nav.setRoot("LoginPage");
    }

    logout() {
        this.storage.remove('user');
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('id_cart');
        this.events.publish('imageUrl','assets/img/profile.jpg')
        this.nav.setRoot("LoginPage");
    }

    isCart() {
      var cart = JSON.parse(localStorage.getItem('cartLength'));
      cart != null ? this.noOfItems = cart:this.noOfItems=null;
      return true;  
  }

  shopsLocalisation(){
      this.nav.push("LocationPage");
  }
}
