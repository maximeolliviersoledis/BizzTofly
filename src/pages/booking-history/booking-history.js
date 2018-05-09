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
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { BookingHistoryService } from './booking-history.service';
import { UserService } from '../../providers/user-service';
var BookingHistoryPage = /** @class */ (function () {
    function BookingHistoryPage(navCtrl, navParams, loadingCtrl, userService, bookingHistoryService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.userService = userService;
        this.bookingHistoryService = bookingHistoryService;
    }
    BookingHistoryPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        console.log('ionViewDidLoad BookingHistoryPage');
        var loader = this.loadingCtrl.create({
            content: 'please wait'
        });
        loader.present();
        this.userService.getUser().subscribe(function (user) {
            _this.bookingHistoryService.getBookingHistory(user._id)
                .subscribe(function (res) {
                console.log("history-" + JSON.stringify(res));
                _this.bookings = res;
                loader.dismiss();
            });
        });
    };
    BookingHistoryPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-booking-history',
            templateUrl: 'booking-history.html',
            providers: [BookingHistoryService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LoadingController,
            UserService,
            BookingHistoryService])
    ], BookingHistoryPage);
    return BookingHistoryPage;
}());
export { BookingHistoryPage };
//# sourceMappingURL=booking-history.js.map