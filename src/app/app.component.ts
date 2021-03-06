import {Component, ViewChild} from '@angular/core';
import {Nav, Platform,Events, NavController, App, AlertController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Service} from '../app/service';
import {OneSignal} from '@ionic-native/onesignal';
import {SocketService } from '../providers/socket-service';
import {TranslateService} from 'ng2-translate';
import {Storage} from '@ionic/storage';
import {CategoryService} from '../pages/category/category.service';
import {FCM} from '@ionic-native/fcm';
import {UniqueDeviceID} from '@ionic-native/unique-device-id';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions';
import {Network} from '@ionic-native/network';
import {ConstService} from '../providers/const-service';

@Component({
    templateUrl: 'app.html',
    selector: 'MyApp',
    providers: [Service,CategoryService, FCM, UniqueDeviceID, NativePageTransitions, Network]

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
                public events:Events,
                public translateService:TranslateService,
                private storage:Storage,
                public category:CategoryService,
                private fcm:FCM,
                private uniqueDeviceId:UniqueDeviceID,
                public nativeTransition:NativePageTransitions,
                private network:Network,
                private app:App,
                private constService:ConstService,
                private alertCtrl:AlertController) {

        platform.ready().then((res) => {
            //Récupère la langue par défaut du système, si celle-ci n'a pas été définie 
            if(!localStorage.getItem('lang')){
                let lang = window.navigator.language;
                //Indique la langue dans le bon format (Même nom que les fichiers json)
                if(lang.search('-')  != -1){
                    lang = lang.split('-')[0];
                }
                platform.setLang(lang, true);
            }

            //s'il n'y a pas de pays par défaut déjà enregistré, alors on le déduit à partir de la langue du système 
            if(!localStorage.getItem('country')){
                let country = window.navigator.language;
                if(country.search('-') != -1){
                    country = country.split('-')[1];
                }
                this.service.getCountryByIsoCode(country).subscribe(countryData => {
                    console.log(countryData);
                    if(countryData && country.length !=0){
                        this.service.getCountryById(countryData.countries[0].id).subscribe(data => {
                            if(data)
                                localStorage.setItem('country', JSON.stringify(data.country));
                        })
                    }
                })
            }
            console.log(window.navigator);
            this.useTranslateService();
            /*A tester, doit permettre au page d'activer l'animation quand elles sont pop*/
            //Marche mais augmenter le délai pour que ce soit plus beau
            platform.registerBackButtonAction(() => {
                if(this.app.getActiveNav().canGoBack()){
                    let options: NativeTransitionOptions = {
                        direction: 'right', //up, left, right, down
                        duration: 500,
                        slowdownfactor: 3,
                        slidePixels: 20,
                        iosdelay: 0,
                        androiddelay: 0,
                        fixedPixelsTop: 56, //Nb de pixel du header à garder
                        fixedPixelsBottom: 0 //Nb de pixel du footer à garder
                    };
                    this.nativeTransition.slide(options); //Pas trop mal
                    this.app.getActiveNav().pop();
                }else{
                    this.platform.exitApp();
                }
            })

            if (res == 'cordova') {
                //Si l'appli perd la connexion envoie vers la page prévu à cet effet
                this.network.onDisconnect().subscribe(data => {
                    //alert('Vous avez été déconnecté');
                    //alert(this.nav.getActive().name);
                    this.constService.createAlert({message: 'You have been disconnected. Please check your network connection'})                 

                    if(this.rootPage != null)
                        this.nav.setRoot('NoNetworkPage',{
                            previous_page: this.nav.getActive().name
                        });
                    else
                        this.rootPage = "NoNetworkPage";
                    //this.rootPage = "NoNetworkPage";
                    //this.nav.push("NoNetworkPage");
                })

               /* this.network.onConnect().subscribe(data =>{
                    //alert('Vous êtes connecté');
                })*/
                
                this.fcm.getToken().then(token => {
                    this.uniqueDeviceId.get().then(uuid => {
                        this.service.getNotification(uuid != null ? uuid : '',token, this.platform.is('ios')).subscribe((data)=> {
                           // alert(data);
                        });

                        this.storage.get('user').then(userData => {
                            if(userData && userData.id_customer){
                                this.service.updateCustomerNotificationUuid(uuid, userData.id_customer).subscribe();
                            }
                        })
                    })                    
                }).catch((error) => {
                    alert(error);
                });

                this.enableNotification();
                this.fcm.onNotification().subscribe(data => {
                    if(data.wasTapped){
                        let params = data.landing.split('/');

                        //Applique le format des pages 
                        //Doit commencer par une majuscule et se finir par le mot "Page"
                        var url = params[0].endsWith("Page") ? params[0] : params[0] + "Page";
                        url = url[0].toUpperCase() + url.substring(1,url.length);
                        console.log(params);
                        console.log(url);
                        if(!data.type){
                            this.nav.setRoot(url,{
                                id: params[1]
                            });
                        } else if(data.type == "Product"){
                            this.nav.setRoot("ProductDetailsPage",{
                                productId: data.id
                            })
                        } else if(data.type == "Category"){
                            this.nav.setRoot("ProductListPage",{
                                MenuId: data.id
                            })
                        }
                }else{
                  //  alert("Data wasn't tapped!");
                }
            })
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

           // statusBar.styleDefault();
            statusBar.hide();
            splashScreen.hide();
        });
    }

    ngOnInit(): any {
        this.service.getAppliSettings().subscribe(data => {
            this.appliSettings = data;

            if(this.appliSettings.is_in_maintenance){
                this.rootPage = "MaintenancePage";
                
            }else if (!this.isLogin()) {
                this.rootPage = "LoginPage";
            }else {
                this.rootPage = "HomePage";
                this.storage.get('user').then((userData) => {
                    this.constService.user = userData;
                    this.service.getWebServiceToken(userData.id_customer).subscribe((token) => {
                        console.log(token);
                        this.constService.accessToken = token.toString();
                    })
                })
                this.renderImage();
                this.listenEvents();
            }
            this.getCurrency();
            localStorage.setItem('appli_settings', JSON.stringify(this.appliSettings));
            console.log(this.appliSettings);
        })
        
      //  this.useTranslateService();        
    }

    private enableNotification(){
        console.log("notification : "+JSON.parse(localStorage.getItem('notification')));
        var activ = JSON.parse(localStorage.getItem('notification'));
        this.uniqueDeviceId.get().then(uuid => {
            //Permet d'activer les notifications aux premiers lancement de l'appli
            this.service.enableNotification(uuid, activ == null? true : activ).subscribe(data => {
                //alert(data);
            })
        })
    }

    private useTranslateService(){
      let language = this.platform.lang() != null ? this.platform.lang() : 'en';
      console.log("language", language);
      language == 'ar' ? this.platform.setDir('rtl', true) : this.platform.setDir('ltr', true);
      this.translateService.use(language);
      /*let value= localStorage.getItem('language');
      let language = value!=null ? value:'en';
      language=='ar'?this.platform.setDir('rtl', true):this.platform.setDir('ltr', true);
      this.translateService.use(language);*/
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
        this.events.subscribe('get:currency', () => {
            this.getCurrency();
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
                this.category.getCategory(2).subscribe((data:any) => {
                    if(data.category.level_depth <= 2){
                        for(var child of data.category.associations.categories){
                            this.category.getCategory(child.id).subscribe((childData:any) => {
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



    /**
    * Toutes les options pour les transitions
    * Slide options : duration, direction, delay, slowdownfactor, slidePixels, fixedPixelsTop, fixedPixelsBottom
    * Fade options : duration, delay
    * Drawer options : duration, action ("open","close"), origin("right"), delay
    * Flip options : duration, direction, delay, backgroundColor (doit commencer par '#')
    * direction values : ['up', 'bottom', 'left', 'right']
    **/

    gotoCart() {
        /*let options: NativeTransitionOptions = {
            direction: 'left', //up, left, right, down
            duration: 500,
            slowdownfactor: 3,
            slidePixels: 20,
            iosdelay: 100,
            androiddelay: 500,
            fixedPixelsTop: 54,
            fixedPixelsBottom: 0
        };
        this.nativeTransition.slide(options); //Pas trop mal*/
        this.nav.push("CartPage", {
            test: 3
        });
    }

    yourOrders() {
       /* let options: NativeTransitionOptions = {
            direction: 'up',
            duration: 500,
            slowdownfactor: 3,
            slidePixels: 20,
            iosdelay: 100,
            androiddelay: 150,
            fixedPixelsTop: 0,
            fixedPixelsBottom: 60
        };
        this.nativeTransition.flip(options); //Bof*/
        this.nav.push("OrdersPage");
    }

    favourite() {        
       /* let options: NativeTransitionOptions = {
            direction: 'up',
            duration: 1000,
            slowdownfactor: 3,
            slidePixels: 200,
            iosdelay: 100,
            androiddelay: 500,
            fixedPixelsTop: 0,
            fixedPixelsBottom: 60
        };
        this.nativeTransition.fade(options); //Pas trop mal*/
        this.nav.push("FavouritePage");
    }

    offer() {
        this.nav.push("OfferPage");
    }

    contact() {
        //Bug reste sur le côté droite de l'écran
        //Le bug est surement causé par le menu (pas tout à fait fermer quand la transition s'exeute) => il faudrait s'assurer que le menu soit totalement 
        //fermer avant de push la vue
        //Bug tout le temps en fait => l'animation ne va ps jusqu'au bout
        /*let options: NativeTransitionOptions = {
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
        this.nativeTransition.drawer(options);*/ 
        this.nav.push("ContactPage");
    }

    settings() {
       this.nav.push("Settings");
    }

    aboutUs() {
        this.nav.push("AboutUsPage");
    }

    orderStatus(){
      this.nav.push("OrderStatusPage");
    }

    login() {
        this.nav.setRoot("LoginPage");
    }

    goToChatPage(){
        this.nav.push("ChatPage");
    }
    
    logout() {
        this.storage.remove('user');
        this.storage.remove('cart');
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('id_cart');
        this.constService.accessToken = null;
        this.constService.user = null;
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

  displayParametersChoice: boolean = false;
  changeDisplayParametersChoice(){
      this.displayParametersChoice = !this.displayParametersChoice;
  }

  goToAdressPage(){
        this.nav.push("AddressListPage",{
          amountDetails: 0,
          cartData: null,
          manageAddress: true,
          noOfItems: this.noOfItems  
      })
  }

 goToReductionPage(){
    this.nav.push("ReductionListPage");
 }

 getCurrency(){
     var country = JSON.parse(localStorage.getItem('country'));
     if(country && country.id_currency != 0){
         this.service.getCurrency(country.id_currency).subscribe((currencyData) => {
             this.constService.currency = currencyData.currency;
             this.updateCartPrice();
            // localStorage.setItem('currency', JSON.stringify(currencyData.currency));
         });
     }else{
         //Get the default currency
         this.service.getCurrency(0).subscribe((currencyData) => {
             this.constService.currency = currencyData;
             this.updateCartPrice();
            // localStorage.setItem('currency', JSON.stringify(currencyData));
         });
     }
 }

 updateCartPrice(){
     console.log('UPDATE PRICE APPELE');
     this.storage.get('cart').then(cartData => {
         if(cartData){
             const currency = JSON.parse(localStorage.getItem('currency'));
             console.log(currency);
             for(var product of cartData){
                 console.log(product);
                 if(currency && currency.id != product.id_currency)
                     console.log("product last currency doesn't match the last currency");
                 if(product.id_currency != this.constService.currency.id){
                     if(this.constService.currency.conversion_rate != 1)
                         product.price *= this.constService.currency.conversion_rate;
                     else if(currency && currency.conversion_rate){
                         console.log("rate == 1", currency.conversion_rate);
                         product.price = product.price / currency.conversion_rate;
                     }

                     for(var dec of product.declinaison){
                         if(this.constService.currency.conversion_rate != 1)
                             dec.endPrice *=  this.constService.currency.conversion_rate;
                         else if(currency && currency.conversion_rate)
                             dec.endPrice = dec.endPrice / currency.conversion_rate;
                     }
                     product.id_currency = this.constService.currency.id;
                 }
             }

             console.log('update price', cartData);
             this.storage.set('cart', cartData);
             localStorage.setItem('currency', JSON.stringify(this.constService.currency));
         }
     })
 }
}
