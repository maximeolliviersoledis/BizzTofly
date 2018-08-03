import {Component} from '@angular/core';
import {NavController,Events, AlertController, NavParams, IonicPage, LoadingController, Platform} from 'ionic-angular';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Facebook} from '@ionic-native/facebook';
import {GooglePlus} from '@ionic-native/google-plus';
import {TwitterConnect} from '@ionic-native/twitter-connect';
import {LoginService} from './login.service';
import {Storage} from '@ionic/storage';
import {ConstService} from '../../providers/const-service';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
    providers: [Facebook, GooglePlus, TwitterConnect, LoginService]
})
export class LoginPage {
    user: FormGroup;
    passwordReset: boolean = false;
    noOfItems: number = 0;
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
        private storage:Storage,
        private constService:ConstService) {}

    onLogin() {
        this.constService.presentLoader();
        this.loginService.getKey().subscribe(key => {
          this.loginService.postLogin(this.user.value, key).subscribe((user:any) => {
            if(user.token){
                this.loginService.getWebServiceToken(user.id_customer).subscribe((data:any) => {
                    this.constService.user = user;
                    console.log("access token : ", data);
                    this.constService.accessToken = data;
                })

                this.storage.set('user',user);
                localStorage.setItem('userLoggedIn',JSON.stringify(true));

                this.checkIfCartExist(user);
                    if(this.navCtrl.canGoBack())
                       this.navCtrl.pop();
                   else
                       this.navCtrl.setRoot("HomePage");
                }else if(user.error){
                    this.constService.createAlert({
                        title: "Login error",
                        message: "Incorrect user name or password"
                    });
                }else{
                    this.constService.createAlert({
                        title: "Error",
                        message: "An unknown error occurs"
                    });   
                }
                this.constService.dismissLoader();                
            }, error => {
                this.constService.dismissLoader();
            });
      }, keyError => {
          this.constService.dismissLoader();
      });
    }

    ngOnInit(): any {
        var emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
       // var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //Possibilité de se connecter que lorsque l'utilisateur saisit une adresse mail conforme à la regex si dessus
        //De plus, le mot de passe saisit doit faire au minimum 5 caractères (se mettre en accord avec la page d'inscription)
        
        this.user = this.fb.group({
            email: ['', Validators.compose(
                [Validators.required,Validators.pattern(emailRegex)])],
            password: ['', Validators.compose(
                [Validators.required, Validators.minLength(5)])],

        });
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
            //'webClientId': '557859355960-r2petg57jjsomcvkbs0bc4401n57l9ja.apps.googleusercontent.com',
            'webClientId': '383564956806-k68pt32sl2hp1ofom2t128tb0m9qkl1a.apps.googleusercontent.com',
            'offline': true
        })
        .then((success) => {
            console.log("you have been successfully logged in by googlePlus!" + JSON.stringify(success));
                    //here post data to Api
                   // localStorage.setItem('user', success.userId);
                   alert(JSON.stringify(success));

                    this.navCtrl.setRoot("HomePage");
                },
                (error) => {
                    console.log('error' + JSON.stringify(error));

                }).catch(error => {
                    console.log(error);
                    alert(JSON.stringify(error));
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
                }, error => {
                    console.log(error);
                    alert(JSON.stringify(error));
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
        //this.loginService.getCartForCustomer(user.id_customer).subscribe((data:any) => {
            this.loginService.getLastCart(user.id_customer).subscribe(data => {
            console.log(data);
            
            //Récupères le dernier panier s'il n'est pas vide et n'a pas été commandé
            //if(data.carts && data.carts[0].id){//&& data.carts[0].id_address_invoice == 0 && data.carts[0].associations
            if(data && data.id){
                /*let alert = this.alertCtrl.create({
                    title: "Panier trouvé",
                    subTitle: "Un panier à votre nom a été trouvé en ligne.\n Souhaitez vous le chargez ? (Attention, si vous aviez déjà un panier d'enregistré celui-ci sera perdu)",
                    buttons: [
                    {
                        text: 'Oui',
                        handler: () => {
                            console.log('Oui clicked');
                            //cartId = data.carts[0].id;
                            cartId = data.id;
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
                alert.present();*/
                this.constService.createAlert({
                    title: "Cart found",
                    message: "A cart has been found online. Do you want to load it? (If you already have an existing cart it will be lost)",
                    buttons: [
                    {
                        text: 'Yes',
                        handler: () => {
                            console.log('Oui clicked');
                            //cartId = data.carts[0].id;
                            cartId = data.id;
                            this.getExistingCart(cartId);
                        }
                    },
                    {
                        text: 'No',
                        handler: () => {
                            console.log('Non clicked');
                            localStorage.removeItem('id_cart');
                        }
                    }
                    ]
                });
            }
        })

    }

    cart: any[] = [];
    declinaisons: any[] = [];
    products: any[] = [];

    getExistingCart(cartId){
        this.loginService.getCart(cartId).subscribe((cartData:any) => {
            console.log(cartData);
            localStorage.setItem('id_cart',cartData.cart.id);
            if(localStorage.getItem('cartItem'))
                localStorage.removeItem('cartItem');

            if(cartData.cart && cartData.cart.associations && cartData.cart.associations.cart_rows){
                for(var item of cartData.cart.associations.cart_rows){
                    this.addToCart(item.id_product,item.id_product_attribute, item.quantity);
                }
            }else{
                console.log("Le panier trouvé est vide");
                /*let alert = this.alertCtrl.create({
                    title: "Cart found",
                    message: "The cart found is empty. Do you still want to load it? (This action will remove the current cart on the device)",
                    buttons: [
                    {
                        text: 'Yes',
                        handler: () => {
                            console.log('Oui clicked');
                            this.storage.remove('cart');
                        }
                    },
                    {
                        text: 'No',
                        handler: () => {
                        }
                    }
                    ]
                });
                alert.present();*/
                this.constService.createAlert({
                    title: "Cart found",
                    message: "The cart found is empty. Do you still want to load it? (This action will remove the current cart on the device)",
                    buttons: [
                    {
                        text: 'Yes',
                        handler: () => {
                            console.log('Oui clicked');
                            this.storage.remove('cart');
                        }
                    },
                    {
                        text: 'No',
                        handler: () => {
                        }
                    }
                    ]
                });
            }
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
            this.loginService.getDeclinaisons(declinaisonId).subscribe((data:any) => {
                this.declinaisons.push(data);
                declinaison = data;

                var productAlreadyFind = this.products.find(function(elem){
                    return elem.id == productId;
                });

                if(!productAlreadyFind){
                    this.loginService.getMenuItemDetails(productId).subscribe((data:any) => {
                        this.products.push(data);
                        console.log(data);
                        declinaison.selectedQuantity = parseInt(quantity);

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

                        //Ajoute l'image de la déclinaison dans le panier
                       if(declinaison.combination.associations && declinaison.combination.associations.images)
                         declinaison.imageUrl = this.loginService.getImageUrl(productId, declinaison.combination.associations.images[0].id);
                       else
                         declinaison.imageUrl = product.imageUrl;
                        var decli = this.objectToArray(data.declinaisons);
                        for(var dec of decli){
                            if(dec.id == declinaisonId)
                                declinaison.name = dec.name;
                        }
                        product.declinaison.push(declinaison);

                        console.log(product);
                        this.cart.push(product);
                        this.noOfItems += parseInt(quantity);
                        this.events.publish("updateCartBadge", this.noOfItems);
                        this.storage.set('cart',this.cart);
                    })
                }
            })
        }else if(productId > 0){
            this.loginService.getMenuItemDetails(productId).subscribe((data:any) => {
                this.products.push(data);
                this.cart.push(product);
                this.storage.set('cart',this.cart);
            })
        }else{
            console.log("Cart was empty");
        }
    }

    resetPassword(){
        this.passwordReset = true;
        var emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/; //Problème dans la regex (pas besoin de mettre .com pour qu'elle soit valide)
        this.emailForPassword = this.fb.group({
            email: ['', Validators.compose(
                [Validators.required,Validators.pattern(emailRegex)])]
        });
    }

    goBackToLoginPage(){
        this.passwordReset = false;
    }

    emailForPassword: FormGroup;

    sendMail(){
        console.log(this.emailForPassword.value);
        this.loginService.resetPassword(this.emailForPassword.value.email).subscribe((data:any) => {
            if(data == 1){
                this.constService.createToast({message: "Your password has been resetted. A mail has been sent to your account", duration: 3000});
                this.passwordReset = false;
            }else if(data == -1){
                this.constService.createToast({message: "You have to wait 360 minutes between each password reset", duration: 3000});
                this.passwordReset = false;
            }else if(data == -2){
                this.constService.createToast({message: "No account found for this email address", duration: 3000});
            }else {
                this.constService.createToast({message: "Your password hasn't been reset", duration: 3000});
            }
        })
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
