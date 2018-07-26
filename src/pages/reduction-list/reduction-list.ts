import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ReductionListService } from './reduction-list.service';
import { Service } from '../../app/service';
import { Storage } from '@ionic/storage';
import { ConstService } from '../../providers/const-service';

@IonicPage()
@Component({
  selector: 'page-reduction-list',
  templateUrl: 'reduction-list.html',
  providers: [ReductionListService]
})
export class ReductionListPage {
	user: any = {};
	reductions: any[];
  	showInfo: boolean = false;
  	selectedReduction: any =  {};
  header_data: any;
  currency: string;

  constructor(public navCtrl: NavController,
  			  public navParams: NavParams,
  			  private storage:Storage,
  			  public reductionListService:ReductionListService,
  			  public alertCtrl:AlertController,
          public service:Service,
          private constService:ConstService) {
        this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'My reductions'};        

  }

  ngOnInit(){
  	if(this.navParams.get("showInfo")){
  		this.showInfo = this.navParams.get("showInfo");
  		this.selectedReduction = this.navParams.get("reduction");
      this.currency = this.selectedReduction.reduction_amount != 0 ? "€" : "%";
  	}else{
	  	this.storage.get('user').then((data)=>{
	  		this.user = data;

	  		if(!this.user && !this.user.token)
	  			this.navCtrl.push("LoginPage");

	  		this.reductionListService.getCustomerReductions(this.user.id_customer).subscribe(data => {
	  			this.reductions = data;
	  		})
	  	})
	}
  }

  showInfos(reduction){
  	this.navCtrl.push("ReductionListPage" ,{
  		showInfo: true,
  		reduction: reduction
  	});
  	/*let valueType = reduction.reduction_percent != 0 ? "%" : "€";
  	let message = "Valeur : "+reduction.value+ valueType+"\n Utilisable à partir d'un montant de "+reduction.minimum_amount+"€\n Ce bon est utilisable "+reduction.quantity+" fois. \n Ce bon est valide jusqu'au "+reduction.date_to;
  	let alert = this.alertCtrl.create({
  		title: "Infos",
  		subTitle: message,
  		buttons: ['OK']
  	});
  	alert.present();*/
  }

}
