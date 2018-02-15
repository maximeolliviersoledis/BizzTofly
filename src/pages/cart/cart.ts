import {Component} from "@angular/core";
import {IonicPage, AlertController, NavController, PopoverController, ToastController} from "ionic-angular";
import {CartService} from './cart.service';

@IonicPage()
@Component({
    selector: 'page-cart',
    templateUrl: 'cart.html',
    providers:[CartService]
})
export class CartPage {
    cartItems: any[] = [];
    subTotalPrice: number;
    taxAmount: number=0;
    otherTaxes: number;
    grandTotal: number;
    noOfItems: number;
    couponDiscount:number=0;
    deductedPrice: number;
    coupons:Array<string>;

    constructor(public navCtrl: NavController,
                public alertCtrl: AlertController,
                public popoverCtrl: PopoverController,
                public toastCtrl: ToastController,
                private cartService:CartService) {

        this.cartItems = JSON.parse(localStorage.getItem('cartItem'));

    }

    ngOnInit(){
         if (this.cartItems != null) {
            this.noOfItems = this.cartItems.length;
            this.cartService.getCoupons().subscribe(coupons=>{
            this.coupons=coupons;
        })
            this.calculatePrice();
        }
        
    }

    deleteItem(data) {
        for (let i = 0; i <= this.cartItems.length - 1; i++) {
            if (this.cartItems[i].productId == data.productId && this.cartItems[i].sizeOption.pname==data.sizeOption.pname) {
                this.cartItems.splice(i, 1);
            }
        }
        if (this.cartItems.length == 0) {
            localStorage.removeItem('cartItem');
            this.noOfItems = null;
        } else {
            this.calculatePrice();
            localStorage.setItem('cartItem', JSON.stringify(this.cartItems));
            this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
            this.noOfItems = this.noOfItems - 1;
        }
        this.applyCoupon();
    }


    applyCoupon() {
      let subTotals = this.subTotalPrice;
      this.deductedPrice=Number((this.couponDiscount / 100 * subTotals).toFixed(2));
      subTotals = subTotals - this.deductedPrice;
      this.grandTotal = Number((subTotals+this.taxAmount).toFixed(2));
      //this.createToaster('Coupon applied successfully', '3000');

    }

    checkout() {
      let amountDetails:any={};
       amountDetails.grandTotal=this.grandTotal;
       amountDetails.subTotal=this.subTotalPrice;
       amountDetails.tax=this.taxAmount;
       amountDetails.couponDiscount=this.couponDiscount;
       amountDetails.deductedPrice=this.deductedPrice;
      if(localStorage.getItem('token')){
       this.navCtrl.push("AddressListPage",{
        amountDetails:amountDetails  }); 
      } else {
       this.navCtrl.push("LoginPage",{
        amountDetails:amountDetails,
        flag:0
      }); 
     }

    }

    calculatePrice() {
        let proGrandTotalPrice = 0;
        for (let i = 0; i <= this.cartItems.length; i++) {
            if (this.cartItems[i] != null) {
                if (this.cartItems[i].extraPrice != null) {
                    proGrandTotalPrice = proGrandTotalPrice + this.cartItems[i].itemTotalPrice + this.cartItems[i].extraPrice;
                } else {
                    proGrandTotalPrice = proGrandTotalPrice + this.cartItems[i].itemTotalPrice;
                }
                this.subTotalPrice = Number(proGrandTotalPrice.toFixed(2));
            }
        }
        this.taxAmount = Number(((5 / 100) * this.subTotalPrice).toFixed(2));
        this.grandTotal = Number((this.subTotalPrice + this.taxAmount).toFixed(2));
    }


    add(data) {
        if (data.Quantity < 20) {
            data.Quantity = data.Quantity + 1;
            for (let i = 0; i <= this.cartItems.length - 1; i++) {
                if (this.cartItems[i].productId == data.productId && this.cartItems[i].sizeOption.pname==data.sizeOption.pname) {
                    this.cartItems[i].Quantity = data.Quantity;
                    if (this.cartItems[i].sizeOption.specialPrice) {
                        this.cartItems[i].itemTotalPrice = (data.Quantity * this.cartItems[i].sizeOption.specialPrice);
                    } else {
                        this.cartItems[i].itemTotalPrice = (data.Quantity * this.cartItems[i].sizeOption.value);
                    }
                }
            }
            localStorage.setItem('cartItem', JSON.stringify(this.cartItems));
            this.calculatePrice();
            this.applyCoupon();
        }
    }

    remove(data) {

        if (data.Quantity > 1) {
            data.Quantity = data.Quantity - 1;
            for (let i = 0; i <= this.cartItems.length - 1; i++) {
                if (this.cartItems[i].productId == data.productId && this.cartItems[i].sizeOption.pname==data.sizeOption.pname) {
                    this.cartItems[i].Quantity = data.Quantity;
                    if (this.cartItems[i].sizeOption.specialPrice) {
                        this.cartItems[i].itemTotalPrice = (data.Quantity * this.cartItems[i].sizeOption.specialPrice);
                    } else {
                        this.cartItems[i].itemTotalPrice = (data.Quantity * this.cartItems[i].sizeOption.value);
                    }
                }
            }
            localStorage.setItem('cartItem', JSON.stringify(this.cartItems));
            this.calculatePrice();
            this.applyCoupon();
        }
    }

    createToaster(message, duration) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
    }

    isCart(): boolean {
        return localStorage.getItem('cartItem') == null || this.cartItems.length == 0 ? false : true;
    }

    gotoHome() {
        this.navCtrl.push("HomePage");
    }


}
