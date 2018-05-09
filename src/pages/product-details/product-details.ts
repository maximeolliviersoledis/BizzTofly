import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, LoadingController, ToastController, IonicPage} from 'ionic-angular';
import {Service} from '../../app/service';
import {Storage} from '@ionic/storage';
import {ProductDetailsService} from './product-details.service';

@IonicPage()
@Component({
    selector: 'page-product-details',
    templateUrl: 'product-details.html',
    providers: [Service, ProductDetailsService]
})
export class ProductDetailsPage {
    id_declinaisons: number = -1;
    quantityInCart: number = 0;
    quantity: number = -1;
    declinaison: any;
    initPrice: number = -1;
    count: number = 1;
    productId: number;
    noOfItems: number;
    cartItems: any[];
    ExtraOptions: any[] = [];
    itemInCart: any[] = [];
    Cart: any[] = [];
    prices: any[] = [{value: ''}];
    /*product: any = {
        name:'',
        sizeOption: {},
        extraOption: []
    };*/
    product: any = {
        name: ' ',
        quantity: 0,
        declinaison: [],
        sizeOption: {},
        extraOption: []
    }
    productDetails: any = {};
    like: boolean = false;

    constructor(public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public navParams: NavParams,
        public storage: Storage,
        public service: Service,
        public productDetailsService: ProductDetailsService) {

        this.productId = navParams.get('productId');
        console.log("product id = "+this.productId);
        console.log(navParams.get('product'));
        this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
        if (this.cartItems != null) {
            this.noOfItems = this.cartItems.length;
        }
        this.storage.get('favourite').then((favourite) => {
            this.favourites = favourite;
        })
        this.storage.get('favourite').then((favourites) => {
            this.favouriteItems = favourites;
        })
    }

    ngOnInit() {
        console.log("ngOnInit() appelé");
        let loader = this.loadingCtrl.create({
            content: 'please wait'
        })
        loader.present();
        //Plus d'appel api, on passe le produit dans la navParam
        this.productDetails = this.navParams.get('product');
        if(this.productDetails){
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
            loader.dismiss();
        }else{
            loader.dismiss();
        }
        /*this.productDetailsService.getMenuItemDetails(this.productId)
            .subscribe(product => {
                loader.dismiss();
                let details:any=product;
                this.productDetails = product;
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
                //this.product.ratingFlag=0;
                //this.product.rating=0;
            }, error => {
                loader.dismiss();
            })*/


        /*if(localStorage.getItem('token')){
           this.checkfavourite();
       }*/

   }

