import {Component} from '@angular/core';
import {NavController, Events , IonicPage,ToastController,LoadingController,Platform} from 'ionic-angular';
import {NgForm, FormBuilder, Validators, FormGroup} from "@angular/forms";
import {TranslateService} from 'ng2-translate';
import {UserService} from '../../providers/user-service';
import {FileUploader} from 'ng2-file-upload';
import {CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import {SettingsService} from './settings.service';


@IonicPage()
@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
    providers:[SettingsService]
})
export class Settings {
    user: any = {};
    /*newUserInfo: any = {
      fieldEmpty: true
    };*/
    newUserInfo: FormGroup;
    preview:string;
    value: any;

    options = [
        {
            "language": "ENGLISH",
            "value": "en"
        },
        {
            "language": "FRENCH",
            "value": "fr"
        },
        {
            "language": "ARABIC",
            "value": "ar"
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
  public notification:any;


    constructor(public navCtrl: NavController,
                public events:Events,
                public fb: FormBuilder,
                public platform:Platform,
                private loadingCtrl:LoadingController,
                private toastCtrl:ToastController,
                public translate: TranslateService,
                private userService: UserService,
                private settingService:SettingsService) {

                let value= localStorage.getItem('language');
                this.value = value!=null ? value:'en';
                let notification = localStorage.getItem('notification');
                this.notification = notification!=null ? notification:true;
                
    }


    ngOnInit() {
      let loader =this.loadingCtrl.create({
        content:'please wait...'
      })
      loader.present();
      var emailRegex = "^[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,4}$";
      var userRegex = "^[a-zA-Z- ]+";
      this.newUserInfo = this.fb.group({
            firstName: ['', Validators.pattern(userRegex)],
            lastName: ['',Validators.pattern(userRegex)],
            email: ['', Validators.pattern(emailRegex)],
            password: ['', Validators.minLength(8)],
            passwordConfirmation: ['', Validators.minLength(8)]
      },{validator: this.passwordMatch});

      var userExist = JSON.parse(localStorage.getItem('user'));
      if(userExist){
        this.settingService.getUser(userExist.id_customer).subscribe(data => {
          this.user = data;
        })
        console.log(this.newUserInfo);
      }else{
        this.navCtrl.push('LoginPage');
      }
      loader.dismiss();
    }

    //Vérifie que les mots de passe soit identiques
    passwordMatch(control: FormGroup){
        return control.controls['password'].value === control.controls['passwordConfirmation'].value ? null : {'mismatch': true};
    }

    onSubmit(user: NgForm){
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

      console.log(this.user);

      this.settingService.putUser(this.user.customer.id,this.user).subscribe(data => {
        console.log(data);
        loader.dismiss();
      })
    }

    }

 /* onSubmit(user: NgForm) {
    let loader = this.loadingCtrl.create({
      content:'please wait...'
    })
    loader.present();
     if(this.user.flag==1){
     this.uploader.uploadAll();
     this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
     let res:any=JSON.parse(response);
     this.user.imageUrl=res.secure_url;
     this.user.publicId=res.public_id;
     console.log("user-"+JSON.stringify(this.user));
     this.settingService.updateUserInfo(this.userId,this.user)
    .subscribe(response=>{
      loader.dismiss();
      console.log("update response-with img-"+JSON.stringify(response));
      this.events.publish('imageUrl',response.imageUrl);
      this.createToaster('user information updated',3000);    
     })
        }
    } else {
      console.log("else-user-"+JSON.stringify(this.user));
       this.settingService.updateUserInfo(this.userId,this.user)
      .subscribe(response=>{
        console.log("update response-"+JSON.stringify(response));
        loader.dismiss();
        this.events.publish('imageUrl',this.user.imageUrl);
        this.createToaster('user information updated',3000);  
    })
    }
  }*/
  checkIfFieldsAreEmpty(){
    if(this.newUserInfo.value.firstName)
      return false;

    if(this.newUserInfo.value.lastName)
      return false;

    if(this.newUserInfo.value.email)
      return false;

    if(this.newUserInfo.value.password && this.newUserInfo.value.passwordConfirmation)
      return false;
    return true;
  }

    readUrl(event) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event: any) => {
                this.preview = event.target.result;
                this.user.flag=1;
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
      //console.log("notification-"+this.notification);
     localStorage.setItem('notification',this.notification);
    }

    createToaster(message, duration) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
    }
}
