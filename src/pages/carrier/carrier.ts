import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController } from 'ionic-angular';
import { CarrierService } from './carrier.service';
import {Storage} from '@ionic/storage';
import {CgvPage} from '../cgv/cgv';

@IonicPage()
@Component({
  selector: 'page-carrier',
  templateUrl: 'carrier.html',
  providers:[CarrierService]
})
export class CarrierPage {
	carriers: any[] =  [];
	carrier: any = {};
  acceptCGV: boolean = false;

  constructor(public navCtrl: NavController, 
  			  public navParams: NavParams,
  			  public carrierService: CarrierService,
    		  public alertCtrl:AlertController,
          private storage:Storage,
          public popoverCtrl:PopoverController
  			  ) {
  }

  ngOnInit(){
    console.log("ngOnInit() carrier appelé");
    //var customer = JSON.parse(localStorage.getItem('user'));
    this.storage.get('user').then((customer)=>{
      var cart = this.navParams.get('cartData');
      console.log(cart);
      console.log(customer);
      this.carrierService.getAllCarriers(customer.id_customer,cart.cart.id).subscribe(data => {
        console.log(data);
        for(var carrier of this.objectToArray(data[0])){
          console.log(carrier);
          console.log(this.objectToArray(this.objectToArray(carrier.carrier_list)[0].instance.delay)[0]);
          console.log(this.objectToArray(carrier.carrier_list)[0].logo);
          if(this.objectToArray(carrier.carrier_list)[0].logo)
            carrier.image = this.carrierService.getCarrierImageUrl(this.objectToArray(carrier.carrier_list)[0].logo);
          else
            carrier.image = false;
          this.carriers.push(carrier);
        }
        console.log(this.carriers);
      /*for(var test of this.objectToArray(data[0])){
        //console.log(test);
        console.log(this.objectToArray(test.carrier_list)[0]);
        this.carriers.push(this.objectToArray(test.carrier_list)[0]);
      }*/
      
    });
    })
    
  	/*this.carrierService.getAllCarriers().subscribe(data => {
  		console.log(data);
  		for(var carrier of data.carriers){
  			this.carrierService.getCarrierById(carrier.id).subscribe(response => {
  				console.log(response);
  				this.carriers.push(response);
  			})
  		}
  	});*/
  }

  selectCarrier(carrier){
    console.log(carrier);
  	this.carrier = carrier;
  }

  goToPayment(){
  	if(this.carrier && this.carrier.carrier_list && this.acceptCGV){

        this.navCtrl.push("RecapPage", {
          orderData: this.navParams.get('orderData'),
          cartData: this.navParams.get('cartData'),
          carrierData: this.carrier
        })
  	}else if(!this.acceptCGV){
  		this.showAlert('Veuillez accepter les cgv !');
  	}else{
      this.showAlert('Veuillez sélectionner un transporteur !');
    }
  }

  private showAlert(message) {
    let alert = this.alertCtrl.create({
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  showCGV($event){
    let popover = this.popoverCtrl.create(CgvPage);
    popover.present({
      ev: $event
    });
  }

  objectToArray(object){
    if(object){
      let item = Object.keys(object);
      let array = [];
      for(var i of item){
        array.push(object[i]);
      }
      return array;
    }else{
      return [];
    }
  }
}
