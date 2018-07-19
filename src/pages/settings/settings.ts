import {Component} from '@angular/core';
import {NavController, Events , IonicPage,ToastController,LoadingController,Platform, AlertController} from 'ionic-angular';
import {NgForm, FormBuilder, Validators, FormGroup} from "@angular/forms";
import {TranslateService} from 'ng2-translate';
import {UserService} from '../../providers/user-service';
import {FileUploader} from 'ng2-file-upload';
import {CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import {SettingsService} from './settings.service';
import {Storage} from '@ionic/storage';
import {ConstService} from '../../providers/const-service';

@IonicPage()
@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
    providers:[SettingsService]
})
export class Settings {
    user: any = {};
    newUserInfo: FormGroup;
    preview:string;
    value: any;
    firstname: string;
    lastname: string;
    noOfItems: number = 0;
    header_data:any;
    newsletter: boolean = false;
    optin: boolean = false;
    private groups: any;


    options = [
        {
            "language": "ENGLISH",
            "value": "en"
        },
        {
            "language": "FRENCH",
            "value": "fr"
        }
    ];

       cloudinaryUpload = {
        cloudName: 'pietechsolutions',
        uploadPreset: 't0iey0lk'
     };

  uploader: CloudinaryUploader = new CloudinaryUploader(
        new CloudinaryOptions(this.cloudinaryUpload)
    );

  userId:string;
  imageUrl:string='assets/img/profile.jpg';
  userImage: string;
  public notification:any;
  customerId = 0;


  constructor(public navCtrl: NavController,
    public events:Events,
    public fb: FormBuilder,
    public platform:Platform,
    private loadingCtrl:LoadingController,
    private toastCtrl:ToastController,
    public translate: TranslateService,
    private userService: UserService,
    private settingService:SettingsService,
    private storage:Storage,
    private constService:ConstService,
    private alertCtrl:AlertController) {

    let value= localStorage.getItem('language');
    this.value = value!=null ? value : 'en';
    let notification = localStorage.getItem('notification');
    this.notification = notification!=null ? notification : true;
    this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Settings'};                
  }


    ngOnInit() {
      this.constService.presentLoader();
      var emailRegex = "^[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,4}$";
      var userRegex = "^[a-zA-Z- ]+";
      this.newUserInfo = this.fb.group({
            firstName: ['', Validators.pattern(userRegex)],
            lastName: ['',Validators.pattern(userRegex)],
            email: ['', Validators.pattern(emailRegex)],
            birthday: [null],
            password: ['', Validators.minLength(8)],
            passwordConfirmation: ['', Validators.minLength(8)],
            newsletter: [false],
            optin: [false]
      },{validator: [this.passwordMatch,this.checkBirthDate]}); //Empêche les autres champs d'être envoyé si ceux-ci ne sont pas vérifiés

      this.storage.get('image').then((imageData)=>{
        this.userImage = imageData;
      })

      this.storage.get('user').then((data)=>{
        if(data && data.token){
          this.customerId = data.id_customer;
          this.settingService.getUserInfo(data.id_customer).subscribe(userData => {
            console.log("settings :", userData);
            this.user = userData;
            this.firstname = userData.firstname;
            this.lastname = userData.lastname;
            this.newsletter = userData.newsletter;
            this.optin = userData.optin;
          }, (error) => {
            console.log(error);
            /*this.events.subscribe('PendingRequestExecuted', (userData)=>{
              console.log("settings :", userData);
              this.user = userData;
              this.firstname = userData.firstname;
              this.lastname = userData.lastname;
              this.newsletter = userData.newsletter;
              this.optin = userData.optin;
            })*/
          })
        }else{
          this.navCtrl.setRoot('LoginPage');
        }
        this.constService.dismissLoader();
      }, () => {
        this.constService.dismissLoader();
      })
    }

    ionViewWillLeave(){
        this.events.publish("hideSearchBar");
    }

    checkBirthDate(control: FormGroup){
      if(control.controls['birthday'].value == null || control.controls['birthday'].value == '')
        return null;
      var today = new Date().getTime();
      var date = new Date(control.controls['birthday'].value).getTime();
      return today - date > 0 ? null : {'invalid-date':true}; 
    }

    //Vérifie que les mots de passe soit identiques
    passwordMatch(control: FormGroup){
        return control.controls['password'].value === control.controls['passwordConfirmation'].value ? null : {'mismatch': true};
    }

