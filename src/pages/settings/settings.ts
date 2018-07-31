import {Component} from '@angular/core';
import {NavController, Events , IonicPage,Platform} from 'ionic-angular';
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
            "language": "English",
            "value": "en"
        },
        {
            "language": "French",
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
    public translate: TranslateService,
    private userService: UserService,
    private settingService:SettingsService,
    private storage:Storage,
    private constService:ConstService) {

    /*let value= localStorage.getItem('language');
    this.value = value!=null ? value : 'en';*/
    let notification = localStorage.getItem('notification');
    this.notification = notification!=null ? notification : true;
    this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Settings'};    
    platform.ready().then(() => {
      this.value = platform.lang();
    })            
  }


    ngOnInit() {
      this.constService.presentLoader();
      this.getAllCountries();
     // var emailRegex = "^[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,4}$";
       var emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
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
           this.loadUserSettings();
            this.newsletter = userData.newsletter == '1' || this.user.newsletter == 1? true : false;
            this.optin = userData.optin == '1' || this.user.optin == 1? true : false;
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

    loadUserSettings(){
      this.newUserInfo.setValue({
        firstName: this.user.firstname,
        lastName: this.user.lastname,
        email: this.user.email,
        birthday: this.user.birthday || null,
        password: '',
        passwordConfirmation: '',
        newsletter: this.user.newsletter == '1' || this.user.newsletter == 1? true : false,
        optin: this.user.optin == '1' || this.user.optin == 1 ? true : false
      });
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
            this.constService.createToast({message: "Your saves have been applied"});
          }else{
            this.constService.createAlert({title: 'Error', message: data.error});
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
            this.platform.setLang('fr', true);
            this.platform.setDir('ltr', true);
        } else if (this.value == 'ar') {
            this.platform.setDir('rtl', true);
            this.platform.setLang('ar', true);
            this.translate.use('ar');
        } else {
            console.log("Selected language is English");
            this.translate.use('en');
            this.platform.setLang('en', true);
            this.platform.setDir('ltr', true);
        }
        localStorage.setItem('lang',this.value);
    }

    changeSetting(){
      localStorage.setItem('notification',this.notification);
      this.events.publish('notification:changed', this.notification); //Le paramètre est pris en compte maintenant pas besoin de redémarrage
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

    countries: any[] = [];
    country: any = '';

    getAllCountries(){
      this.country = JSON.parse(localStorage.getItem('country'));
      this.country = this.country ? this.country.id : '';
      this.settingService.getCountries().subscribe((countriesData) =>{
        console.log(countriesData);
        for(var c of countriesData.countries){
          this.settingService.getCountries(c.id).subscribe((countryData) => {
            this.countries.push(countryData);
          })
        }
      })
    }

    changeCountry(){
      console.log(this.country);
      console.log(this.countries);
      var index = this.countries.findIndex(elem => {
        return elem.country.id == this.country;
      });
      localStorage.setItem('country', JSON.stringify(this.countries[index].country));
      this.events.publish('get:currency');
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
