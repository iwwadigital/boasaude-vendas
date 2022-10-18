import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from './../../../../api';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class HttpService{
	private url:string;
	constructor(
		private http:HttpClient
	){}

	public get(url:string, params?:any):Observable<any>{
		this.url = `${API_URL}/${url}`;
		return this.http.get<any>(this.url,{params: params});
	}
	public show(url:string,id, params?:any):Observable<any>{
		
		this.url = `${API_URL}/${url}/${id}`;
		return this.http.get<any>(this.url,{params: params});
	}

	public post(url:string, body: any,params?:any):Observable<any>{
		this.url = `${API_URL}/${url}`;
		return this.http.post<any>(this.url,body,{params: params});
	}

	public put(url:string, body: any,params?:any):Observable<any>{
		this.url = `${API_URL}/${url}/${body.id}`;
		return this.http.put<any>(this.url,body,{params: params});
	}

	public delete(url:string,id,params?:any):Observable<any>{
		this.url = `${API_URL}/${url}/${id}`;
		return this.http.delete<any>(this.url,{params: params});
	}

	public getDownload(url:string, params?:any):Observable<any>{
		this.url = `${API_URL}/${url}`;
		return this.http.get(this.url,{params: params,responseType: 'blob'});
	}

	public getUrl(url:string,params?:any){
		return this.http.get<any>(url,{params: params});
	}

}
