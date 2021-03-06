import {Component} from '@angular/core';
import {NavController, NavParams, IonicPage, ToastController} from 'ionic-angular';
import {NgForm, FormBuilder, Validators, FormGroup} from "@angular/forms";
import {ContactService} from './contact.service';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions';
import {Storage} from '@ionic/storage';


@IonicPage()
@Component({
    selector: 'page-contact',
    templateUrl: 'contact.html',
    providers: [ContactService, NativePageTransitions]
})
export class ContactPage {
    user: FormGroup;
    contacts: any[];
    header_data:any;
    orders: any[] = [];
    products: any[] = [];
    order: any;
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public toastCtrl: ToastController,
                public contactService: ContactService,
                public formBuilder: FormBuilder,
                public pageTransition:NativePageTransitions,
                public storage:Storage) {
        this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Contacts'};        
    }

    ngOnInit(){
        var emailRegex = "^[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,4}$";
        var userRegex = "^[a-zA-Z- ]+";
        this.storage.get('user').then((userData) => {
            var userEmail = userData && userData.email ? userData.email : '';
            this.user = this.formBuilder.group({
                email: [userEmail, Validators.pattern(emailRegex)],
                id_product : [''],
                id_contact: ['', Validators.required],
                message: ['', Validators.required]});

            var customer = userData && userData.id_customer ? userData.id_customer : null;
            this.contactService.getAllContacts(customer).subscribe(data => {
                this.contacts = data.contacts;
                this.orders = data.orders;
            })
        })
    }

    ionViewWillLeave(){
            /*let options: NativeTransitionOptions = {
                action: "close",
                origin: "left",
                duration: 500,
                slowdownfactor: 3,
                slidePixels: 0,
                iosdelay: 100,
                androiddelay: 150,
                fixedPixelsTop: 0,
                fixedPixelsBottom: 0
               };

            this.pageTransition.drawer(options);*/
    }

    select(){
        this.contactService.getProductsForOrder(this.order).subscribe(data => {
            this.products = this.objectToArray(data);
        })
    }

    onSubmit(){
        console.log(this.user.value);
       this.contactService.postMessage(this.user.value.email, this.user.value.message, this.user.value.id_contact, this.order != null ? this.order : '', this.user.value.id_product).subscribe(data => {
            console.log(data);
            if(data && (data == "true" || data == true)){
                this.createToaster("Votre demande a bien été prise en compte",3000);                
            }else{
                this.createToaster("Une erreur est survenue pendant le traitement de votre demande",3000);                
            }

            this.navCtrl.setRoot("HomePage"); //Redirection non ok
        })
    }

    createToaster(message, duration) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
    }

    private objectToArray(object){
      let item = Object.keys(object);
      let array = [];
      for(var i of item){
        array.push(object[i]);
      }
      return array;
    }

}
