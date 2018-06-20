import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,AlertController, ToastController } from 'ionic-angular';
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
  grandTotal:number;
  orderData:any={ };
  showAddress: boolean = false;
  selectedAddress:any={};
  noOfItems: number;
  header_data:any;    
  order_header_data:any;
  /*reductions: any[] = [];
  reductionInput: String;*/
  user: any = {};
  manageAddress: boolean = false;
  public amountDetails:any={};
  public pincodes:Array<any>;
  public pincode_matched:boolean=false;
  public loyaltyPercentage:number=0;
  public loyaltyPoints:number=0;
  public leftLoyaltyPoint:number=0;
  public checked:boolean=false;
  public loyaltyArray:any[]=[];
  public loyaltyLimit:number;
  public payTotal: number;
  public loyaltyObj:any={};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl:LoadingController,
    public alertCtrl:AlertController,
    private userService:UserService,
    private addressListService:AddressListService,
    private storage:Storage,
    public toastCtrl: ToastController) {

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
        /*this.addressListService.getReduction(this.user.id_customer).subscribe(reduction => {
          this.reductions = reduction;
        })*/
        this.addressListService.getAddressList(this.user.id_customer).subscribe(data => {
          console.log(data);
          if(data.addresses){
            var addressList = this.objectToArray(data.addresses);

            for(var address of addressList){
              console.log(address);
              this.addressListService.getAddress(address.id).subscribe(data => {
                this.addressList.push(data);
                console.log(this.addressList);
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

    /*this.addressListService.getAvailablePincodes().subscribe(result=>{
      console.log("pincodes-"+JSON.stringify(result));
      this.pincodes=result;
    });
    this.addressListService.getLoyaltyStatus().subscribe(loyalty=>{
      console.log("loyalty-"+JSON.stringify(loyalty));
      this.loyaltyObj=loyalty;
    })*/

    /*this.userService.getUser().subscribe(user=>{
      console.log("user-"+JSON.stringify(user));
      this.loyaltyArray=user.loyaltyPoints;
      if(this.loyaltyArray!=null){
       let _points:number = 0;
        for (let i = 0; i < this.loyaltyArray.length; i++) {
         _points = Number(_points + this.loyaltyArray[i].points);
         this.loyaltyPoints=_points;
         console.log(this.loyaltyPoints);
        } }
      })*/

      this.orderData.status='pending';
    }

    addAddress(){
      this.navCtrl.push("AddressPage",
        { 
          amountDetails:this.amountDetails,
          addressList: this.addressList,
          cartData: this.navParams.get('cartData')
         });
    }

    updateLoyality(event){
      if(this.loyaltyObj.loyalityProgram){
        if(this.loyaltyPoints >= this.loyaltyObj.minLoyalityPoints) {
          this.checked = event.value;
          if(event.value==true){
            if(this.payTotal < this.loyaltyPoints){
              this.orderData.grandTotal = 0;
              this.leftLoyaltyPoint = this.loyaltyPoints - this.payTotal;
            }
            else if(this.payTotal > this.loyaltyPoints){
              this.orderData.grandTotal = this.payTotal - this.loyaltyPoints;
              this.leftLoyaltyPoint = 0;
            }
          } else {
            this.orderData.grandTotal=this.amountDetails.grandTotal;
          }
        } 
      }

    }


    selectAddress(address){
      this.orderData.shippingAddress = address;
      this.selectedAddress = address;
     /* this.pincode_matched = false;
      this.orderData.shippingAddress=address;
      delete this.orderData.shippingAddress['_id'];
      this.selectedAddress=address;
      for (let i = 0; i <this.pincodes.length; i++) {
        if(this.pincodes[i].pincode==address.pincode){
          this.pincode_matched=true;
        }
      }*/
    }


    checkOut(){
      console.log(this.navParams.get('cartData'));
      if(this.orderData.shippingAddress!=null){
        /*this.navCtrl.push("CheckoutPage", {
          orderData: this.orderData,
          cartData: this.navParams.get('cartData')
        });*/
        this.navCtrl.push("CarrierPage", {
          amountDetails: this.amountDetails,
          orderData: this.orderData,
          cartData: this.navParams.get('cartData')
        })
      }else{
        this.showAlert('Please select address.');
      }
      /*if(this.pincode_matched){
        this.orderData.appliedLoyalty=this.checked;
        if(this.orderData.appliedLoyalty==true){
          this.orderData.usedLoyaltyPoints=this.loyaltyPoints;
        }
        if(this.orderData.shippingAddress!=null){
          this.navCtrl.push("CheckoutPage",{
            orderData:this.orderData
          });
        }
        else {
          this.showAlert('Please select address.');
        }  
      } else {
        this.showAlert('Not available for delivery at your location yet.');
      }*/
    }

    /**
    * Old method. Use delete() instead of deleteAddress
    **/
    deleteAddress(addressId){
      this.addressListService.deleteAddress(addressId).subscribe(data => {
        console.log(data);
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
      console.log("modify address "+address.id);
      this.navCtrl.push("AddressPage", {
        amountDetails:this.amountDetails,
        cartData: this.navParams.get('cartData'),
        addressList: this.addressList,
        address: address
      })
    }

    modify(){
      console.log(this.selectedAddress);
      if(this.selectedAddress && this.selectedAddress.address){
        this.navCtrl.push("AddressPage", {
          amountDetails:this.amountDetails,
          cartData: this.navParams.get('cartData'),
          addressList: this.addressList,
          address: this.selectedAddress.address
        })
      }
    }

    delete(){
      if(this.selectedAddress && this.selectedAddress.address){
        this.addressListService.deleteAddress(this.selectedAddress.address.id).subscribe(data => {
          console.log(data);
          for(var i=0; i<this.addressList.length;i++){
            if(this.addressList[i].address.id === this.selectedAddress.address.id){
              this.addressList.splice(i,1);
            }
          }
        })
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
    
    /*checkReduction(){
        if(this.reductionInput){
            var reductionMatch = false;
            for(var availableReduction of this.reductions){
                if(this.reductionInput === availableReduction.code){
                    this.addressListService.applyReduction(this.user.id_customer, this.navParams.get('cartData').cart.id, availableReduction.id_cart_rule).subscribe(data => {
                        console.log(data);
                    })
                    reductionMatch = true;
                    break;
                }
            }
            if(reductionMatch){
                this.createToaster("Bon de réduction appliqué avec succès !",3000);
            }else{
                this.createToaster("Aucune réduction correspondant à ce code n'a été trouvée",3000);
            }
        }else{
            this.createToaster("Veuillez saisir un code de réduction",3000);
        }
    }*/

    navcart(){
      this.navCtrl.push('CartPage');
    }

  }
