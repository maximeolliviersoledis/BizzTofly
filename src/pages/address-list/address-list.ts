import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,AlertController, ToastController, Events } from 'ionic-angular';
import { AddressListService } from './address-list.service';
import { UserService } from '../../providers/user-service';
import {Storage} from '@ionic/storage';
@IonicPage()
@Component({
  selector: 'page-address-list',
  templateUrl: 'address-list.html',
  providers:[AddressListService]
})
export class AddressListPage {
  addressList:any[] = [];
  orderData:any={ };
  selectedAddress:any={};
  noOfItems: number;
  header_data:any;    
  order_header_data:any;
  user: any = {};
  manageAddress: boolean = false;
  public amountDetails:any={};
  public payTotal: number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl:LoadingController,
    public alertCtrl:AlertController,
    private addressListService:AddressListService,
    private storage:Storage,
    public toastCtrl: ToastController,
    private events:Events) {

    this.amountDetails=this.navParams.get('amountDetails');
    this.orderData.grandTotal=this.amountDetails.grandTotal;
    this.payTotal=this.amountDetails.grandTotal;
    this.orderData.subTotal=this.amountDetails.subTotal;
    this.orderData.taxAmount=this.amountDetails.tax;
    this.orderData.couponDiscountPercentage=this.amountDetails.couponDiscount;
    this.orderData.deductedAmountByCoupon=this.amountDetails.deductedPrice;
    this.storage.get('cart').then((cartData)=>{
      this.orderData.cart = cartData;
    })
    this.manageAddress = this.navParams.get('manageAddress');
    if(!this.manageAddress){
      this.manageAddress = false;
    }
    this.noOfItems = this.navParams.get('noOfItems');
    let pageTitle = this.manageAddress ? "Manage your addresses" : "Delivery Options";
    this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: pageTitle};
    this.order_header_data = {currentStep: 1, pageName: "AddressList"};
  }

  ngOnInit() {
    let loader =this.loadingCtrl.create({
      content:'please wait'
    })
    loader.present();

    var list = this.navParams.get('addressList');
    if(!list){
      this.storage.get('user').then((data)=>{
        this.user = data;
        this.addressListService.getAddressList(this.user.id_customer).subscribe(data => {
          if(data.addresses){
            var addressList = this.objectToArray(data.addresses);

            for(var address of addressList){
              this.addressListService.getAddress(address.id).subscribe(data => {
                this.addressList.push(data);
              })
            }
          }
          loader.dismiss();
        })
      })
    }else{
      this.addressList = list;
      console.log("addressList already loaded !");
      loader.dismiss();
    }

      this.orderData.status='pending';
    }

    ionViewWillLeave(){
        this.events.publish("hideSearchBar");
    }

    addAddress(){
      this.navCtrl.push("AddressPage",
        { 
          amountDetails:this.amountDetails,
          addressList: this.addressList,
          cartData: this.navParams.get('cartData'),
          manageAddress : this.navParams.get('manageAddress')
         });
    }

    selectAddress(address){
      this.orderData.shippingAddress = address;
      this.selectedAddress = address;
    }


    checkOut(){
      if(this.orderData.shippingAddress!=null){
         var cartData = this.navParams.get('cartData');
        this.addressListService.putCart(cartData.cart.id, this.putCartInfo(cartData.cart.id)).subscribe(() =>{
          this.navCtrl.push("CarrierPage", {
            amountDetails: this.amountDetails,
            orderData: this.orderData,
            cartData: this.navParams.get('cartData')
          })
        })
      }else{
        this.showAlert('Please select address.');
      }
    }

    putCartInfo(cartId){
        var cart = this.navParams.get('cartData');
        var modif = {
            cart: {
                id: cartId,
                id_shop_group: 1, 
                id_shop: 1,
                id_address_delivery: this.orderData.shippingAddress.address.id,
                id_address_invoice: this.orderData.shippingAddress.address.id,
                id_currency: 1,
                id_customer: cart.cart.id_customer,
                id_lang: 1,
                associations: {
                    cart_rows: {
                        cart_row: []
                    }
                }
            }
        };


        for(var items of cart.cart.associations.cart_rows){
            var product: any = {};
            product.id_product = items.id_product;
            product.id_product_attribute = items.id_product_attribute;
            product.id_address_delivery = items.id_address_delivery;
            product.quantity = items.quantity;
            modif.cart.associations.cart_rows.cart_row.push(product);        
        }
        return modif;        
    }

    /**
    * Old method. Use delete() instead of deleteAddress
    **/
    deleteAddress(addressId){
      this.addressListService.deleteAddress(addressId).subscribe(data => {
        for(var i=0; i<this.addressList.length;i++){
          if(this.addressList[i].address.id === addressId){
            this.addressList.splice(i,1);
          }
        }
      })
    }

    /**
    * Old method. Use modify() instead of modifyAddress
    **/
    modifyAddress(address){
      this.navCtrl.push("AddressPage", {
        amountDetails:this.amountDetails,
        cartData: this.navParams.get('cartData'),
        addressList: this.addressList,
        address: address
      })
    }

    modify(){
      if(this.selectedAddress && this.selectedAddress.address){
        this.navCtrl.push("AddressPage", {
          amountDetails:this.amountDetails,
          cartData: this.navParams.get('cartData'),
          addressList: this.addressList,
          address: this.selectedAddress.address,
          manageAddress : this.navParams.get('manageAddress')
        })
      }else{
        this.showAlert("Vous devez sélectionner une adresse afin de pouvoir la modifier");
      }
    }

    delete(){
      if(this.selectedAddress && this.selectedAddress.address){
        this.addressListService.deleteAddress(this.selectedAddress.address.id).subscribe(() => {
          console.log("delete method");
          for(var i=0; i<this.addressList.length;i++){
            if(this.addressList[i].address.id === this.selectedAddress.address.id){
              this.addressList.splice(i,1);
              this.selectedAddress = null;
              this.orderData.shippingAddress = null;
              this.createToaster("Votre adresse a bien été supprimée", 2000);
            }
          }
        })
      }else{
        this.showAlert("Vous devez sélectionner une adresse afin de pouvoir la supprimer");
      }
    }

    private showAlert(message) {
      let alert = this.alertCtrl.create({
        subTitle: message,
        buttons: ['OK']
      });
      alert.present();
    }

    private objectToArray(object){
      let item = Object.keys(object);
      let array = [];
      for(var i of item){
        array.push(object[i]);
      }
      return array;
    }

    createToaster(message, duration) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
    }
  }