   /* onSubmit(user: NgForm){
    let loader = this.loadingCtrl.create({
      content:'please wait...'
    })
    loader.present();
    console.log(this.newUserInfo);
    if(this.checkIfFieldsAreEmpty()){
      loader.dismiss();
      console.log("form vide");
    }else{
      if(this.newUserInfo.value.firstName)
        this.user.customer.firstname = this.newUserInfo.value.firstName;

      if(this.newUserInfo.value.lastName)
        this.user.customer.lastname = this.newUserInfo.value.lastName;

      if(this.newUserInfo.value.email)
        this.user.customer.email = this.newUserInfo.value.email;

      if(this.newUserInfo.value.password && this.newUserInfo.value.passwordConfirmation)
        this.user.customer.passwd = this.newUserInfo.value.password;

      if(this.newUserInfo.value.birthday)
        this.user.customer.birthday = this.newUserInfo.value.birthday;

      if(this.newsletter != this.newUserInfo.value.newsletter)
        this.user.customer.newsletter = this.newUserInfo.value.newsletter;

      if(this.optin != this.newUserInfo.value.optin)
        this.user.customer.optin = this.newUserInfo.value.optin;

      console.log(this.user);

      //var customerGroups = this.user.customer.associations.groups;

      //this.user.customer.associations.groups = [];
      this.user.customer.associations.groups = {group :[]};

      for(var g of this.groups){
        this.user.customer.associations.groups.group.push({id:g.id});
      }
      //this.user.customer.associations.groups.group = this.groups;
      console.log(this.user);
      this.settingService.putUser(this.user.customer.id,this.user).subscribe(data => {
        if(data && !data.error){
          this.createToaster("Vos modifications ont bien été prise en compte", 2000);
        }else{
          alert(data.error);
        }

        loader.dismiss();
      })
    }

    }*/

  onSubmit(user: NgForm){
    console.log(this.newUserInfo);
    this.constService.presentLoader();
    if(this.checkIfFieldsAreEmpty()){
      this.constService.dismissLoader();
    }else{
      this.settingService.getKey().subscribe((key) => {
        this.settingService.modifyUser(this.customerId, this.newUserInfo.value, key).subscribe(data => {
          if(data && !data.error){
            var response  = {
              token: data.token,
              firstname: data.firstname,
              lastname: data.lastname,
              email: data.email,
              id_customer: data.id
            }
            this.storage.set('user', response);
            this.createToaster("Vos modifications ont bien été enregistré", 2000);
          }else{
            this.alertCtrl.create({
              title: "Erreur",
              subTitle: data.error,
              buttons: ['OK']
            }).present();
          }
          this.constService.dismissLoader();
        }, () => {
          this.constService.dismissLoader();
        });
      }, () => {
        this.constService.dismissLoader();
      })
    }
  }

  /**Check if the fields are empty or if the value is unchanged**/
  checkIfFieldsAreEmpty(){
    if(this.newUserInfo.value.firstName)
      return false;

    if(this.newUserInfo.value.lastName)
      return false;

    if(this.newUserInfo.value.email)
      return false;

    if(this.newUserInfo.value.password && this.newUserInfo.value.passwordConfirmation)
      return false;

    if(this.newUserInfo.value.birthday)
      return false;

    if(this.newsletter != this.newUserInfo.value.newsletter)
      return false;

    if(this.optin != this.newUserInfo.value.optin)
      return false;

    return true;
  }

    readUrl(event) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event: any) => {
                this.preview = event.target.result;
                //this.user.flag=1;

                this.storage.set('image',this.preview);
                this.events.publish('image:changed', this.preview);
                //L'image se trouve supprimer si on la place dans l'objet user
                /*this.storage.get('user').then((userData)=>{
                  userData.image = this.preview;
                  this.storage.set('user',userData);
                })*/
            };
            reader.readAsDataURL(event.target.files[0]);
        }

    }

    changeLanguage() {
        if (this.value == 'fr') {
            console.log("Selected language is French");
            this.translate.use('fr');
            this.platform.setDir('ltr', true);
        } else if (this.value == 'ar') {
            this.platform.setDir('rtl', true);
            this.translate.use('ar');
        }
           else {
            console.log("Selected language is English");
            this.translate.use('en');
            this.platform.setDir('ltr', true);
        }
        localStorage.setItem('language',this.value);

    }

    changeSetting(){
      localStorage.setItem('notification',this.notification);
      this.events.publish('notification:changed', this.notification); //Le paramètre est pris en compte maintenant pas besoin de redémarrage
    }

    createToaster(message, duration) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
    }

    goToAddressList(){
      this.navCtrl.push("AddressListPage",{
          amountDetails: 0,
          cartData: null,
          manageAddress: true,
          noOfItems: this.noOfItems  
      })
    }

    goToReductionList(){
      this.navCtrl.push("ReductionListPage");
    }

    navcart(){
      this.navCtrl.push("CartPage");
    }

}
