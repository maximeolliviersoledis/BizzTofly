import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddressService } from './address.service';
import { Storage } from '@ionic/storage';
import { ConstService } from '../../providers/const-service';

@IonicPage()
@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
  providers:[AddressService]
})

export class AddressPage {
      /* Possibilité d'ajouter un numéro de téléphone */
      address: any = {
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
          //phone: ''
          //phone_mobile: ''
        }
      };
      selectedAddress:any;

      constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public addressService:AddressService,
        private storage:Storage,
        private constService:ConstService) {}

      ngOnInit() {
        this.selectedAddress = this.navParams.get('address');
        console.log(this.selectedAddress);

        if(this.selectedAddress){
          this.address.address.id = this.selectedAddress.id;
          this.address.address.firstname = this.selectedAddress.firstname;
          this.address.address.lastname = this.selectedAddress.lastname;
          this.address.address.address1 = this.selectedAddress.address1;
          this.address.address.address2 = this.selectedAddress.address2;
          this.address.address.postcode = this.selectedAddress.postcode;
          this.address.address.id_country = this.selectedAddress.id_country;
          this.address.address.id_customer = this.selectedAddress.id_customer;
          this.address.address.city = this.selectedAddress.city;
          this.address.address.alias = this.selectedAddress.alias;
        }
      }

      onSubmitAddress(){
        this.constService.presentLoader();
        let addressList = this.navParams.get('addressList');
        if(this.navParams.get('address')){
          this.addressService.putAddress(this.address.address.id, this.address).subscribe(data => {
            for(var i= 0; i<addressList.length;i++){
              if(addressList[i].address.id === this.address.address.id){
                addressList[i] = data;
                console.log(addressList[i]);
                break;
              }
            }
            console.log(addressList);
            this.constService.dismissLoader();
            this.navCtrl.push('AddressListPage',{
              amountDetails:this.navParams.get('amountDetails'),
              cartData: this.navParams.get('cartData'),
              addressList: addressList,
              manageAddress : this.navParams.get('manageAddress')
            })
          })
        }else{
          this.storage.get('user').then((data)=>{
            this.address.address.id_customer = data.id_customer;
            console.log(this.address);
            this.addressService.addAddress(this.address).subscribe(data => {
              addressList.push(data);
              this.constService.dismissLoader();
               this.navCtrl.push('AddressListPage',{
                amountDetails:this.navParams.get('amountDetails'),
                cartData: this.navParams.get('cartData'),
                addressList: addressList,
                manageAddress : this.navParams.get('manageAddress')
              })
            })
          })

        }
      }
    }
