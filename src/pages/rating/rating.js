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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RatingService } from './rating.service';
var RatingPage = /** @class */ (function () {
    function RatingPage(navCtrl, navParams, ratingService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.ratingService = ratingService;
        this.review = {
            menuItem: '',
            order: '',
            rating: '',
            comment: ''
        };
        this.reviews = [];
        this.review.menuItem = this.navParams.get('itemId');
        this.review.order = this.navParams.get('orderId');
        var review = this.navParams.get('review');
        this.review.rating = review.rating;
        this.review.comment = review.comment;
    }
    RatingPage.prototype.onSubmit = function () {
        var _this = this;
        console.log('review obj' + JSON.stringify(this.review));
        this.ratingService.submitReview(this.review)
            .subscribe(function (review) {
            console.log("review-" + JSON.stringify(review));
            _this.review.comment = '';
            _this.navCtrl.push("OrderDetailsPage", {
                orderId: _this.review.order
            });
        });
    };
    RatingPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-rating',
            templateUrl: 'rating.html',
            providers: [RatingService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            RatingService])
    ], RatingPage);
    return RatingPage;
}());
export { RatingPage };
//# sourceMappingURL=rating.js.map