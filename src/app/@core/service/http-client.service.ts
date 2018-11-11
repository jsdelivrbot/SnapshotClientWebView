import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class HttpClientService {

  constructor(
    private http: HttpClient
  ) {
  }

  send(api: string, query: HttpParams = null): Observable<any> {
    let url = environment.server;
    return this.http.get<SnapshotApiResponse>(url + api, {
      params: query
    }).pipe(
      map(response => response.value)
    );
  }
}

export interface SnapshotApiResponse {
  value: any;
}