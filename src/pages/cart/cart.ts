import {Component} from "@angular/core";
import {IonicPage, NavParams, NavController, Events} from "ionic-angular";
import {CartService} from './cart.service';
import {Storage} from '@ionic/storage';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions';
import {ConstService} from '../../providers/const-service';

@IonicPage()
@Component({
    selector: 'page-cart',
    templateUrl: 'cart.html',
    providers:[CartService]
})
export class CartPage {
    cartItems: any[];
    subTotalPrice: number;
    taxAmount: number=0;
    otherTaxes: number;
    grandTotal: number;
    noOfItems: number = 0;
    couponDiscount:number=0;
    deductedPrice: number;
    coupons:Array<string>;
    promotion: any[] = [];
    reductions: any[] = [];
    reductionInput: String;
    cartData: any = {};
    user: any = {};
    header_data: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private cartService:CartService,
                private storage:Storage,
                private event:Events,
                private nativeTransition:NativePageTransitions,
                private constService:ConstService) {

        this.header_data = {ismenu: false , isHome:false, isCart: true, enableSearchbar: true, title: 'Cart', hideBackButton: true};        
    }

    ngOnInit(){
        this.constService.presentLoader();
        this.storage.get('cart').then((data)=>{
            this.cartItems = data;

            if (this.cartItems != null) {
                for(var items of this.cartItems)
                    this.noOfItems += items.quantity
                
                console.log(this.noOfItems);
                this.calculatePrice();
                this.storage.get('user').then((data)=>{
                    this.user = data;
                    if(this.user){
                        this.cartService.getReduction(data.id_customer).subscribe(reduction => {
                            this.reductions = reduction;
                        }, error => {
                            this.constService.dismissLoader();
                        })
                    }
                }).catch(() => {
                    this.constService.dismissLoader();
                })
            }
            this.constService.dismissLoader();
        }).catch(() => {
            this.constService.dismissLoader();
        })        
    }

    ionViewWillLeave(){
        this.event.publish("hideSearchBar");
    }

    ionViewWillEnter(){
        /*let options: NativeTransitionOptions = {
            direction: 'left', //up, left, right, down
            duration: 100,
            slowdownfactor: 3,
            slidePixels: 20,
            iosdelay: 100,
            androiddelay: 100,
            fixedPixelsTop: 0,
            fixedPixelsBottom: 60
        };
        this.nativeTransition.slide(options); //Pas trop mal*/
    }

    deleteItem(data){
        console.log(data);
        for(let i=0; i<this.cartItems.length;i++){
            for(let j=0;j<this.cartItems[i].declinaison.length;j++){
                if(this.cartItems[i].declinaison[j].combination.id == data.combination.id && this.cartItems[i].declinaison[j].name == data.name){
                    this.noOfItems -= this.cartItems[i].declinaison[j].selectedQuantity;
                    this.cartItems[i].quantity -= this.cartItems[i].declinaison[j].selectedQuantity;
                    this.cartItems[i].declinaison.splice(j,1);
                }
            }
            if(this.cartItems[i].declinaison == 0){
                this.cartItems.splice(i,1);
            }
        }

        if(this.cartItems.length == 0){
            this.storage.remove('cart');
            this.noOfItems = null;
        }else{
            this.calculatePrice();
            this.storage.set('cart',this.cartItems);
        }

        this.event.publish("updateCartBadge", this.noOfItems);
    }

    checkout() {
        /**Vérifier l'utilité de amountDetails sur les pages suivantes**/
        let amountDetails:any={};
        amountDetails.grandTotal=this.grandTotal;
        amountDetails.subTotal=this.subTotalPrice;
        amountDetails.tax=this.taxAmount;
        amountDetails.couponDiscount=this.couponDiscount;
        amountDetails.deductedPrice=this.deductedPrice;
        this.storage.get('user').then((user)=>{
            if(user && user.token){
                var panier = this.sendCart(user.id_customer);
                var idCartData = localStorage.getItem('id_cart');
                if(idCartData){
                    console.log(panier);
                    this.cartService.putCart(idCartData, panier).subscribe(data => {
                        this.navCtrl.push("AddressListPage",{
                            amountDetails: amountDetails,
                            cartData: data,
                        }); 
                    })
                }else{
                    this.cartService.postCart(panier).subscribe(data => {
                        localStorage.setItem('id_cart',data.cart.id);          
                        this.navCtrl.push("AddressListPage",{
                            amountDetails: amountDetails,
                            cartData: data,
                        }); 
                    })
                }
            } else {
                this.navCtrl.push("LoginPage",{
                    amountDetails: amountDetails
                }); 
            }
        })
    }

    calculatePrice() {
        let proGrandTotalPrice = 0;
        for(let i = 0; i <= this.cartItems.length;i++){
            if(this.cartItems[i] ){
                for(let j = 0; j<this.cartItems[i].declinaison.length;j++){
                    proGrandTotalPrice += this.cartItems[i].declinaison[j].selectedQuantity * this.cartItems[i].declinaison[j].endPrice;
                    console.log("proGrandtotalprice : "+proGrandTotalPrice);
                }
                this.subTotalPrice = Number(proGrandTotalPrice.toFixed(2));
                //this.applyReduction();
            }
        }
        /*this.taxAmount = Number(((5 / 100) * this.subTotalPrice).toFixed(2));
        this.grandTotal = Number((this.subTotalPrice + this.taxAmount).toFixed(2));*/
        this.grandTotal = this.subTotalPrice;
        this.taxAmount = Number((this.grandTotal - this.grandTotal * 0.80).toFixed(2));    //A voir pour récupérer la taxe
    }


    add(dataDeclinaison, dataItem) {
        //A optimiser, mets trop de temps pour seulement incrémenter la quantité de 1

        if(dataDeclinaison.selectedQuantity < dataDeclinaison.combination.quantity){
            dataDeclinaison.selectedQuantity += 1;
            for(let i=0; i<this.cartItems.length;i++){
                if(this.cartItems[i].productId == dataItem.productId){
                    for(let j=0; j<this.cartItems[i].declinaison.length;j++){
                        if(this.cartItems[i].declinaison[j].combination.id == dataDeclinaison.combination.id){
                           this.cartItems[i].declinaison[j].selectedQuantity = dataDeclinaison.selectedQuantity;
                           this.cartItems[i].quantity += 1;
                           this.storage.set('cart',this.cartItems);
                           break;
                        }
                    }
                }
            }
            
            this.noOfItems++;
            this.event.publish("updateCartBadge",  this.noOfItems);
            this.calculatePrice();
        }else{
            this.constService.createAlert({title: "Quantity error", message: "You can't get more quantity of this product. You have reached the maximum stock for this product"});
        }
    }

    remove(data) {
        if(data.selectedQuantity > 1){
            var index = this.cartItems.findIndex(function(elem){
                return elem.productId == data.combination.id_product;
            });

            var indexOfDec = this.cartItems[index].declinaison.findIndex(function(elem){
                return elem.combination.id == data.combination.id;
            });
            this.cartItems[index].declinaison[indexOfDec].selectedQuantity -= 1;
            this.cartItems[index].quantity--;
            this.storage.set('cart',this.cartItems);

            this.noOfItems--;
            this.event.publish("updateCartBadge", this.noOfItems);            
            this.calculatePrice();      
        }
        //this.applyCoupon();
        //this.applyReduction();
    }

    isCart(): boolean {
        return this.cartItems == null || this.cartItems.length == 0 ? false : true;
    }

    gotoHome() {
        this.navCtrl.setRoot("HomePage");
    }

    deleteAllItem(){
       this.cartItems.splice(0,this.cartItems.length);
       this.storage.remove('cart');
       this.noOfItems = null;
       this.event.publish("updateCartBadge", this.noOfItems);

       if(localStorage.getItem('id_cart')){
           var customerId = this.user.id_customer;
           this.cartService.putCart(localStorage.getItem('id_cart'),this.sendCart(customerId)).subscribe(data => {
               console.log(data);
           })
       }
    }

    sendCart(customerId){
        var id_cart = JSON.parse(localStorage.getItem('id_cart'));
        if(id_cart){
                console.log("panier existant");
                var modif = {
                    cart: {
                        id: id_cart,
                        id_shop_group: null, 
                        id_shop: null,
                        id_address_delivery: null,
                        id_address_invoice: null,
                        id_carrier: 0,
                        id_currency: this.constService.currency.id,
                        id_customer: customerId,
                        id_guest: null,
                        id_lang: 1,
                        recyclable: null,
                        gift: null,
                        gift_message: null,
                        mobile_theme: null,
                        delivery_option: null,
                        secure_key: null,
                        allow_seperated_package: 0,
                        date_add: null,
                        date_upd: null,
                        associations: {
                            cart_rows: {
                                cart_row: []
                            }
                        }
                    }
                };
                for(var items of this.cartItems){
                    for(var declinaison of items.declinaison){
                        var product: any = {};
                        product.id_product = items.productId;
                        product.id_product_attribute = declinaison.combination.id;
                        product.id_address_delivery = null;
                        product.quantity = declinaison.selectedQuantity;
                        modif.cart.associations.cart_rows.cart_row.push(product);
                    }
                }
                return modif;

        }else{
                console.log(customerId);
                var panier = {
                    cart: 
                    {
                        id_shop_group: null, 
                        id_shop: null,
                        id_address_delivery: null,
                        id_address_invoice: null,
                        id_carrier: 0,
                        id_currency: this.constService.currency.id,
                        id_customer: customerId,
                        id_guest: null,
                        id_lang: 1,
                        recyclable: null,
                        gift: null,
                        gift_message: null,
                        mobile_theme: null,
                        delivery_option: null,
                        secure_key: null,
                        allow_seperated_package: 0,
                        date_add: null,
                        date_upd: null,
                        associations: {
                            cart_rows: {
                                cart_row: []
                            }
                        }
                    }
                };
                for(var items of this.cartItems){
                    for(var declinaison of items.declinaison){
                        var product: any = {};
                        product.id_product = items.productId;
                        product.id_product_attribute = declinaison.combination.id;
                        product.id_address_delivery = null;
                        product.quantity = declinaison.selectedQuantity;
                        panier.cart.associations.cart_rows.cart_row.push(product);
                    }
                }
                return panier;
        }
    }

    checkReduction(){
        if(this.reductionInput){
            var reductionMatch = false;
            for(var availableReduction of this.reductions){
                if(this.reductionInput === availableReduction.code){
                    this.cartService.applyReduction(this.user.id_customer, localStorage.getItem('id_cart'), availableReduction.id_cart_rule).subscribe(data => {
                        console.log(data);
                        if(data == true)
                            this.constService.createToast({message: 'Reduction successfully applied', duration: 3000});
                        else
                           this.constService.createToast({message: "You can't apply the same coupon twice for the same order", duration: 3000});      
                    })
                    reductionMatch = true;
                    break;
                }
            }
            if(!reductionMatch){
                this.constService.createToast({message: "No matching reduction found for this coupon", duration: 3000});
            }
        }else{
            this.constService.createToast({message: "You have to provide a reduction code", duration: 3000});
        }
    }
}