    /*checkfavourite() {
        this.productDetailsService.checkFavourite(this.productId)
            .subscribe(res => {
                this.like = res.resflag;
            })
        }*/


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
        if(!this.declinaison){
            /**Affiche un message d'erreur indiquant qu'il faut sélectionner une déclinaison avant d'ajouter un produit au panier**/
            let alert = this.alertCtrl.create({
                title: "Please!",
                subTitle: "Veuillez sélectionner une déclinaison avant de passer commande",
                buttons: ['OK']
            });
            alert.present();
        }else{
            this.declinaison.endPrice = parseFloat(this.product.price) + parseFloat(this.declinaison.combination.price);
            this.Cart = JSON.parse(localStorage.getItem("cartItem"));
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

                localStorage.setItem('cartItem', JSON.stringify(this.itemInCart));
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

                    this.product.declinaison.push(this.declinaison);

                    this.Cart.push(this.product);
                    localStorage.setItem("cartItem",JSON.stringify(this.Cart));
                }else{
                    let alert = this.alertCtrl.create({
                        title: 'Quantity error',
                        subTitle: 'Available quantity is '+this.declinaison.combination.quantity+", and you are currently asking for a quantity of "+decQuantity,
                        buttons: ['OK']
                    });
                    alert.present();
                }
                /**Vérifie que la quantité déjà présente dans le panier + la nouvelle quanité ne dépasse pas la quantité totale du produit**/
               /* if(this.declinaison.combination.quantity >= itemInCart.quantity + this.count){
                    this.product.quantity = itemInCart.quantity + this.count;
                    this.declinaison.selectedQuantity = decQuantity;
                    this.product.declinaison.push(this.declinaison);

                    for(var i of this.productDetails.declinaisons){
                        if(this.declinaison.combination.id===i.id){
                            this.product.declinaisonName = i.name;
                            break;
                        }
                    }
                    console.log("Dans le panier : "+this.product.quantity);
                    this.Cart.push(this.product);
                    localStorage.setItem("cartItem",JSON.stringify(this.Cart));
                }else{
                    let alert = this.alertCtrl.create({
                        title: 'Quantity error',
                        subTitle: 'Available quantity is '+this.declinaison.combination.quantity+", and you are currently asking for a quantity of "+(itemInCart.quantity+this.count),
                        buttons: ['OK']
                    });
                    alert.present();
                }*/
            }
        }
        /*if (this.product.sizeOption.value == null) {
            let alert = this.alertCtrl.create({
                title: 'Please!',
                subTitle: 'Select Size and Price!',
                buttons: ['OK']
            });
            alert.present();
        }
        else {
            this.Cart = JSON.parse(localStorage.getItem("cartItem"));
            if (this.Cart == null) {
                this.product.Quantity = this.count;
                if (this.product.sizeOption.specialPrice) {
                    this.product.itemTotalPrice = this.product.Quantity * this.product.sizeOption.specialPrice;
                } else {
                    this.product.itemTotalPrice = this.product.Quantity * this.product.sizeOption.value;
                }
                let proExtraPrice = 0;
                for (let i = 0; i <= this.product.extraOption.length - 1; i++) {
                    proExtraPrice = proExtraPrice + Number(this.product.extraOption[i].selected);
                    this.product.extraPrice = proExtraPrice;
                }

                this.itemInCart.push(this.product);
                localStorage.setItem('cartItem', JSON.stringify(this.itemInCart));

            }
            else {

                for (let i = 0; i <= this.Cart.length - 1; i++) {
                    if (this.Cart[i].productId == productId && this.Cart[i].sizeOption.pname==this.product.sizeOption.pname) {
                        this.Cart.splice(i, 1);

                    }
                }
                this.product.Quantity = this.count;
                if (this.product.sizeOption.specialPrice) {
                    this.product.itemTotalPrice = this.product.Quantity * this.product.sizeOption.specialPrice;
                } else {
                    this.product.itemTotalPrice = this.product.Quantity * this.product.sizeOption.value;
                }
                let proExtraPrice = 0;
                for (let i = 0; i <= this.product.extraOption.length - 1; ++i) {
                    proExtraPrice = proExtraPrice + Number(this.product.extraOption[i].selected);
                    this.product.extraPrice = proExtraPrice;
                }

                this.Cart.push(this.product);
                localStorage.setItem('cartItem', JSON.stringify(this.Cart));
            }
            this.navCtrl.push("CartPage");

        }*/
    }

    checkOptions(option) {
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
    }

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
        let productInCart = JSON.parse(localStorage.getItem('cartItem'));
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

    //Add favourite

    visible = true;
    favourites: any[] = [];
    favourite: any[] = [];
    favouriteItems: any[] = [];


    toggleFavourite() {
        this.visible = !this.visible;
    }

    addToFavourite(productId) {
        console.log("addFavourite appelé : "+this.productId);
        if (localStorage.getItem('token')) {
            this.productDetailsService.addToFavourite(this.productId)
            .subscribe(res => {
                console.log("liked!!!");
                this.like = true;
                this.createToaster('added to favourites!', 3000);
            })
        } else {
            this.createToaster('please login first!', 3000);
        }
    }

    removeFromFavourite(productId) {
        if (localStorage.getItem('token')) {
            this.productDetailsService.removeToFavourite(this.productId)
            .subscribe(res => {
                console.log("unliked!!!");
                this.like = false;
                this.createToaster('removed from favourites!', 3000);
            })
        }

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
        if(quantity>0){
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
   /* fillArray(number){
        return Array.from(Array(number)).map((x, i) => i );
    }*/
}

