import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, LoadingController, ToastController, IonicPage} from 'ionic-angular';
import {Service} from '../../app/service';
import {Storage} from '@ionic/storage';
import {ProductDetailsService} from './product-details.service';
import {Vibration} from '@ionic-native/vibration';


@IonicPage()
@Component({
    selector: 'page-product-details',
    templateUrl: 'product-details.html',
    providers: [Service, ProductDetailsService, Vibration]
})
export class ProductDetailsPage {
    id_declinaisons: number = -1;
    quantityInCart: number = 0;
    quantity: number = -1;
    declinaison: any;
    initPrice: number = -1;
    count: number = 1;
    productId: number;
    noOfItems: number = 0;
    cartItems: any[];
    user: any = {};
    ExtraOptions: any[] = [];
    itemInCart: any[] = [];
    Cart: any[] = [];
    prices: any[] = [{value: ''}];
    product: any = {
        name: ' ',
        quantity: 0,
        declinaison: []
    }
    productDetails: any = {};
    like: boolean = false;

    constructor(public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public navParams: NavParams,
        private storage: Storage,
        public service: Service,
        public productDetailsService: ProductDetailsService,
        private vibration:Vibration
        ) {

        this.productId = navParams.get('productId');

        this.storage.get('cart').then((data)=>{
            this.cartItems = data;
            if (this.cartItems) {
                for(var items of this.cartItems)
                    this.noOfItems += items.quantity;
            }
        })

        this.storage.get('user').then((data)=>{
            this.user = data;
        })
    }

    ngOnInit() {
        console.log("ngOnInit() appelé");
        let loader = this.loadingCtrl.create({
            content: 'please wait'
        })
        loader.present();
        //Plus d'appel api, on passe le produit dans la navParam
        var product = this.navParams.get('product');
        if(product){
            this.productDetails = product;
            let details:any=this.productDetails;
            this.initPrice = this.productDetails.price;
            let dec = Object.keys(this.productDetails.declinaisons);
            let goodDec = [];
            for(var d of dec){
                goodDec.push(this.productDetails.declinaisons[d]);
            }
            this.productDetails.declinaisons = goodDec;
            this.product.productId = details.id;
            this.product.name = details.name;
            this.product.price = details.prices.specific_price;
            this.product.imageUrl = details.image;
            console.log(this.productDetails);
            loader.dismiss();
        }else{
            if(this.productId){
                this.productDetailsService.getMenuItemDetails(this.productId).subscribe(data => {
                    console.log(data);
                    this.productDetails = data ;
                    let details:any=this.productDetails;
                    this.initPrice = this.productDetails.price;
                    let dec = Object.keys(this.productDetails.declinaisons);
                    let goodDec = [];
                    for(var d of dec){
                        goodDec.push(this.productDetails.declinaisons[d]);
                    }
                    this.productDetails.declinaisons = goodDec;
                    this.product.productId = details.id;
                    this.product.name = details.name;
                    this.product.price = details.price;
                    this.product.imageUrl = details.image;
                    console.log(this.productDetails);
                })
            }
            loader.dismiss();
        }
        this.checkFavourite();

   }


