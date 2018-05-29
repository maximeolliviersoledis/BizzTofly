import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Http, Response, Headers} from "@angular/http";

@Component({
  selector: 'page-cgv',
  templateUrl: 'cgv.html',
})
export class CgvPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private http:Http) {
  }
  content: any;
  ionViewDidLoad() {
    console.log('ionViewDidLoad CgvPage');
    this.content = "Condition Générale de Ventes";
    /*this.http.get("http://www.bizztofly.com/fr/content/3-conditions-utilisation?content_only=1").map((data: Response)=>{
    	console.log(data);
    	//this.content = data.text();
    }).subscribe((content)=>{
    }
    	);
    console.log(this.content);*/
  }

}
