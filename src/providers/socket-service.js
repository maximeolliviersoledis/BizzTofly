var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NgZone } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { ConstService } from './const-service';
import { UserService } from './user-service';
var SocketService = /** @class */ (function () {
    function SocketService(constService, userService) {
        this.constService = constService;
        this.userService = userService;
        this.clientInfo = {
            userId: ''
        };
    }
    SocketService.prototype.establishConnection = function () {
        var _this = this;
        this.socket = io(this.constService.base_url);
        this.zone = new NgZone({ enableLongStackTrace: false });
        this.socket.on('connect', function () {
            console.log('connected');
        });
        this.socket.on('disconnect', function () {
            console.log('disconnected');
        });
        this.socket.on('error', function (e) {
            console.log('System', e ? e : 'A unknown error occurred');
        });
        this.userService.getUser()
            .subscribe(function (Response) {
            _this.clientInfo.userId = Response._id;
            _this.socket.emit('restaurantInfo', _this.clientInfo);
        }, function (error) {
            console.error(error);
            localStorage.removeItem('token');
        });
    };
    SocketService.prototype.emitMessage = function (messageBody) {
        this.socket.emit('user_message', {
            message: messageBody.message,
            user_id: messageBody.sellerId
        });
    };
    SocketService.prototype.getLastMessage = function () {
        var _this = this;
        var observable = new Observable(function (observer) {
            _this.socket.on('message' + _this.clientInfo.userId, function (data) {
                observer.next(data);
            });
        });
        return observable;
    };
    SocketService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [ConstService,
            UserService])
    ], SocketService);
    return SocketService;
}());
export { SocketService };
//# sourceMappingURL=socket-service.js.map