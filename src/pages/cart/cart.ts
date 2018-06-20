import {Component} from "@angular/core";
import {IonicPage, AlertController, NavParams, NavController, PopoverController, ToastController} from "ionic-angular";
import {CartService} from './cart.service';
import {Storage} from '@ionic/storage';

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
                public alertCtrl: AlertController,
                public popoverCtrl: PopoverController,
                public toastCtrl: ToastController,
                private cartService:CartService,
                private storage:Storage) {

        this.header_data = {ismenu: false , isHome:false, isCart: true, enableSearchbar: true, title: 'Cart', hideBackButton: true};        
    }

    ngOnInit(){
        this.storage.get('cart').then((data)=>{
            this.cartItems = data;

            if (this.cartItems != null) {
                for(var items of this.cartItems)
                    this.noOfItems += items.quantity
                
                this.calculatePrice();
                this.storage.get('user').then((data)=>{
                    this.user = data;
                    if(this.user){
                        this.cartService.getReduction(data.id_customer).subscribe(reduction => {
                            this.reductions = reduction;
                        })
                    }
                })
            }
        })
    }

    deleteItem(data){
        console.log(data);
        for(let i=0; i<this.cartItems.length;i++){
            for(let j=0;j<this.cartItems[i].declinaison.length;j++){
                if(this.cartItems[i].declinaison[j].combination.id == data.combination.id && this.cartItems[i].declinaison[j].name == data.name){
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

            /*A voir l'utilité de refaire un get sur ce qu'on vient de set*/
            /*this.storage.get('cart').then((data)=>{
                this.cartItems = data;
            })*/
            this.noOfItems = this.noOfItems - 1;
        }
        //this.applyReduction();
    }

    /**!! Déjà géré par presta => inutile!!**/
    //Système de promotion(réduction brut et pourcentage) fonctionnel mais usine à gaz
    applyReduction(){
        console.log("Prix avant réduction = "+this.subTotalPrice);

        for(var item of this.cartItems){
            for(var declinaison of item.declinaison){
                for(var promo of this.promotion){
                    console.log("Promo en cours : "+promo.specific_price.id);
                    if(promo.specific_price.id_product == item.productId && promo.specific_price.id_product_attribute == declinaison.combination.id){
                        console.log("Réduction pour la déclinaison "+declinaison.name);
                        if(declinaison.selectedQuantity >= promo.specific_price.from_quantity && promo.specific_price.reduction_type == "amount"){
                            console.log("Réduction déclinaison amount accepté : "+promo.specific_price.reduction);
                            this.subTotalPrice -= parseFloat(promo.specific_price.reduction);
                        }else if(declinaison.selectedQuantity >= promo.specific_price.from_quantity && promo.specific_price.reduction_type == "percentage"){
                            console.log("Réduction déclinaison percent accepté : "+promo.specific_price.reduction);
                            this.subTotalPrice = this.subTotalPrice - declinaison.selectedQuantity * declinaison.endPrice; // On retire le montant avant la promo
                            this.subTotalPrice += (declinaison.selectedQuantity * declinaison.endPrice) * promo.specific_price.reduction; // On applique la réduction
                        }
                    }else if(promo.specific_price.id_product == item.productId && promo.specific_price.id_product_attribute == 0){
                        console.log("Réduction pour le produit "+item.name);
                        if(item.quantity >= promo.specific_price.from_quantity && promo.specific_price.reduction_type == "amount"){
                            console.log("Réduction produit amount accepté : "+promo.specific_price.reduction);
                            this.subTotalPrice -= parseFloat(promo.specific_price.reduction);
                        }else if(item.quantity >= promo.specific_price.from_quantity && promo.specific_price.reduction_type == "percentage"){
                            console.log("Réduction produit percent accepté : "+promo.specific_price.reduction);
                            this.subTotalPrice = this.subTotalPrice - item.quantity * item.price; // On retire le montant avant la promo
                            this.subTotalPrice += (item.quantity * item.price) * promo.specific_price.reduction; // On applique la réduction
                        }
                    }else{
                        console.log("Aucune promo trouvé pour le produit "+item.name);
                    }
                }
            }
        }

        console.log("Prix après réduction = "+this.subTotalPrice);
    }

    /*Code inutile prestashop gère déjà les promos*/
    getPromotion(){
        
        //Si aucune condition d'appliquée sur la promo, id_product = 0
        //Si une condtion est appliquée mais pas sur une catégorie, l'applique sur id_product 1 par défaut


        //Il faudrait pouvoir récupérer toutes les promos et garde seulement celles qui sont encores actives
        //Ou directement récupérer les promos atives (le serveur s'occupe du traitement)
        this.cartService.getSpecificPrices(54).subscribe( res => {
            console.log(res);
            this.promotion.push(res);
        })        
        this.cartService.getSpecificPrices(18).subscribe( res => {
            console.log(res);
            this.promotion.push(res);
        })
        this.cartService.getSpecificPrices(35).subscribe( res => {
            console.log(res);
            this.promotion.push(res);
        })
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
            this.calculatePrice();
        }else{
            let alert = this.alertCtrl.create({
                title: "Quantity error!",
                subTitle: "Your are trying to get more than you can",
                buttons: ['OK']
            });
            alert.present();
        }
        //this.applyCoupon();
       // this.applyReduction();
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
            this.calculatePrice();      
        }
        //this.applyCoupon();
        //this.applyReduction();
    }

    createToaster(message, duration) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
    }

    isCart(): boolean {
        return this.cartItems == null || this.cartItems.length == 0 ? false : true;
    }

    gotoHome() {
        this.navCtrl.push("HomePage");
    }

    deleteAllItem(){
       this.cartItems.splice(0,this.cartItems.length);
       this.storage.remove('cart');

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
                        id_currency: 1,
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
                        id_currency: 1,
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
                            this.createToaster("Bon de réduction appliqué avec succès !",3000);
                        else
                            this.createToaster("Vous ne pouvez pas appliquer la même réduction 2 fois pour la même commande !",3000);              
                    })
                    reductionMatch = true;
                    break;
                }
            }
            if(!reductionMatch){
                this.createToaster("Aucune réduction correspondant à ce code n'a été trouvée !",3000);
            }
        }else{
            this.createToaster("Veuillez saisir un code de réduction",3000);
        }
    }
}
