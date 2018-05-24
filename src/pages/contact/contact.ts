import {Component} from '@angular/core';
import {NavController, NavParams, IonicPage, ToastController} from 'ionic-angular';
import {NgForm, FormBuilder, Validators, FormGroup} from "@angular/forms";
import {EmailComposer} from '@ionic-native/email-composer';
import {ContactService} from './contact.service';



@IonicPage()
@Component({
    selector: 'page-contact',
    templateUrl: 'contact.html',
    providers: [EmailComposer, ContactService]
})
export class ContactPage {
    user: FormGroup;
    contacts: any[];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public toastCtrl: ToastController,
                public emailComposer: EmailComposer,
                public contactService: ContactService,
                public formBuilder: FormBuilder) {
    }

    ngOnInit(){
        var emailRegex = "^[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,4}$";
        var userRegex = "^[a-zA-Z- ]+";
        this.user = this.formBuilder.group({
            name: ['', Validators.pattern(userRegex)],
            email: ['', Validators.pattern(emailRegex)],
            id_order: [''],
            id_contact: ['', Validators.required],
            message: ['', Validators.required]});

        this.contactService.getAllContacts().subscribe(data => {
            this.contacts = data;
        })

        /*this.contactService.getFormContact().subscribe(data => {
            console.log(data);
        })*/
    }

    /*onSend(user: NgForm) {
        this.emailComposer.open({
                // You just need to change this Email address to your own email where you want to receive email.
                to: 'ionicfirebaseapp@gmail.com',
                subject: this.user.value.name,
                body: this.user.value.message,
                isHtml: true
            },
            function (callback) {
                console.log('email view dismissed');
            });
       //this.user = '';
    }*/

    /*onSend(user: NgForm){
        this.contactService.postMessage("0").subscribe(data => {
            console.log(data);
        })
    }*/

    onSubmit(){
        console.log(this.user.value);
       /*this.contactService.postMessage(this.user.value).subscribe(data => {
            console.log(data);
        })*/

        /*var contact = null;

        for(var c of this.contacts){
            if(c.id_contact == this.user.value.id_contact)
                contact = c;
        }

        console.log(contact);

        this.emailComposer.open({
            to: contact.email,
            subject: contact.name,
            body: this.user.value.message,
            isHtml: true
        }, function(){
            console.log("email view dismissed");
        })*/
    }

}
