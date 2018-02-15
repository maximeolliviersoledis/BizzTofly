import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";

@Injectable()

export class CategoryService {
    constructor(public http: Http, public constService: ConstService) {

    }

    getCategories() {
        const headers = new Headers();
        return this.http.get(this.constService.base_url + 'api/categories', {
            headers: headers
        })

            .map((data: Response) => data.json())
    }


}
