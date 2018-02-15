import {Component} from '@angular/core';
import {NavController,Events, NavParams, IonicPage, LoadingController, Platform} from 'ionic-angular';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Facebook} from '@ionic-native/facebook';
import {GooglePlus} from '@ionic-native/google-plus';
import {TwitterConnect} from '@ionic-native/twitter-connect';
import {LoginService} from './login.service';
import {UserService} from '../../providers/user-service';
import {SocketService } from '../../providers/socket-service';

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
                public events:Events,
                public fb: FormBuilder,
                public facebook: Facebook,
                public googlePlus: GooglePlus,
                public loadingCtrl: LoadingController,
                public twitter: TwitterConnect,
                public platform: Platform,
                public loginService: LoginService,
                public userService:UserService,
                public socketService:SocketService) {
    }

    onLogin() {
        let loader = this.loadingCtrl.create({
            content: 'please wait'
        })
        loader.present();
        this.loginService.login(this.user.value)
            .subscribe(user => {
                loader.dismiss();
                localStorage.setItem('token', "bearer " + user.token);
                if (this.navParams.get("flag") == 0) {
                    this.navCtrl.setRoot("CartPage");
                } else {
                    this.navCtrl.setRoot("HomePage");
                    this.socketService.establishConnection();
                    this.renderImage();
                }
            }, error => {
                loader.dismiss();
            })
    }

    ngOnInit(): any {
        this.user = this.fb.group({
            email: ['info@ionicfirebaseapp.com', Validators.required],
            password: ['123456', Validators.required],

        });
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
}
