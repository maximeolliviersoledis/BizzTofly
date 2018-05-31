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
import {LocalNotifications} from '@ionic-native/local-notifications';
import {Push, PushObject, PushOptions} from '@ionic-native/push';
import {FCM} from '@ionic-native/fcm';
import {UniqueDeviceID} from '@ionic-native/unique-device-id';

@Component({
    templateUrl: 'app.html',
    selector: 'MyApp',
    providers: [Service, OneSignal,SocialSharing,CategoryService, LocalNotifications, FCM, UniqueDeviceID]

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
                //private userService:UserService,
                statusBar: StatusBar,
                splashScreen: SplashScreen,
                public oneSignal: OneSignal,
                public socialSharing:SocialSharing,
                public events:Events,
                public translateService:TranslateService,
                private storage:Storage,
                public category:CategoryService,
                public localNotification:LocalNotifications,
                private fcm:FCM,
                private uniqueDeviceId:UniqueDeviceID) {
         

        platform.ready().then((res) => {
            console.log(res);
            //alert(res);

            console.log(platform);
            /*if(platform.is('android')){
                alert('Android system detected');
            }*/

               /* this.fcm.getToken().then(token => {
                    alert(token);
                }).catch((error) => {
                    alert(error);
                });*/


            if (res == 'cordova') {
               // alert('res == cordova');
                this.fcm.getToken().then(token => {
                    alert(token);
                    this.uniqueDeviceId.get().then(uuid => {
                        alert(uuid);
                        this.service.getNotification(uuid,token).subscribe((data)=> {
                            alert(data);
                        })
                    })
                    
                }).catch((error) => {
                    alert(error);
                });

                this.fcm.onNotification().subscribe(data => {
                    alert(JSON.stringify(data));
                    if(data.wasTapped){
                       // alert("Data was tapped!");
                        if(data.landing != 0){
                            //Marche pour la page produit details mais pas pour les autres
                            //il faudrait remplacer tous les noms de paramètres par le même nomà chaque fois (exemple: productId => id)
                            //Si les paramètres nécessaires ne sont pas spécifier, reste sur la page actuelle
                            let params = data.landing.split('/');
                            this.nav.setRoot(params[0],{
                                productId: params[1]
                                });
                            //this.nav.push(data.landing);


                        }
                    }else{
                        //Possibilité d'afficher la notif dans la barre de notification gràce a local notification
                        //==> reste juste à savoir si c'est utile ou pas
                        alert("Data wasn't tapped!");
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

            /*
            localNotification.schedule({
                id: 1,
                text: 'Notification'
            })*/
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
       /*if(this.isLogin()){
        this.userService.getUser()
        .subscribe(user=>{
         this.imageUrl=user.imageUrl!=null?this.imageUrl=user.imageUrl:this.imageUrl='assets/img/profile.jpg';
        }, error =>{
         this.nav.setRoot("LoginPage");
        })
       }*/

       if(!this.isLogin()){
           this.nav.setRoot("LoginPage");
       }else{
           /*this.storage.get('user').then((data)=>{
               console.log(data);
               if(data.image)
                   this.imageUrl = data.image;
           })*/
           this.storage.get('image').then((data)=>{
               if(data)
                   this.imageUrl = data;
           })
       }
        
    }

   public listenEvents(){
        /*this.events.subscribe('imageUrl',(imageUrl)=>{
            this.imageUrl=imageUrl;
            //console.log("listen----->>>>>>"+imageUrl);
            this.renderImage();
        })*/
        console.log(this.events);
        this.events.subscribe('image:changed',(imageUrl)=>{
            this.imageUrl = imageUrl;
            //this.renderImage();
        })
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
        //this.nav.push("CategoryPage");
        /*this.category.categoryService.getAllCategories().subscribe(data => {
            console.log(data);
        })*/
       /* if(!this.categories || this.categories.length == 0){
            this.category.getCategories().subscribe(data=>{
                console.log(data);
                //this.categories = data;
                for(var category of data){
                    if(category)
                }
            })*/

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
        //this.displayChildCategories = !this.displayChildCategories;
        this.displayAllCategories = !this.displayAllCategories;
        console.log(this.displayAllCategories);
    }

    categoryList(){
        this.nav.push("CategoryPage");
    }

    //subCategories: any[] = [];
    goToProductList(category){
        /*console.log("goToProductList appelé");
        this.displayAllCategories = !this.displayAllCategories;
        this.nav.push("ProductListPage", {
            MenuId: categoryId
        });*/
        if(category.category.level_depth <= 2 && category.category.associations.categories){
            for(var child of category.category.associations.categories){
                var childAlreadyPresent = this.categories.findIndex(function(elem){
                    return elem.category.id == child.id;
                })
                if(childAlreadyPresent == -1){
                    this.category.getCategory(child.id).subscribe(data => {
                        this.categories.splice(this.categories.indexOf(category)+1,0,data);
                        //this.categories.push(data);
                    })
                }
            }
            /*console.log(category.category.associations.categories);
            this.displayChildCategories = !this.displayChildCategories;
            if(!this.displayChildCategories){
                for(var i=0; i<this.categories.length;i++){
                            console.log(this.categories[i]);

                    for(var j=0; j<category.category.associations.categories.length;j++){
                        if(this.categories[i].category.id == category.category.associations.categories[j].id){
                            this.categories.splice(i,1);
                        }
                    }
                }
            }*/
            /*for(var i=0;i<category.category.associations.categories.length;i++){
                var childAlreadyPresent = this.categories.find(function(elem){
                    return elem.category.id == category.category.associations.categories[i];
                })
                if(!childAlreadyPresent){
                    this.category.getCategory(category.category.associations.categories[i].id).subscribe(data => {
                        this.categories.splice(i,0,data);
                        //this.categories.push(data);
                    })
                }
            }*/
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
        this.nav.push("CartPage");
    }

    yourOrders() {
        this.nav.push("OrdersPage");
    }

    favourite() {
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
        /*localStorage.removeItem('token');
        localStorage.removeItem('user');*/
        this.storage.remove('user');
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('id_cart');
        this.events.publish('imageUrl','assets/img/profile.jpg')
        this.nav.setRoot("LoginPage");
    }

    isCart() {
      //let cart = JSON.parse(localStorage.getItem('cartItem'));
      /*this.storage.get('cart').then((data)=>{
          data != null && data.length != null ?this.noOfItems = data.length:this.noOfItems=null;
      })*/
      var cart = JSON.parse(localStorage.getItem('cartLength'));
      cart != null ? this.noOfItems = cart:this.noOfItems=null;
      return true;  
  }

  shopsLocalisation(){
      this.nav.push("ShopsPage");
  }

}
