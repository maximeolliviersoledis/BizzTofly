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
import { Service } from '../../app/service';
import { OrderDetailsService } from './order-details.service';
var OrderDetailsPage = /** @class */ (function () {
    function OrderDetailsPage(navCtrl, navParams, loadingCtrl, service, orderDetailsService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.service = service;
        this.orderDetailsService = orderDetailsService;
        this.orderDetails = {};
        this.review = {};
    }
    OrderDetailsPage.prototype.ngOnInit = function () {
        this.loader = this.loadingCtrl.create({
            content: 'please wait'
        });
        this.loader.present();
        /*this.orderDetailsService.getOrderDetails(this.orderId)
            .subscribe(order => {
                this.orderDetails = order;
                this.loader.dismiss();
                console.log("order-details-"+JSON.stringify(this.orderDetails));
               // this.getReviews();
            },error=>{
                 this.loader.dismiss();
            })*/
        this.orderDetails = this.navParams.get('order');
        this.orderId = this.orderDetails.order.id;
        for (var _i = 0, _a = this.orderDetails.order.associations.order_rows; _i < _a.length; _i++) {
            var i = _a[_i];
            i.image = this.orderDetailsService.getImageUrlForProduct(i.product_id);
        }
        console.log(this.orderDetails);
        console.log(this.orderDetails.order.associations);
        this.loader.dismiss();
    };
    OrderDetailsPage.prototype.getReviews = function () {
        var _this = this;
        this.orderDetailsService.getRating(this.orderId)
            .subscribe(function (review) {
            console.log("review-" + JSON.stringify(review));
            _this.review = review;
            _this.loader.dismiss();
            // this.getRatings();
        });
    };
    OrderDetailsPage.prototype.getRatings = function () {
        for (var i = 0; i < this.orderDetails.cart.length; i++) {
            for (var j = 0; j < this.review.length; j++) {
                if (this.orderDetails.cart[i].productId == this.review[j].menuItem) {
                    this.orderDetails.cart[i].rating = this.review[j].rating;
                    this.orderDetails.cart[i].ratingFlag = 1;
                    this.orderDetails.cart[i].comment = this.review[j].comment;
                }
            }
        }
    };
    OrderDetailsPage.prototype.rate = function (itemId) {
        console.log("id---" + itemId);
        this.navCtrl.push("RatingPage", {
            itemId: itemId,
            orderId: this.orderId,
            review: this.review
        });
    };
    OrderDetailsPage.prototype.trackOrder = function () {
        this.navCtrl.push("OrderStatusPage", { orderId: this.orderId });
    };
    OrderDetailsPage.prototype.buyAgain = function (productId) {
        this.navCtrl.push("ProductDetailsPage", {
            productId: productId
        });
    };
    OrderDetailsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-order-details',
            templateUrl: 'order-details.html',
            providers: [OrderDetailsService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LoadingController,
            Service,
            OrderDetailsService])
    ], OrderDetailsPage);
    return OrderDetailsPage;
}());
export { OrderDetailsPage };
//# sourceMappingURL=order-details.js.map