var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from "@angular/forms";
import { EmailComposer } from '@ionic-native/email-composer';
import { ContactService } from './contact.service';
var ContactPage = /** @class */ (function () {
    function ContactPage(navCtrl, navParams, toastCtrl, emailComposer, contactService, formBuilder) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.emailComposer = emailComposer;
        this.contactService = contactService;
        this.formBuilder = formBuilder;
    }
    ContactPage.prototype.ngOnInit = function () {
        var _this = this;
        var emailRegex = "^[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,4}$";
        var userRegex = "^[a-zA-Z- ]+";
        this.user = this.formBuilder.group({
            name: ['', Validators.pattern(userRegex)],
            email: ['', Validators.pattern(emailRegex)],
            id_order: [''],
            id_contact: ['', Validators.required],
            message: ['', Validators.required]
        });
        this.contactService.getAllContacts().subscribe(function (data) {
            _this.contacts = data;
        });
    };
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
    ContactPage.prototype.onSubmit = function () {
        console.log(this.user.value);
        /*this.contactService.postMessage(this.user.value).subscribe(data => {
             console.log(data);
         })*/
        var contact = null;
        for (var _i = 0, _a = this.contacts; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c.id_contact == this.user.value.id_contact)
                contact = c;
        }
        console.log(contact);
        var user = {
            to: contact.email,
            subject: contact.name,
            body: this.user.value.message,
            isHtml: true
        };
        console.log(user);
        this.emailComposer.open({
            to: contact.email,
            subject: contact.name,
            body: this.user.value.message,
            isHtml: true
        }, function () {
            console.log("email view dismissed");
        });
    };
    ContactPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-contact',
            templateUrl: 'contact.html',
            providers: [EmailComposer, ContactService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ToastController,
            EmailComposer,
            ContactService,
            FormBuilder])
    ], ContactPage);
    return ContactPage;
}());
export { ContactPage };
//# sourceMappingURL=contact.js.map