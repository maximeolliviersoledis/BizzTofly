import {Component} from '@angular/core';
import {NavController, NavParams, IonicPage,LoadingController, Platform, Events, AlertController} from 'ionic-angular';
import {Service} from '../../app/service';
import {OrderDetailsService} from './order-details.service';
import {Storage} from '@ionic/storage';

@IonicPage()
@Component({
    selector: 'page-order-details',
    templateUrl: 'order-details.html',
    providers: [OrderDetailsService]

})
export class OrderDetailsPage {
    orderId: '';
    orderDetails: any = {};
    private loader:any;
    products: any[] = [];
    header_data: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private loadingCtrl:LoadingController,
                public service: Service,
                public orderDetailsService: OrderDetailsService,
                private platform:Platform,
                private events:Events,
                private alertCtrl:AlertController,
                private storage:Storage) {

        this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Order details'};
    }


    ngOnInit() {
        this.loader =this.loadingCtrl.create({
            content:'please wait'
        })
         this.loader.present();
            this.orderDetails = this.navParams.get('order');
            this.orderId = this.orderDetails.order.id;
            for(var i of this.orderDetails.order.associations.order_rows){
               this.orderDetailsService.getProductInfo(i.product_id).subscribe(data => {
                   this.products.push(data);
               })
            }
            this.loader.dismiss();

    }

    ionViewWillLeave(){
        this.events.publish("hideSearchBar");
    }

    trackOrder() {
        this.navCtrl.push("OrderStatusPage",
            {orderId: this.orderId});
    }

    buyAgain(productId){
        this.navCtrl.push("ProductDetailsPage",{
            productId:productId,
            product: this.getProductById(productId)
        })
    }

    getProductById(productId){
       return this.products.find((elem) => {
            return elem.id == productId;
        })
    }

    getImage(productId){
      var product = this.getProductById(productId);
      return product ? product.image : null;
    }

    getPrice(productId){        
      var product = this.getProductById(productId);
      return product ? product.prices.specific_price : null;
    }

    orderAgain(){
        this.storage.get('cart').then((cartData) => {
            if(cartData != null){                
                this.alertCtrl.create({
                    title: "Commander à nouveau",
                    message: "Attention ceci supprimera votre panier actuel",
                    buttons: [{
                        text: 'Cancel',
                        role: 'cancel',                        
                    },
                    {
                        text: 'Ok',
                        handler: () => {
                            this.addToCart();
                        }
                    }]
                }).present();
            }else{
                this.addToCart();
            }
        });
    }

    nbResponceReceived: number = 0;
     addToCart(){
         console.log("addTocart appel");
        let cart = [];
        for(var product of this.orderDetails.order.associations.order_rows){
            let alreadyInCart = cart.findIndex((elem) => {
                return elem.productId == product.product_id;
            })
            if(alreadyInCart != -1){
                cart[alreadyInCart].quantity += parseInt(product.product_quantity);
                let declinaisonAlreadyInCart = cart[alreadyInCart].declinaison.findIndex((elem)=>{
                    return elem.id == product.product_attribute_id;
                })

                //Si la déclinaison n'est pas présente dans le panier alors l'ajoute
                if(declinaisonAlreadyInCart == -1){
                    console.log("nouvelle décli");
                    let declinaison: any = {};
                    declinaison.id = product.product_attribute_id;  
                    declinaison.selectedQuantity = parseInt(product.product_quantity);
                    declinaison.endPrice = this.getProductById(product.product_id).declinaisons[product.product_attribute_id].price;
                    declinaison.name = this.getProductById(product.product_id).declinaisons[product.product_attribute_id].name;

                    this.orderDetailsService.getCombination(product.product_attribute_id).toPromise().then((combinationData) => {
                        this.nbResponceReceived++;
                        declinaison.combination = combinationData.combination;        
                        cart[alreadyInCart].declinaison.push(declinaison);

                        this.storage.set('cart', cart);
                        if(this.nbResponceReceived == this.orderDetails.order.associations.order_rows.length)
                            this.navCtrl.push('CartPage');
                    })
                }else{
                    //Normalement, ce cas là est impossible
                    alert('Declinaison non présente');
                }
            }else{
                //Créer le produict s'il n'est pas déjà dans le panier                
                let productForCart: any = {
                    declinaison: []
                };
                productForCart.name = this.getProductById(product.product_id).name;
                productForCart.quantity = parseInt(product.product_quantity);
                productForCart.productId = product.product_id;
                productForCart.imageUrl = this.getImage(product.product_id);

                //Créer la déclinaison
                let declinaison: any = {};
                declinaison.id = product.product_attribute_id;
                declinaison.selectedQuantity = parseInt(product.product_quantity);
                declinaison.endPrice = this.getProductById(product.product_id).declinaisons[product.product_attribute_id].price;
                declinaison.name = this.getProductById(product.product_id).declinaisons[product.product_attribute_id].name;

                this.orderDetailsService.getCombination(product.product_attribute_id).toPromise().then((combinationData) => {
                    this.nbResponceReceived++;

                    declinaison.combination = combinationData.combination;        

                    productForCart.declinaison.push(declinaison);
                    cart.push(productForCart);     
                    this.storage.set('cart', cart); 
                    if(this.nbResponceReceived == this.orderDetails.order.associations.order_rows.length)
                        this.navCtrl.push('CartPage');

                })
            }
        }

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
