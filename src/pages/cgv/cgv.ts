import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CgvService } from './cgv.service';

@IonicPage()
@Component({
  selector: 'page-cgv',
  templateUrl: 'cgv.html',
  providers: [CgvService]
})
export class CgvPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public cgvService: CgvService) {}
  content: any;

  ionViewDidLoad() {
    this.cgvService.getCgv().subscribe(data => {
      this.content= data.substr(data.search("<body"),data.length);  //Permet d'enlever tout le contenu dans la balise <header>
    })
  }

}
