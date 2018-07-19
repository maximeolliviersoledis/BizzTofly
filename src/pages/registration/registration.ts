import {Component} from '@angular/core';
import {NavController, IonicPage, LoadingController, Platform} from 'ionic-angular';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ToastController} from 'ionic-angular';
import {Facebook} from '@ionic-native/facebook';
import {GooglePlus} from '@ionic-native/google-plus';
import {TwitterConnect} from '@ionic-native/twitter-connect';
import {RegistrationService} from './registration.service';
import {SocketService } from '../../providers/socket-service';
import {Storage} from '@ionic/storage';
import {ConstService} from '../../providers/const-service';

@IonicPage()
@Component({
    selector: 'page-registration',
    templateUrl: 'registration.html',
    providers: [Facebook, GooglePlus, TwitterConnect, RegistrationService]
})
export class RegistrationPage {
    user: FormGroup;

    constructor(public navCtrl: NavController,
                public toastCtrl: ToastController,
                public fb: FormBuilder,
                public facebook: Facebook,
                public googlePlus: GooglePlus,
                public loadingCtrl: LoadingController,
                public twitter: TwitterConnect,
                public platform: Platform,
                public registrationService: RegistrationService,
                public socketService:SocketService,
                private storage:Storage,
                private constService:ConstService) {
    }

    onRegister() {
        this.constService.presentLoader();
        this.registrationService.getKey().subscribe((key) => {
            console.log(this.user);
            var newUser: any = {
                customer:{
                    firstname: this.user.value.firstName,
                    lastname: this.user.value.lastName,
                    email: this.user.value.email,
                    passwd: this.user.value.password,
                    /*active: '1',
                    id_lang: '1',
                    id_default_group: '3',*/
                    id_gender:  (this.user.value.gender ? 2 : 1),
                    newsletter: this.user.value.newsletter,
                    optin: this.user.value.optin
                }
            }
            console.log(newUser);
            /*this.registrationService.postCustomer(newUser).subscribe(res => {
                 console.log(res);
                 var connect = {
                         token: res.customer.secure_key,
                         id_customer: res.customer.id,
                         email: res.customer.email,
                         firstname: res.customer.firstname,
                         lastname: res.customer.lastname
                 }
                 this.displayToast("Votre compte a bien été enregistré", 2000);
                 this.storage.set('user', connect);
                 localStorage.setItem('userLoggedIn', "true");
                 this.navCtrl.setRoot("HomePage");
             })*/

             this.registrationService.postUser(newUser.customer, key).subscribe(res => {
                 if(res && !res.error){
                     var connect = {
                            token: res.token,
                            id_customer: res.id,
                            email: res.email,
                            firstname: res.firstname,
                            lastname: res.lastname
                     }

                     this.constService.user = connect;
                     this.registrationService.getWebServiceToken(connect.id_customer).subscribe((data)=>{
                         this.constService.accessToken = data;
                     })

                     this.displayToast("Votre compte a bien été enregistré", 2000);
                     this.storage.set('user', connect);
                     localStorage.setItem('userLoggedIn', "true");
                     this.navCtrl.setRoot("HomePage");
                 }else{
                     alert(res.error);
                 }
             })
             this.constService.dismissLoader();
        }, () => {
            this.constService.dismissLoader();
        })
    }

    displayToast(message, duration) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
    }

    ngOnInit(): any {
        console.log("Registration Page on init");
        var emailRegex = "^[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,4}$";
        var userRegex = "^[a-zA-Z- ]+";
        //On peut également appliquer des patterns au mot de passe
        this.user = this.fb.group({
            firstName: ['', Validators.compose(
                [Validators.required, Validators.pattern(userRegex)]
                )],
            lastName: ['', Validators.compose(
                [Validators.required, Validators.pattern(userRegex)]
                )],
            email: ['', Validators.compose(
                [Validators.required,Validators.pattern(emailRegex)]
                )],
            password: ['', Validators.compose(
                [Validators.required, Validators.minLength(8)]
                )],
            passwordConfirmation: ['', Validators.compose(
                [Validators.required, Validators.minLength(8)]
                )],
            gender: [false, Validators.required],
            newsletter: [false, Validators.required],
            optin: [false, Validators.required]
            //newsletter: [false]
        },{validator: this.passwordMatch});
    }

    //Vérifie que les mots de passe soit identiques
    passwordMatch(control: FormGroup){
        return control.controls['password'].value === control.controls['passwordConfirmation'].value ? null : {'mismatch': true};
    }
    

    navLogin() {
        this.navCtrl.push("LoginPage");
    }

    doFbLogin() {
        let permissions = new Array();
        permissions = ["public_profile", "email", "user_education_history"];
        this.facebook.login(permissions)
            .then((success) => {
                this.facebook.api("/me?fields=id,name,email,gender,first_name,last_name", permissions).then((user) => {
                    //here post data to Api
                    localStorage.setItem('token', user.id);
                    this.navCtrl.setRoot("HomePage");
                }),
                    (error) => {
                        console.log(JSON.stringify(error));
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
                    //here post data to Api
                    localStorage.setItem('token', success.userId);
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
                            //here post data to Api
                            localStorage.setItem('token', user.id);
                            this.navCtrl.setRoot("HomePage");
                        },
                        (onError) => {
                            console.log("user" + JSON.stringify(onError));
                        })
                })
            }
        })
    }

    isLogin(){
        return JSON.parse(localStorage.getItem('userLoggedIn')) != null;
    }


}
