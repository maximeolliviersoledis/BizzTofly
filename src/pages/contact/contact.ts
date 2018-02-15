import {Component} from '@angular/core';
import {NavController, NavParams, IonicPage, ToastController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {EmailComposer} from '@ionic-native/email-composer';


@IonicPage()
@Component({
    selector: 'page-contact',
    templateUrl: 'contact.html',
    providers: [EmailComposer]
})
export class ContactPage {
    user: any = {}

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public toastCtrl: ToastController,
                public emailComposer: EmailComposer) {

    }

    onSend(user: NgForm) {
        this.emailComposer.open({
                // You just need to change this Email address to your own email where you want to receive email.
                to: 'ionicfirebaseapp@gmail.com',
                subject: this.user.name,
                body: this.user.message,
                isHtml: true
            },
            function (callback) {
                console.log('email view dismissed');
            });
        this.user = '';
    }

}
