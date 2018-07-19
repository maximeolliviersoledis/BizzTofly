import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {Md5} from 'ts-md5/dist/md5';
import CryptoJS from 'crypto-js';
import Base64Url from 'base64url';

@Injectable()
export class JWT{
	constructor(){}

	encode(payload : any, algo = 'HS256', header = null): string{
				if(!header){
					header = {
						typ: 'JWT',
						alg: algo
					}
				}

				var encoded_header = Base64Url.encode(JSON.stringify(header));
        		var encoded_payload = Base64Url.encode(JSON.stringify(payload));
        		var sign = Base64Url.encode(CryptoJS.HmacSHA256(encoded_header+"."+encoded_payload, "mysecretkey").toString());

        		return encoded_header + "." + encoded_payload + "." + sign;
	}

	decode(){

	}
}