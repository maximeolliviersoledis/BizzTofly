import {Component} from '@angular/core';
import {NavController, IonicPage,LoadingController} from 'ionic-angular';
import {CategoryService} from './category.service';


@IonicPage()
@Component({
    selector: 'page-category',
    templateUrl: 'category.html',
    providers: [CategoryService]
})
export class CategoryPage {
    categories: any[] = [];

    constructor(public navCtrl: NavController,
                private loadingCtrl:LoadingController,
                public categoryService:CategoryService) {

     }

    ionViewDidLoad(){
        let loader=this.loadingCtrl.create({
            content:'please wait'
        })
        loader.present();
        this.categoryService.getCategories()
        .subscribe(categories=>{
            console.log("res-"+JSON.stringify(categories));
            this.categories=categories;
            loader.dismiss();
        },error=>{
            loader.dismiss();
        })
    }

    navigate(MenuId) {
        this.navCtrl.push("ProductListPage",
            {MenuId: MenuId}
        );
    }

}
