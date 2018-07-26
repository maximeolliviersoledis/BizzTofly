import {LoadingController, Loading, AlertController, ToastController} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {TranslateService} from 'ng2-translate';

@Injectable()
export class ConstService {
    constructor(private loadCtrl:LoadingController,
                private alertCtrl:AlertController, 
                private translateService:TranslateService,
                private toastCtrl:ToastController){}

    /**
    * Use this method if you want translated alert
    * @param options The alert option (see ionic doc for more informations)
    */
    createAlert(options: any){
        if(options.title){
            this.translateService.get(options.title).subscribe(translatedTitle => {
                options.title = translatedTitle;
            });
        }

        if(options.subTitle){
            this.translateService.get(options.subTitle).subscribe((translatedSubtitle) => {
                options.subTitle = translatedSubtitle; 
            });
        }

        if(options.message){
        this.translateService.get(options.message).subscribe(translatedMessage => {
                options.message = translatedMessage;
            });
        }

        //Set the default style 
        if(!options.cssClass){
            options.cssClass = "alert-style";
        }

        //Set default 'OK' buttons
        if(!options.buttons){
            options.buttons = [
                {
                    text: 'OK'
                }
            ];
        }else{
            for(var i = 0; i < options.buttons.length; i++){
                console.log(options.buttons[i]);
                this.translateService.get(options.buttons[i].text).subscribe((translatedButtonText) => {
                   options.buttons[i].text = translatedButtonText;
                })
            }
        }

        this.alertCtrl.create(options).present();
    }

    /**
    * Use this method if you want to display translated toast
    * @param options The toast options (see ionic doc for more details)
    */
    createToast(options: any){
        if(options.message){
            this.translateService.get(options.message).subscribe((translatedMessage) => {
                options.message = translatedMessage;
            });
        }

        //Set the default duration to 2s
        if(!options.duration)
            options.duration = 2000;

        this.toastCtrl.create(options).present();
    }

    /**
    * Use this method to present the soledis loader
    */
    presentLoader(){
        this.createLoader();
        this.loader.present();
    }

    /**
    * Use this method to dismiss the loader
    */
    dismissLoader(){
        this.loader.dismiss();
    }

    private createLoader(){
        this.loader = this.loadCtrl.create({
            content: '<img height="50" width="50" src="assets/img/loader.gif">',
            spinner: 'hide'
        });
    }

    private loader: Loading;
    /**GLOBAL VARS**/
    accessToken: string;
    nbOfRetry: number = 5; //How many times the application should retry a failed request?
    delayOfRetry: number = 1000; //The delay between each retries request
    user: any; //Contains user data
    currency: any; //Contains all data about the currency use

    /***URL***/
    addCommentDir = "/add_comment";
    adresses = '/addresses';
    appliSettingsDir="/appli_settings";
    base_url = 'https://restaurantrestapi.herokuapp.com/';
    baseDir = "http://www.bizztofly.com/api";
    baseDirApiSoledis = "http://www.bizztofly.com/api-soledis";
    cartDir = "/carts";
    carrierDir = "/carriers";
    carrierDetailsDir = "/carrier_details";
    categoryDir = "/categories";
    categoriesListing = "/categories_listing";
    combinationDir = "/combinations";
    commentsDir="/comments";
    commentUsefulnessDir = "/comment_usefulness";
    contactDir = "/contacts";
    customerDir = "/customers";
    familyProductDir = "/family_product";
    favouriteDir = "/favourite";
    getAccessToken = "/get_access_token";
    getKeyDir = "/get_key";
    imageDir = "/images";
    notificationDir = "http://www.bizztofly.com/modules/sld_notification/mobile-notification.php";
    modifyUserDir = "/modify_user";
    orderDir = "/orders";
    orderStates = "/order_states";
    paymentDir = "/payments";
    productDetail = "/product_detail";
    productDir = "/products";
    productsInPromoDir= "/product_promo";
    reductionDir = "/reduction";
    reportCommentDir = "/report_comment";
    resetPasswordDir ="/reset_password";
    search = "/search";
    settingsModuleDir = "http://www.bizztofly.com/modules/sld_appli_settings/appli_settings.php";
    specificPriceRulesDir = "/specific_price_rules";
    specificPriceDir = "/specific_prices";
    storesDir = "/stores";

    /***Parameters***/
    action = "&action=";
    content = "&content=";
    email = "&email=";
    enable = "&enable=";
    fcm = "&fcm=";
    grade = "&grade=";
    idCart = "&id_cart=";
    idCartRule = "&id_cart_rule=";
    idContact = "&id_contact=";
    idCustomer = "&id_customer=";
    idOrder = "&id_order=";
    idProduct = "&id_product=";
    idProductAttribute = "&id_product_attribute=";
    keyDir = "?ws_key=P67RDX29JM5ITD4JA5A56GZJSIXGXBKL";
    formatDir = "&output_format=JSON";
    limitQuery = "&limit=";
    message = "&message=";
    osType = "&os=";
    quantity = "&quantity="
    reference = "&reference=";
    sortIdDesc = "&sort=[id_DESC]";
    title = "&title=";
    token = "&token=";
    uselfuness = "&usefulness=";
    uuid = "&uuid=";


    /***Filters***/
    filterActive = "&filter[active]=";
    filterIdCart = "&filter[id_cart]=";
    filterIdCurrency = "&filter[id_currency]=";
    filterIdCustomer = "&filter[id_customer]=";
    filterDeleted = "&filter[deleted]=";
    filterNeedRange = "&filter[need_range]=";
    filterUser = "&filter[user]=";
}



/*import {HttpInterceptor, HttpRequest, HttpHandler} from '@angular/common/http';
import {map} from 'rxjs/Operator/map'

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next:HttpHandler){
        const cloneRequest = req.clone({headers: req.headers.append('My-Authorization', 'test')});
        return next.handle(cloneRequest);
    }
}*/