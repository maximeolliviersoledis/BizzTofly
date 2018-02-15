import {Component} from '@angular/core';
import {NavController, Events , IonicPage,ToastController,LoadingController,Platform} from 'ionic-angular';
import {NgForm} from "@angular/forms";
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
    user: any = {
      flag:0
    };
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
        this.userService.getUser()
            .subscribe(res => {
                console.log("user" + JSON.stringify(res));
                 this.user=res;
                 this.userId=res._id;
                 this.user.imageUrl=res.imageUrl;
                 this.translate.use(this.value);
                 loader.dismiss();
            },error=>{
              loader.dismiss();
            })
    }

  onSubmit(user: NgForm) {
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
