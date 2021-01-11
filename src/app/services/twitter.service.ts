import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilidadesService } from './utilidades.service';
import {  } from "twit";
const base_url = environment.base_url;
const header = environment.header;

@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  constructor(private http: HttpClient, private util: UtilidadesService) { }

  getQuery(query: string) {
    console.log(base_url);
    const url = `${query}`;

    const headers = new HttpHeaders({
      'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAHDpLQEAAAAABnoRTGK2TEULn52OqxsoPHb%2FcFg%3DHS1g0NzFUVUQS3mQGsZ1kWqtKFTonV0CfSGCAsFpSHuFUidyQl'
    });
    return this.http.get(url, { headers });
  }

  serchTweets(text: string) {
     console.log(this.util.nonceGenerator(43));
     console.log(this.util.timenstampGenerator());
    //  this.util.signatureGenerator();
    return this.getQuery(`search/tweets.json?q=${text}&count=30`);
  }
  serchTimeline() {
    return this.getQuery(`statuses/home_timeline.json?count=30`);
  }
  retweetPost(twettID: string) {
    let params = JSON.stringify({ 'id': twettID });
    const headers = new HttpHeaders({
     'Authorization': `OAuth oauth_consumer_key="${environment.header.consumer_key}", oauth_nonce="${this.util.nonceGenerator(44)}", oauth_signature="1AW83N0aD0W7yFPn2VX0+6xmpBE=", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${this.util.timenstampGenerator()}", oauth_token="${environment.header.access_token}", oauth_version="1.0"`,
     'content-type': 'application/json'
    });
    return this.http.post(`/statuses/retweet/${twettID}.json`, params, { headers: headers });
  }
  favoritePost(twettID: string) {
    console.log(header.consumer_key);
    let params = { 
      'id': twettID,
      'tweet_mode': 'extended'
      };

    const headers = new HttpHeaders({
      'Authorization': `OAuth oauth_consumer_key="${environment.header.consumer_key}", oauth_nonce="${this.util.nonceGenerator(44)}", oauth_signature="1AW83N0aD0W7yFPn2VX0+6xmpBE=", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${this.util.timenstampGenerator()}", oauth_token="${environment.header.access_token}", oauth_version="1.0"`,
      'content-type': 'application/json',
      'x-twitter-client-language': 'es'
     });

    return this.http.post(`/favorites/create.json`, this.util.ObjecttoParams(params), { headers: headers });

  }


}
