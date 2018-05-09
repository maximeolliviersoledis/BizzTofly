import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,AlertController } from 'ionic-angular';
import { AddressListService } from './address-list.service';
import { UserService } from '../../providers/user-service';

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
  header_data:any;
  user: any = {};
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
    private addressListService:AddressListService) {

    this.amountDetails=this.navParams.get('amountDetails');
    this.orderData.grandTotal=this.amountDetails.grandTotal;
    this.payTotal=this.amountDetails.grandTotal;
    this.orderData.subTotal=this.amountDetails.subTotal;
    this.orderData.taxAmount=this.amountDetails.tax;
    this.orderData.couponDiscountPercentage=this.amountDetails.couponDiscount;
    this.orderData.deductedAmountByCoupon=this.amountDetails.deductedPrice;
    this.orderData.cart=JSON.parse(localStorage.getItem("cartItem"));
    this.header_data = {ismenu: false , isHome:false, isCart: true,isSearch:false, title: 'Delivery Options'};
  }

  ngOnInit() {
    let loader =this.loadingCtrl.create({
      content:'please wait'
    })
    loader.present();
    /*this.addressListService.getAddressList()
    .subscribe(response=>{
      this.addressList=response;
      loader.dismiss();
    },(error)=>{
      loader.dismiss();
    });*/

    this.user = JSON.parse(localStorage.getItem('user'));
    console.log(this.user);
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

    
    //Prévoir la modification d'une adresse
    //Prévoir la suppression d'une adresse


    addAddress(){
      this.navCtrl.push("AddressPage",
        { amountDetails:this.amountDetails });
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
      if(this.orderData.shippingAddress!=null){
        this.navCtrl.push("CheckoutPage", {
          orderData: this.orderData
        });
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



  }
