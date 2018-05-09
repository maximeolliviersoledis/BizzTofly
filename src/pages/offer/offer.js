var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, IonicPage, LoadingController } from 'ionic-angular';
import { OfferService } from './offer.service';
var OfferPage = /** @class */ (function () {
    function OfferPage(navCtrl, navParams, loadingCtrl, offerItemsService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.offerItemsService = offerItemsService;
        this.offerProducts = [];
    }
    OfferPage.prototype.ngOnInit = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: 'please wait..'
        });
        loader.present();
        this.offerItemsService.getMenuItems()
            .subscribe(function (menuItems) {
            console.log("items-" + JSON.stringify(menuItems));
            _this.offerProducts = menuItems;
            loader.dismiss();
        }, function (error) {
            loader.dismiss();
        });
    };
    OfferPage.prototype.gotoNextSlide = function () {
        this.slides.slideNext();
    };
    OfferPage.prototype.gotoPrevSlide = function () {
        this.slides.slidePrev();
    };
    OfferPage.prototype.buyNow = function (productId) {
        this.navCtrl.push("ProductDetailsPage", {
            productId: productId
        });
    };
    __decorate([
        ViewChild(Slides),
        __metadata("design:type", Slides)
    ], OfferPage.prototype, "slides", void 0);
    OfferPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-offer',
            templateUrl: 'offer.html',
            providers: [OfferService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LoadingController,
            OfferService])
    ], OfferPage);
    return OfferPage;
}());
export { OfferPage };
//# sourceMappingURL=offer.js.map