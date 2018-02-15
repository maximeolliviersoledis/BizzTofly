import {Injectable, NgZone} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import {ConstService} from './const-service';
import {UserService} from './user-service';

@Injectable()
export class SocketService {
    socket: any;
    zone: any;
    clientInfo = {
        userId: ''
    };

    constructor(public constService: ConstService,
                public userService: UserService) {
    }

    establishConnection() {

        this.socket = io(this.constService.base_url);
        this.zone = new NgZone({enableLongStackTrace: false});
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
            .subscribe((Response) => {
                this.clientInfo.userId = Response._id;
                this.socket.emit('restaurantInfo', this.clientInfo);
            }, error => {
                console.error(error);
                localStorage.removeItem('token');
            })

    }

    emitMessage(messageBody) {
        this.socket.emit('user_message', {
            message: messageBody.message,
            user_id: messageBody.sellerId
        });
    }

    getLastMessage() {
        let observable = new Observable(observer => {
            this.socket.on('message' + this.clientInfo.userId, (data) => {
                observer.next(data);
            });
        })
        return observable;
    }


}