   addToCart(productId) {
        /***BUG si on delet eun item du panier qu'on revient sur la page avec la fleche retour arrière et qu'on ajoute à ouveau cet item, le contenu précédemment effacé et de 
        nouveau dans le panier***/
        //Contenu de variable non remis à zéro, variable itemInCart gade le contenu de l'ancien panier et variable product//

        /******BUG si on ajoute un produit on ajoute un autre et qu'on veut à nouveau ajouter le produit précédent, il se retrouve effacé du panier*****/
        ////RESOLU/////
       /* console.log(productId);
        if(this.productIsAlreadyInCart(this.product)){
            console.log("produit déjà présent");
            for(var i of this.product.declinaison){
                if(productId == i.combination.id){
                    console.log("BUG OK ");
                }
            }
        }*/
        console.log(this.itemInCart);
        console.log(this.product);
        console.log(this.declinaison);

        if(!this.declinaison){
            /**Affiche un message d'erreur indiquant qu'il faut sélectionner une déclinaison avant d'ajouter un produit au panier**/
            let alert = this.alertCtrl.create({
                title: "Please!",
                subTitle: "Veuillez sélectionner une déclinaison avant de passer commande",
                buttons: ['OK']
            });
            alert.present();
        }else{
            var id = this.declinaison.combination.id;
            var index =  this.productDetails.declinaisons.findIndex(function(elem){
                return elem.id === id;
            })

            this.declinaison.endPrice = parseFloat(this.productDetails.declinaisons[index].price);
            console.log(this.declinaison.endPrice);
            this.storage.get('cart').then((val) => {
                console.log(val);
                this.Cart = val;

                /**Si le panier est vide**/
                if(this.Cart ==  null){

                    this.product.quantity = this.count;
                    for(var i of this.productDetails.declinaisons){
                        if(this.declinaison.combination.id===i.id){
                            this.declinaison.name = i.name;
                            break;
                        }
                    }
                    this.declinaison.selectedQuantity = this.count;
                    this.noOfItems += this.count;
                //***Correction du second bug***//
                //On vérifie si le produit possède déjà la déclinaison que l'on souhaite ajouter
                /*var dec = this.declinaison.combination.id;
                var decAlreadyExist = this.product.declinaison.findIndex(function(elem){
                    return elem.combination.id == dec;
                });

                if(decAlreadyExist>=0)
                    this.product.declinaison.splice(0,this.product.declinaison.length);

                this.product.declinaison.push(this.declinaison);

                var prod = this.product;
                var prodAlreadyExist = this.itemInCart.findIndex(function(elem){
                    return prod.productId == elem.productId;
                });

                if(prodAlreadyExist>=0)
                    this.itemInCart[prodAlreadyExist] = this.product;
                else
                    this.itemInCart.push(this.product);*/

                //*** ***//

                //Marche absolument pareil que le code au dessus
                //On enlève le contenu des déclinaisons pour la variable produit et ajoute seulement celle qui nous intéresse
                //Même principe pour itemInCart sauf que c'est avec les produits
                this.product.declinaison.splice(0,this.product.declinaison.length);
                this.product.declinaison.push(this.declinaison);
                this.itemInCart.splice(0,this.itemInCart.length);
                this.itemInCart.push(this.product);

                //localStorage.setItem('cartItem', JSON.stringify(this.itemInCart));
                this.storage.set('cart',this.itemInCart);
                var panier = this.user && this.user.id_customer ? this.sendCart(this.user.id_customer) : this.sendCart();

                if(localStorage.getItem('id_cart')){
                    this.productDetailsService.putCart(localStorage.getItem('id_cart'), panier).subscribe(data => {
                        console.log(data);
                    });
                }else{
                    this.productDetailsService.postCart(panier).subscribe(data => {
                        localStorage.setItem('id_cart',data.cart.id);
                    });
                }
                this.createToaster("Successfully added to cart!",2000);
                this.vibration.vibrate(200);
            }else{
                /**Sinon on récupère l'item seulement l'item qui nous intéresse àcl'intérieur du panier**/
                let itemInCart;
                for (let i = 0; i <= this.Cart.length - 1; i++) {
                    //****BUg vient surement de ce bout de code et de la ligne 211 this.Cart.push(this.product);****///
                    if (this.Cart[i].productId == productId){
                        itemInCart = this.Cart[i];
                        this.Cart.splice(i, 1);
                        break;
                    }
                }

                var decQuantity = 0;

                //Si l'item est déjà dans le panier
                if(itemInCart){
                    /**Vérifie que la déclinaison a déjà été ajoutée pour le produit**/
                    var id = this.declinaison.combination.id;
                    var verifPresenceDeclinaison = itemInCart.declinaison.find(function(elem){
                        return elem.combination.id ===id;
                    });

                    if(verifPresenceDeclinaison){
                        for(let i=0; i<itemInCart.declinaison.length ;i++){
                            if(itemInCart.declinaison[i].combination.id === this.declinaison.combination.id){
                                decQuantity = itemInCart.declinaison[i].selectedQuantity +this.count;
                                itemInCart.declinaison.splice(i,1);
                            }
                        }

                        /**Supprime les anciennes valeurs de la déclinaison de l'élément produit**/

                        var indexOfDec = this.product.declinaison.findIndex(function(elem){
                            return elem.combination.id === id;
                        });

                        if(indexOfDec>=0){
                            this.product.declinaison.splice(indexOfDec,1);
                        }

                    }else{
                        decQuantity = this.count;              
                    }

                    /***Correction du bug !?! à tester**/
                    for(let i of itemInCart.declinaison){
                        if(!this.product.declinaison.find(function(elem){
                            return elem.combination.id === i.combination.id;
                        })){
                            this.product.declinaison.push(i);
                        }
                    }

                }else{
                    decQuantity = this.count;
                }

                if(this.declinaison.combination.quantity >= decQuantity){
                    if(itemInCart){
                        this.product.quantity = itemInCart.quantity + this.count;
                    }else{
                        this.product.quantity = decQuantity;
                    }

                    this.declinaison.selectedQuantity = decQuantity;
                    for(var i of this.productDetails.declinaisons){
                        if(this.declinaison.combination.id===i.id){
                            this.declinaison.name = i.name;
                            break;
                        }
                    }  
                    this.noOfItems += this.count;
                    this.product.declinaison.push(this.declinaison);

                    this.Cart.push(this.product);
                    this.storage.set('cart',this.Cart);
                    console.log(this.user);
                    var panier = this.user && this.user.id_customer ? this.sendCart(this.user.id_customer) : this.sendCart();
                    console.log(panier);
                    if(localStorage.getItem('id_cart')){
                        this.productDetailsService.putCart(localStorage.getItem('id_cart'), panier).subscribe(data => {
                            console.log(data);
                        });
                    }else{
                        this.productDetailsService.postCart(panier).subscribe(data => {
                            localStorage.setItem('id_cart',data.cart.id);
                        });
                    }
                    this.createToaster("Successfully added to cart!",2000);
                    this.vibration.vibrate(200);
                }else{
                    let alert = this.alertCtrl.create({
                        title: 'Quantity error',
                        subTitle: 'Available quantity is '+this.declinaison.combination.quantity+", and you are currently asking for a quantity of "+decQuantity,
                        buttons: ['OK']
                    });
                    alert.present();
                }
            }
        })
    }
}

