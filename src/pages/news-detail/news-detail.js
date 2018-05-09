var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, LoadingController } from 'ionic-angular';
import { NewsDetailsService } from './news-detail.service';
var NewsDetailPage = /** @class */ (function () {
    function NewsDetailPage(navCtrl, navParams, loadingCtrl, newsService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.newsService = newsService;
        this.newsDetails = {};
        this.newsId = this.navParams.get('newsId');
    }
    NewsDetailPage.prototype.ngOnInit = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: 'please wait..'
        });
        loader.present();
        this.newsService.getNewsDetails(this.newsId)
            .subscribe(function (response) {
            _this.newsDetails = response;
            loader.dismiss();
            console.log("details-" + JSON.stringify(response));
        }, function (error) {
            loader.dismiss();
        });
    };
    NewsDetailPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-news-detail',
            templateUrl: 'news-detail.html',
            providers: [NewsDetailsService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LoadingController,
            NewsDetailsService])
    ], NewsDetailPage);
    return NewsDetailPage;
}());
export { NewsDetailPage };
//# sourceMappingURL=news-detail.js.map