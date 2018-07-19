import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Events } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-no-network',
  templateUrl: 'no-network.html',
  providers: [Network]
})
export class NoNetworkPage {

  header_data: any;
  message: string = "";
  image: string = "";

  constructor(public navCtrl: NavController, 
  			  public navParams: NavParams, 
  			  private network:Network, 
  			  private platform:Platform,
  			  private storage:Storage,
  			  private events:Events) {
        this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'No network'};
        this.message = "There is no network connection";
        this.image = "assets/img/no-network.png";
        this.getDataToDisplay();
  }

  ionViewDidLoad() {
  	this.platform.ready().then((res) => {
  		/*Si la connexion est de retour lorsque l'utilisateur est sur cette page, redirige vers la page home*/
  		//OnConnect peut-être géré dans le fichier app
  		this.network.onConnect().subscribe(data => {
  			var page = this.navParams.get('previous_page');
  			this.navCtrl.setRoot(page != null ? page : "HomePage"); //Il faut récupérer les params de la page précédentes si elle en avait
  		});
  	});
  }

  getDataToDisplay(){
  	var content = JSON.parse(localStorage.getItem('appli_settings'));
  	if(content != null && content.no_network_message != null)
  		this.message = content.no_network_message;

  	if(content != null && content.no_network_image != null)
  		this.image = "data:image/jpeg;base64,"+content.no_network_image;
  }
}