    sendCart(customerId = null){
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

                if(this.Cart == null)
                    this.Cart = this.itemInCart;

                for(var items of this.Cart){
                    console.log(items);
                    for(var declinaison of items.declinaison){
                        console.log(declinaison);    
                        var product: any = {};
                        product.id_product = items.productId;
                        product.id_product_attribute = declinaison.combination.id;
                        product.id_address_delivery = null;
                        product.quantity = declinaison.selectedQuantity;
                        modif.cart.associations.cart_rows.cart_row.push(product);
                    }
                }

                /*for(var items of this.cartItems){
                    console.log(items);
                    for(var declinaison of items.declinaison){
                        console.log(declinaison);    
                        var product: any = {};
                        product.id_product = items.productId;
                        product.id_product_attribute = declinaison.combination.id;
                        product.id_address_delivery = null;
                        product.quantity = declinaison.selectedQuantity;
                        modif.cart.associations.cart_rows.cart_row.push(product);
                    }
                }*/
                console.log(modif);
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

                //Utile car si le panier est vide, cela provoque une erreur
                if(this.Cart == null)
                    this.Cart = this.itemInCart;

                for(var items of this.Cart){
                    console.log(items);
                    for(var declinaison of items.declinaison){
                        console.log(declinaison);    
                        var product: any = {};
                        product.id_product = items.productId;
                        product.id_product_attribute = declinaison.combination.id;
                        product.id_address_delivery = null;
                        product.quantity = declinaison.selectedQuantity;
                        panier.cart.associations.cart_rows.cart_row.push(product);
                    }
                }

               /* for(var items of this.cartItems){
                    console.log(items);
                    for(var declinaison of items.declinaison){
                        console.log(declinaison);    
                        var product: any = {};
                        product.id_product = items.productId;
                        product.id_product_attribute = declinaison.combination.id;
                        product.id_address_delivery = null;
                        product.quantity = declinaison.selectedQuantity;
                        panier.cart.associations.cart_rows.cart_row.push(product);
                    }
                }*/
                console.log(panier);
                return panier;
        }
    }


    /*checkOptions(option) {
        if (this.product.extraOption.length !== 0) {
            for (let i = 0; i <= this.product.extraOption.length - 1; i++) {
                if (this.product.extraOption[i].name == option.name) {
                    this.product.extraOption.splice(i, 1);
                    break;
                }
                else {
                    this.product.extraOption.push(option);
                    break;
                }
            }
        }
        else {
            this.product.extraOption.push(option);
        }
    }*/

    /*sizeOptions(price) {
        this.product.sizeOption = price;
    }*/

    add() { 
        //Non prise en compte de la quantité des déclinaisons
        console.log(this.checkQuantityInCart()); // à revoir, chaque appuie sur le bouton "+" le panier est parcouru
        console.log(this.quantity-this.quantityInCart);

        if (this.quantity>0 && this.count < (this.quantity-this.quantityInCart)) {
            this.count = this.count + 1;
        }else if(this.quantity<0){
            let alert = this.alertCtrl.create({
                title: "Please!",
                subTitle: "Veuillez d'abord chosiir une déclinaison",
                buttons: ['OK']
            });
            alert.present();
        }
    }

    checkQuantityInCart(){
        //let productInCart = JSON.parse(localStorage.getItem('cartItem'));
        let productInCart;
        this.storage.get('cart').then((val) =>{
            productInCart = val;
        })
        if(productInCart){
            for(var product of productInCart){
                if(this.productDetails.id === product.productId){
                    this.quantityInCart = product.quantity;
                    console.log("quantity already in cart = "+this.quantityInCart);
                    return true;
                }
            }
        }
        return false;
    }

    remove() {
        if (this.count > 1) {
            this.count = this.count - 1;
        }
    }

    home() {
        this.navCtrl.push("HomePage");
    }

    navcart() {
        this.navCtrl.push("CartPage", {
            product: this.navParams.get('product')
        });
    }

    favourites: any[] = [];
    favourite: any[] = [];
    favouriteItems: any[] = [];

    addToFavourite(productId){
        console.log("addFavourite appelé : "+this.productId);
            if(this.user && this.user.token){
                this.productDetailsService.addToFavourite(productId, 1, this.user.id_customer, 1).subscribe(data => {
                    console.log(data);
                })
                this.like = true;  
            }else{
                this.createToaster('Please login first!', 3000);
            }
    }

    removeFromFavourite(productId){
        console.log("addFavourite appelé : "+this.productId);
            if(this.user && this.user.token){
                this.productDetailsService.removeFromFavourite(productId, 1, this.user.id_customer).subscribe(data => {
                    console.log(data);
                })
                this.like = false;  
            }else{
                this.createToaster('Please login first!', 3000);
            }
    }
    /*addToFavourite(productId) {
        console.log("addFavourite appelé : "+this.productId);
        this.storage.get('user').then((val) => {
            var user = val;
            if(user && user.token){
                this.storage.get('favourite').then((val) => {
                    var favouriteList = val;
                    if(favouriteList){
                    }else{
                        favouriteList = [];
                        favouriteList.push(productId);
                    }
                this.storage.set('favourite',favouriteList);
                this.productDetailsService.addToFavourite(productId, 1, user.id_customer, 1).subscribe(data => {
                    console.log(data);
                })
                this.like = true;  
            })

            }else{
                this.createToaster('Please login first!', 3000);
            }
        })
    }

    removeFromFavourite(productId) {
        this.storage.get('user').then((val) => {
            var user = val;
            if(user.token){
                this.storage.get('favourite').then((val)=>{
                    var favouriteList = val;
                    if(favouriteList.length == 1)
                        this.storage.remove('favourite');
                    else{
                        for(var i=0; i<favouriteList.length;i++){
                            if(favouriteList[i] == productId){
                                favouriteList.splice(i,1);
                            }
                        }
                        this.storage.set('favourite',favouriteList);
                    }
                    this.productDetailsService.removeFromFavourite(productId, 1, user.id_customer).subscribe(data => {
                        console.log(data);
                    })
                    this.like = false;
                })
            }
        })
    }*/

    /*addToFavourite(productId) {
        console.log("addFavourite appelé : "+this.productId);
        var user: any = {};
        this.storage.get('user').then((val) => {
            console.log(val);
            user = val;
        })
        console.log(user);
        //if(JSON.parse(localStorage.getItem('user')).token){
         if(user && user.token){
            //var favouriteList: any[] = JSON.parse(localStorage.getItem('favourite'));
            var favouriteList = null;
            this.storage.get('favourite').then((val) => {
                favouriteList = val;
            })
            if(favouriteList){
                favouriteList.push(productId);
            }else{
                favouriteList = [];
                favouriteList.push(productId);
            }
            //localStorage.setItem('favourite', JSON.stringify(favouriteList));
            this.storage.set('favourite',favouriteList);
            this.productDetailsService.addToFavourite(productId,1,1,"d5f1da826483ec93e23dabb4c6d10539").subscribe(data => {
                console.log(data);
            })
            this.like = true;            
        }else{
            this.createToaster('Please login first!', 3000);
        }
    }*/

   /* removeFromFavourite(productId) {
        console.log("productId"+productId);
        var user = null;
        this.storage.get('user').then((val) => {
            user = val;
        })
        //if (JSON.parse(localStorage.getItem('user')).token) {
        if(user.token){
            //var favouriteList: any [] = JSON.parse(localStorage.getItem('favourite'));
            var favouriteList = null;
            this.storage.get('favourite').then((val)=>{
                favouriteList = val;
            })
            if(favouriteList.length == 1)
                this.storage.remove('favourite');
                //localStorage.removeItem('favourite');
            else{
                for(var i=0; i<favouriteList.length;i++){
                    console.log(favouriteList[i]);
                    if(favouriteList[i] == productId){
                        console.log("if ok");
                        favouriteList.splice(i,1);
                    }
                }
                console.log(favouriteList);
                //localStorage.setItem('favourite',JSON.stringify(favouriteList));
                this.storage.set('favourite',favouriteList);
            }
            this.like = false;
        }
    }*/

    checkFavourite(){
        console.log("checkFavourite appele");
        this.storage.get('user').then((userData)=>{
            if(userData && userData.token){
                this.productDetailsService.getFavouriteList(userData.id_customer).subscribe(data=>{
                    if(data && data.length > 0){
                        var idProduct = this.productId;
                        this.like = data.find(function(elem){
                            return elem.id_product == idProduct;
                        })
                    }
                })
                /*this.storage.get('favourite').then((val)=>{
                    var favouriteList = val;
                    var idProduct = this.productId;
                    console.log(this.productId);
                    if(favouriteList){
                        this.like = favouriteList.find(function(elem){
                            return elem == idProduct;
                        })
                    }
                })*/
            }
        })
    }

    createToaster(message, duration) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
    }

    changerImagePrincipale(image){
        this.productDetails.image = image;
    }

    getCorrespondingCombination(){
        console.log("getCorrespondingCombination()"+this.id_declinaisons);
       /* this.productDetailsService.getDeclinaisons(this.id_declinaisons).subscribe(res => {
            console.log("ok");
        })*/
        this.productDetailsService.getDeclinaisons(this.id_declinaisons)
        .subscribe(res => {
            this.declinaison = res;
            console.log(this.declinaison.combination.quantity);
            this.updatePrice(res.combination.unit_price_impact);
            this.updateQuantity(res.combination.quantity);
            console.log("declinaisons ok");
            console.log(res);
            console.log(res.combination.unit_price_impact);
        })
    }

    updatePrice(price){
        if(price != 0){
            var productPrice = this.productDetails.price;
            this.productDetails.price = parseFloat(productPrice) + parseFloat(price);
        }else{
            this.productDetails.price = this.initPrice;
        }
    }

    updateQuantity(quantity){
        console.log("Quantité : "+quantity);
        if(quantity>=0){
            this.quantity = quantity;
        }
    }

    productIsAlreadyInCart(product){
        let cart = JSON.parse(localStorage.getItem('cartItem'));
        if(!cart)
            return false;

        for(let item of cart){
            if(item.productId == product.productId){
                for(let declinaison of item.declinaison){
                    var test = product.declinaison.find(function(elem){
                        return declinaison.combination.id === elem.combination.id;
                    });

                    if(test){
                        return true;
                    }
                }
            }
        }
        return false;
    }
}

