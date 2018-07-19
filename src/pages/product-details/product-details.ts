import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, AlertController, LoadingController, ToastController, IonicPage, Slides, Events} from 'ionic-angular';
import {Service} from '../../app/service';
import {Storage} from '@ionic/storage';
import {ProductDetailsService} from './product-details.service';
import {Vibration} from '@ionic-native/vibration';
import {ConstService} from '../../providers/const-service';
import {TranslateService} from 'ng2-translate/ng2-translate';


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
    price: number = 0;
    totalPrice: number = 0;
    similarProducts: any[] = [];
    displayNumberOfProductsInStock: boolean = false;
    header_data: any;

    constructor(public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public navParams: NavParams,
        private storage: Storage,
        public service: Service,
        public productDetailsService: ProductDetailsService,
        private vibration:Vibration,
        private event:Events,
        private constService:ConstService,
        private translateService:TranslateService
        ) {

        this.productId = navParams.get('productId');
        this.storage.get('cart').then((data)=>{
            this.cartItems = data;
            if (this.cartItems) {
                for(var items of this.cartItems)
                    this.noOfItems += items.quantity;
            }
        })


        this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Produit'};
    }

    ngOnInit() {
        this.constService.presentLoader();
        this.storage.get('user').then(userData => {
            this.user = userData;
            var product = this.navParams.get('product');
            //Evite de faire des requêtes inutiles si le produit a déjà été chargé par l'une des pages précédentes
            if(product){
                console.log("Product already loaded");
                this.productDetails = product;
                console.log(product);
                this.productId = this.productDetails.id_product != null ? this.productDetails.id_product : this.productDetails.id;
                this.initProduct();
            }else if(this.productId){ //Si le produit n'a pas été chargé par une page précédente, alors récupère les infos
                console.log("Product isn't loaded yet");
                var customerId = this.user && this.user.id_customer ? this.user.id_customer : null;
                this.productDetailsService.getProductDetails(this.productId, customerId).subscribe(data => {
                    console.log(data);
                    this.productDetails = data;
                    this.initProduct();
                })
            }else{
                //On ne devrait jamais arrivé dans ce cas là normalement (Voir comment se comporte l'appli lorsqu'elle sort de veille)
                console.log("Unable to load product");
            }
        })

        this.displayNumberOfProductsInStock = JSON.parse(localStorage.getItem('appli_settings')).display_nb_product_in_stock;
        console.log(this.displayNumberOfProductsInStock);

        this.checkFavourite();
        this.constService.dismissLoader();
   }

   ionViewWillLeave(){
       this.event.publish("hideSearchBar");
   }

   initProduct(){
       this.id_declinaisons = this.productDetails.cache_default_attribute;
       let details:any=this.productDetails;
       console.log(details);
       this.initPrice = this.productDetails.price;
       let dec = Object.keys(this.productDetails.declinaisons);
       let goodDec = [];
       for(var d of dec){
           goodDec.push(this.productDetails.declinaisons[d]);
       }
       this.productDetails.declinaisons = goodDec;
       this.product.name = details.name;
       this.product.price = details.price;
       this.product.imageUrl = details.image; 
       this.product.productId = this.productId;
       this.productDetailsService.getFamilyProducts(this.productId).subscribe(data => {
           this.similarProducts = data;
           console.log(this.similarProducts);
       })
   }

   addToCart(productId) {
       console.log(productId);
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
                   this.product.declinaison.splice(0,this.product.declinaison.length);
                   this.product.declinaison.push(this.declinaison);
                   this.itemInCart.splice(0,this.itemInCart.length);
                   this.itemInCart.push(this.product);

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
                
                this.event.publish("updateCartBadge", this.noOfItems);                
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
                    console.log(this.noOfItems);
                    this.event.publish("updateCartBadge", this.noOfItems);
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
                return panier;
        }
    }

    add() { 
        //Non prise en compte de la quantité des déclinaisons
        console.log(this.checkQuantityInCart()); // à revoir, chaque appuie sur le bouton "+" le panier est parcouru
        console.log(this.quantity-this.quantityInCart);

        if (this.quantity>0 && this.count < (this.quantity-this.quantityInCart)) {
            this.count = this.count + 1;
            this.totalPrice = this.count * this.price;
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
            this.totalPrice = this.count * this.price;
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
                this.createToaster('Produit bien ajouté aux favoris', 1000, 'top');
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
                this.createToaster('Produit supprimé des favoris', 1000, 'top');
            }else{
                this.createToaster('Please login first!', 3000);
            }
    }

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
            }
        })
    }

    createToaster(message, duration, position = "bottom") {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration,
            position: position
        });
        toast.present();
    }

    @ViewChild('productImage') productImage:Slides;
    changerImagePrincipale(image){
        this.productImage.autoplayDisableOnInteraction = false;

        var index = this.productDetails.images.findIndex(function(elem){
            return elem == image;
        })

        this.productImage.slideTo(index+1);
    }

    getCorrespondingCombination(){
        console.log("getCorrespondingCombination()"+this.id_declinaisons);
        this.productDetailsService.getDeclinaisons(this.id_declinaisons)
        .subscribe(res => {
            this.declinaison = res;
            console.log(this.declinaison);
            if(this.declinaison.combination.associations && this.declinaison.combination.associations.images)
                this.productDetails.image = this.productDetailsService.getImageUrl(this.productId, this.declinaison.combination.associations.images[0].id);
            this.updatePrice(this.id_declinaisons);
            this.updateQuantity(res.combination.quantity);
        })
    }

    updatePrice(id){
        for(var i=0; i < this.productDetails.declinaisons.length;i++){
            if(id == this.productDetails.declinaisons[i].id){
                this.price = this.productDetails.declinaisons[i].price;
                break;
            }
        }
        this.totalPrice = this.count * this.price;
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

    /**Envoi vers la page des commentaires**/
    goToCommentsPage(){
        this.navCtrl.push("RatingPage", {
            productId: this.productId
        });
    }
    
    /**Gestion du slide des produits de la même famille**/
    currentSlideProduct: any = this.similarProducts[0];
    goToProductPage(){
        this.navCtrl.push("ProductDetailsPage", {
            productId: this.currentSlideProduct.id_product
        })
    }

    @ViewChild('similarProduct') slides:Slides;
    onChange(){
        this.slides.autoplayDisableOnInteraction = false;
        this.currentSlideProduct = this.similarProducts[this.slides.realIndex];
    }
}

