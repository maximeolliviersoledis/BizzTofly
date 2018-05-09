import {Component} from '@angular/core';
import {NavController,NavParams, IonicPage,LoadingController} from 'ionic-angular';
import {CategoryService} from './category.service';


@IonicPage()
@Component({
    selector: 'page-category',
    templateUrl: 'category.html',
    providers: [CategoryService]
})
export class CategoryPage {
    categories: any[] = [];
    level: number = 2;
    lastCategoryId: number = 0;
    constructor(public navCtrl: NavController,
                private loadingCtrl:LoadingController,
                public categoryService:CategoryService,
                public nav:NavParams) {

     }

    ionViewDidLoad(){
        let loader=this.loadingCtrl.create({
            content:'please wait'
        })
        loader.present();

        this.categoryService.getCategory(2).subscribe(categories => {
             this.lastCategoryId = categories.category.id;
             console.log(this.lastCategoryId);
             var subCategories = categories.category.associations;
             if(subCategories && subCategories.categories){
                 for(var sub of subCategories.categories){
                     this.categoryService.getCategory(sub.id).subscribe(category => {
                         if(category.category.level_depth>=2 && category.category.active == 1){
                            var categ: any = {};
                            categ.id = category.category.id;
                            categ.id_parent = category.category.id_parent;
                            categ.name = category.category.name[0].value;
                            categ.description = category.category.description[0].value;
                            categ.level = category.category.level_depth;
                            if(category.category.associations && category.category.associations.categories)
                                categ.id_enfants = category.category.associations.categories;

                            this.categories.push(categ);
                        }
                     })
                 }
             }
             loader.dismiss();
        })

        /*this.categoryService.getAllCategories().subscribe(categories => {

            for(var id of categories.categories){
                this.categoryService.getCategory(id.id).subscribe(category => {
                    if(category.category.level_depth>=2 && category.category.active == 1){
                        var categ: any = {};
                        categ.id = category.category.id;
                        categ.id_parent = category.category.id_parent;
                        categ.name = category.category.name[0].value;
                        categ.description = category.category.description[0].value;
                        categ.level = category.category.level_depth;
                        if(category.category.associations && category.category.associations.categories)
                            categ.id_enfants = category.category.associations.categories;

                        this.categories.push(categ);
                    }
                    console.log(this.categories);
                });
            }
            loader.dismiss();
        })*/
        /*this.categoryService.getCategories()
        .subscribe(categories=>{
            console.log("res-"+JSON.stringify(categories));
            this.categories=categories;
            loader.dismiss();
        },error=>{
            loader.dismiss();
        })*/
    }

    getSubCategories(categoryId){
        var index = this.categories.findIndex(function(elem){
            return elem.id == categoryId;
        })
        console.log(this.categories[index].id_enfants.length);
        for(var child of this.categories[index].id_enfants){
            var childAlreadyPresent = this.categories.find(function(elem){
                return elem.id == child.id;
            })

            if(!childAlreadyPresent){
                this.categoryService.getCategory(child.id).subscribe(category => {
                    console.log(category);
                    var categ: any = {};
                    categ.id = category.category.id;
                    this.categoryService.getImageForCategory(categ.id).subscribe(image => {
                        //console.log(image);
                        categ.image = image;
                    })
                    categ.id_parent = category.category.id_parent;
                    categ.name = category.category.name[0].value;
                    categ.description = category.category.description[0].value;
                    categ.level = category.category.level_depth;

                    if(category.category.associations && category.category.associations.categories)
                        categ.id_enfants = category.category.associations.categories;

                    this.categories.push(categ);
                })
            }
        }
    }


    goBack(){
        console.log(this.categories);
        if(this.level>2){
            console.log("lastCategory avant  = "+this.lastCategoryId);
            var id = this.lastCategoryId;
            var index = this.categories.findIndex(function(elem){
                return elem.id == id;
            })
            this.lastCategoryId = this.categories[index].id_parent;
            console.log("lastCategory = "+this.lastCategoryId);
            this.level--;
        }
    }

    navigate(category) {
        if(category.id_enfants){
            this.lastCategoryId = category.id;
            this.getSubCategories(category.id);
            this.level++;
        }else{
            this.navCtrl.push("ProductListPage",
            {
                MenuId: category.id,
            });
        }
    }

}
