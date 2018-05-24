import {Component} from '@angular/core';
import {NavController,Events, AlertController, NavParams, IonicPage, LoadingController, Platform} from 'ionic-angular';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Facebook} from '@ionic-native/facebook';
import {GooglePlus} from '@ionic-native/google-plus';
import {TwitterConnect} from '@ionic-native/twitter-connect';
import {LoginService} from './login.service';
import {UserService} from '../../providers/user-service';
import {SocketService } from '../../providers/socket-service';
import {Storage} from '@ionic/storage';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
    providers: [Facebook, GooglePlus, TwitterConnect, LoginService]
})
export class LoginPage {
    user: FormGroup;


    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public events:Events,
        public fb: FormBuilder,
        public facebook: Facebook,
        public googlePlus: GooglePlus,
        public loadingCtrl: LoadingController,
        public twitter: TwitterConnect,
        public platform: Platform,
        public loginService: LoginService,
        public userService:UserService,
        public socketService:SocketService,
        private storage:Storage) {
    }

    onLogin() {
        let loader = this.loadingCtrl.create({
            content: 'please wait'
        })
        loader.present();
        console.log(this.user.value);
        this.loginService.login(this.user.value)
        .subscribe(user => {
            console.log(user);
            loader.dismiss();
            if(user.token){
                /*localStorage.setItem('token',user.token);
                localStorage.setItem('user',JSON.stringify(user));*/
                console.log(user.id_customer)
                this.storage.set('user',user);
                localStorage.setItem('userLoggedIn',JSON.stringify(true));
                this.checkIfCartExist(user);
                if (this.navParams.get("flag") == 0) {
                    this.navCtrl.setRoot("CartPage");
                } else {
                    this.navCtrl.setRoot("HomePage");
                       // this.socketService.establishConnection();
                        //this.renderImage();
                    }
                }else if(user.error){
                    let alert = this.alertCtrl.create({
                        title: "Erreur login",
                        subTitle: "Noms d'utilisateurs ou mot de passe incorrect",
                        buttons: ['OK']
                    });
                    alert.present();
                }else{
                    console.log("Une erreur inconnue est survenue");
                    let alert = this.alertCtrl.create({
                        title: "Erreur!",
                        subTitle: "Une erreur inconnue est survenue",
                        buttons: ['OK']
                    });
                    alert.present();
                }
                
            }, error => {
                loader.dismiss();
            })
    }

    ngOnInit(): any {
        var emailRegex = "^[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,4}$";
        //Possibilité de se connecter que lorsque l'utilisateur saisit une adresse mail conforme à la regex si dessus
        //De plus, le mot de passe saisit doit faire au minimum 5 caractères (se mettre en accord avec la page d'inscription)
        
        this.user = this.fb.group({
            email: ['test2@test.fr', Validators.compose(
                [Validators.required,Validators.pattern(emailRegex)])],
            password: ['testtest', Validators.compose(
                [Validators.required, Validators.minLength(5)])],

        });
        /*this.user = this.fb.group({
            email: ['info@ionicfirebaseapp.com', Validators.required],
            password: ['123456', Validators.required],

        });*/
    }

    private renderImage(){
        this.userService.getUser()
        .subscribe(user=>{
            this.events.publish('imageUrl',user.imageUrl);
        })

        
    }


    doFbLogin() {
        let permissions = new Array();
        permissions = ["public_profile", "email", "user_education_history"];

        this.facebook.login(permissions)
        .then((success) => {
            this.facebook.api("/me?fields=id,name,email,gender,first_name,last_name", permissions).then((user) => {
                    //here post data to Api
                    localStorage.setItem('user', user.id);
                    this.navCtrl.setRoot("HomePage");
                }),
            (error) => {
                console.log(JSON.stringify(error));
                console.log('FAcebook not responding!');

            }

        }, error => {
            console.log("FaceBook ERROR : ", JSON.stringify(error));
        })
    }

    googleLogin() {
        this.googlePlus.login({
            'scopes': '',
            'webClientId': '557859355960-r2petg57jjsomcvkbs0bc4401n57l9ja.apps.googleusercontent.com',
            'offline': true
        })
        .then((success) => {
            console.log("you have been successfully logged in by googlePlus!" + JSON.stringify(success));
                    //here post data to Api
                    localStorage.setItem('user', success.userId);
                    this.navCtrl.setRoot("HomePage");
                },
                (error) => {
                    console.log('error' + JSON.stringify(error));

                })
    }

    twitterLogin() {
        this.platform.ready().then((res) => {
            if (res == 'cordova') {
                this.twitter.login().then((result) => {
                    this.twitter.showUser().then((user) => {
                        console.log("user" + JSON.stringify(user));
                            //here post data to Api
                            localStorage.setItem('user', user.id);
                            this.navCtrl.setRoot("HomePage");
                        },
                        (onError) => {
                            console.log("user" + JSON.stringify(onError));
                        })
                })
            }
        })
    }


    Register() {
        this.navCtrl.push("RegistrationPage");
    }

    checkIfCartExist(user){
        var cartId = -1;
        //Récupères les paniers en cours de l'utilisateur
        this.loginService.getCartForCustomer(user.id_customer).subscribe(data => {
            console.log(data);
            
            //Récupères le dernier panier s'il n'est pas vide et n'a pas été commandé
            if(data.carts && data.carts[0].id){//&& data.carts[0].id_address_invoice == 0 && data.carts[0].associations
                let alert = this.alertCtrl.create({
                    title: "Panier trouvé",
                    subTitle: "Un panier à votre nom a été trouvé en ligne.\n Souhaitez vous le chargez ? (Attention, si vous aviez déjà un panier d'enregistré celui-ci sera perdu)",
                    buttons: [
                    {
                        text: 'Oui',
                        handler: () => {
                            console.log('Oui clicked');
                            cartId = data.carts[0].id;
                            this.getExistingCart(cartId);
                        }
                    },
                    {
                        text: 'Non',
                        handler: () => {
                            console.log('Non clicked');
                            localStorage.removeItem('id_cart');
                        }
                    }
                    ]
                });
                alert.present();
            }
        })

    }

    cart: any[] = [];
    /*product: any = {
        name: ' ',
        quantity: 0,
        declinaison: []
    }*/
    declinaisons: any[] = [];
    products: any[] = [];
   // declinaison: any = {};

    getExistingCart(cartId){
        this.loginService.getCart(cartId).subscribe(cartData => {
            console.log(cartData);
            localStorage.setItem('id_cart',cartData.cart.id);
            //console.log(cartData.cart.associations.cart_rows);
            if(localStorage.getItem('cartItem'))
                localStorage.removeItem('cartItem');

            if(cartData.cart && cartData.cart.associations && cartData.cart.associations.cart_rows){
                for(var item of cartData.cart.associations.cart_rows){
                    //console.log(item);
                    //this.getProducts(item.id_product);
                    //this.getDeclinaisons(item.id_product_attribute);
                    this.addToCart(item.id_product,item.id_product_attribute, item.quantity);

                    //this.addToCart(item.id_product,item.id_product_attribute, item.quantity);
                }
            }else{
                console.log("Le panier trouvé est vide");
                let alert = this.alertCtrl.create({
                    title: "Panier trouvé",
                    subTitle: "Le panier trouvé est vide. Souhaitez-vous tout de même le charger? (Attention, si un panier est en cours ceci le supprimera)",
                    buttons: [
                    {
                        text: 'Oui',
                        handler: () => {
                            console.log('Oui clicked');
                            this.storage.remove('cart');
                        }
                    },
                    {
                        text: 'Non',
                        handler: () => {
                        }
                    }
                    ]
                });
                alert.present();
            }

            //console.log(this.products);
           // console.log(this.declinaisons);
           // console.log(this.cart);
       })
    }

    addToCart(productId, declinaisonId, quantity){
        var product: any  = {
                name: '',
                quantity: 0,
                declinaison: []
            };

        var declinaison: any = {};

        if(declinaisonId > 0){
            this.loginService.getDeclinaisons(declinaisonId).subscribe(data => {
                this.declinaisons.push(data);
                declinaison = data;

                var productAlreadyFind = this.products.find(function(elem){
                    return elem.id == productId;
                });

                if(!productAlreadyFind){
                    this.loginService.getMenuItemDetails(productId).subscribe(data => {
                        this.products.push(data);
                        console.log(data);
                        declinaison.selectedQuantity = parseInt(quantity);
                        //declinaison.endPrice = data.price;

                        var id = declinaison.combination.id;
                        var index =  this.objectToArray(data.declinaisons).findIndex(function(elem){
                            return elem.id === id;
                        })

                        declinaison.endPrice = parseFloat(this.objectToArray(data.declinaisons)[index].price);
                        console.log(declinaison.endPrice);                          
                        product.name = data.name;
                        product.productId = productId;
                        product.quantity += parseInt(quantity);
                        product.imageUrl = data.image;
                        var decli = this.objectToArray(data.declinaisons);
                        for(var dec of decli){
                            if(dec.id == declinaisonId)
                                declinaison.name = dec.name;
                        }
                        product.declinaison.push(declinaison);

                        console.log(product);
                        this.cart.push(product);
                        //localStorage.setItem('cartItem',JSON.stringify(this.cart));
                        this.storage.set('cart',this.cart);
                    })
                }
            })
        }else if(productId > 0){
            this.loginService.getMenuItemDetails(productId).subscribe(data => {
                this.products.push(data);
                this.cart.push(product);
                //localStorage.setItem('cartItem',JSON.stringify(this.cart));
                this.storage.set('cart',this.cart);
            })
        }else{
            console.log("Cart was empty");
        }
    }
        

    /**
    * Méthode permettant de cast un object en array
    * @param object : object à cast
    * @return array : array équivalent à l'objet
    */
    private objectToArray(object){
        let item = Object.keys(object);
        let array = [];
        for(var i of item){
            array.push(object[i]);
        }
        return array;
    }
}
