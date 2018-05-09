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
import { BookTableService } from './table-booking.service';
var TableBookingPage = /** @class */ (function () {
    function TableBookingPage(navCtrl, navParams, bookTableService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.bookTableService = bookTableService;
        this.bookingInfo = {
            //tableNumber:'',
            time: '',
            date: '',
            person: '',
            status: 'pending',
        };
    }
    TableBookingPage.prototype.onClickBookTable = function () {
        //console.log("data-"+JSON.stringify(this.bookingInfo));
        this.bookTableService.bookTable(this.bookingInfo)
            .subscribe(function (res) {
            //console.log("response-"+JSON.stringify(res));
        });
    };
    TableBookingPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-table-booking',
            templateUrl: 'table-booking.html',
            providers: [BookTableService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            BookTableService])
    ], TableBookingPage);
    return TableBookingPage;
}());
export { TableBookingPage };
//# sourceMappingURL=table-booking.js.map