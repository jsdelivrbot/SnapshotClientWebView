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

  action(api: string, body: string = null, query: HttpParams = null): Observable<any> {
    let url = environment.server;
    return this.http.put<SnapshotApiResponse>(url + api, body, {
      params: query
    }).pipe(
      map(response => response.value)
    );
  }

  create(api: string, body: string = null, query: HttpParams = null): Observable<any> {
    let url = environment.server;
    return this.http.post<SnapshotApiResponse>(url + api, body, {
      params: query
    }).pipe(
      map(response => response.value)
    );
  }

  update(api: string, body: string = null, query: HttpParams = null): Observable<any> {
    let url = environment.server;
    return this.http.patch<SnapshotApiResponse>(url + api, body, {
      params: query
    }).pipe(
      map(response => response.value)
    );
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
