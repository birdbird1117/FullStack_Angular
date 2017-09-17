import { Injectable } from '@angular/core';
import { Feedback } from '../shared/Feedback';

import { Observable } from 'rxjs/Observable';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import 'rxjs/add/observable/of';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class FeedbackService {



  constructor(private restangular: Restangular, 
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  submitFeedback(feedback:Feedback): Observable<Feedback> {
    return this.restangular.all('feedback').post(feedback);
  }

}
