import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { AddressService } from './address.service';

@IonicPage()
@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
  providers:[AddressService]
})

export class AddressPage {
      /*address={
        userName:'',
        homeNumber:'',
        apartmentName:'',
        mobileNo:'',
        landmark:'',
        city:'',
        state:'',
        pincode:''
      };*/

      address={
        address: 
        {
          firstname:'',
          lastname:'',
          address1:'',
          address2:'',
          postcode:'',
          id_country: 8,
          id_customer: 0,
          city:'',
          alias:''
        }
      };
      addressId:'';
      orderData:any;
      selectedAddress:any;

      constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl:LoadingController,
        public addressService:AddressService) {

        this.orderData=this.navParams.get('orderData');
      }

      ngOnInit() {
        /*if(this.navParams.get('selectedAddress')){  
          this.selectedAddress=this.navParams.get('selectedAddress');
          if(this.selectedAddress._id){
            this.addressService.getAddressById(this.selectedAddress._id)
            .subscribe(response=>{
              this.address.userName=response.userName;
              this.address.homeNumber=response.homeNumber;
              this.address.apartmentName=response.apartmentName;
              this.address.landmark=response.landmark;
              this.address.city=response.city;
              this.address.state=response.state;
              this.address.pincode=response.pincode;
              this.address.mobileNo=response.mobileNo;
            })
          }
        }*/

      }

      onSubmitAddress(){
        var user = JSON.parse(localStorage.getItem('user'));
        this.address.address.id_customer = user.id_customer;
        console.log(this.address);
        this.addressService.addAddress(this.address).subscribe(data => {
          this.navCtrl.push('AddressListPage',{
            amountDetails:this.navParams.get('amountDetails')
          })
        })

        /*let loader =this.loadingCtrl.create({
          content:'please wait'
        })
        loader.present();
        if(this.navParams.get('selectedAddress')){
          this.addressService.updateAddress(this.selectedAddress._id,this.address)
          .subscribe(response=>{
            loader.dismiss();
            this.navCtrl.push("CheckoutConfirmPage",
              { selectedAddress:response,
                orderData:this.orderData 
              });
          },(error)=>{
            loader.dismiss();
          }) 
        } else {
          this.addressService.addAddress(this.address)
          .subscribe(response=>{
            loader.dismiss();
            this.navCtrl.push("AddressListPage",{
              amountDetails:this.navParams.get('amountDetails')
            });

          },(error)=>{
            loader.dismiss();
          })
        }*/
      }


      confirm() {
        this.navCtrl.push("CheckoutConfirmPage");
      }
    }
