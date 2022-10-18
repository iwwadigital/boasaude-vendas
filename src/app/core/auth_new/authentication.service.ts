import { FunctionsService } from './../_base/crud/utils/functions.service';
import { UtilsService } from './../_base/layout/services/utils.service';
import { Usuario } from './../_base/crud/models/class/usuario.model';
import { MatSnackBar } from '@angular/material';
import { API_URL } from './../../api';
import { BehaviorSubject, Observable, Subject, from, throwError } from 'rxjs';
import { map, catchError, tap, switchMap,retry } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders,HttpRequest } from '@angular/common/http';
import { AuthService } from 'ngx-auth';

import { TokenStorage } from './token-storage.service';


import { AccessData } from './access-data';
import { Credential } from './credential';
import * as jwt_decode from 'jwt-decode';





@Injectable()
export class AuthenticationService implements AuthService {
	API_ENDPOINT_LOGIN = '/auth/login';
	API_ENDPOINT_REFRESH = '/auth/refresh';
	API_ENDPOINT_REGISTER = '/usuario';
	API_ENDPOINT_REQUEST_PASSWORD = '/senha';

	public onCredentialUpdated$: Subject<AccessData>;

	constructor(
		private http: HttpClient,
		private tokenStorage: TokenStorage,
		private util: UtilsService,
		private snackBar:MatSnackBar,
		private functionsS:FunctionsService
	) {
		this.onCredentialUpdated$ = new Subject();
	}

	public isAuthorized(): Observable<boolean> {
		return this.tokenStorage.getAccessToken().pipe(map(token => !!token));
	}

	public getAccessToken(): Observable<string> {
		return this.tokenStorage.getAccessToken();
	}
	public getExpire(){
		return this.tokenStorage.getExpire();
	}
	public getTokenType(){
		return this.tokenStorage.getTokenType();
	}

	public getUserRoles(): Observable<any> {
		return this.tokenStorage.getUserRoles();
	}
	public getUserStorage(): Observable<any> {
		return this.tokenStorage.getUsuario();
	}
	public getPermissoes(): Observable<any> {
		return this.tokenStorage.getPermissoes();
	}

	public refreshToken(): Observable<AccessData> {
		let token = '';
		this.getAccessToken().subscribe(resp =>{token = resp});
		let headers = new HttpHeaders(
			{
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		);
		return this.tokenStorage.getRefreshToken().pipe(
			switchMap((refreshToken: string) => {
				//return this.http.get<AccessData>(API_URL + this.API_ENDPOINT_REFRESH + '?' + this.util.urlParam(refreshToken));
				return this.http.get<AccessData>(API_URL + this.API_ENDPOINT_REFRESH ,{headers:headers});
			}),
			// tap(this.saveAccessData.bind(this)),
			tap((token: AccessData) => this.saveAccessData(token)),
			catchError(err => {
				this.functionsS.printSnackBar('Sessão expirada, Por favor faça login novamente.');
				setTimeout(() => {
					this.logout(true);
				}, 1500);

				return throwError(err);
			})
		);
	}

	public refreshShouldHappen(response: HttpErrorResponse): boolean {

		return response.status === 401;
	}

	public verifyTokenRequest(url: string): boolean {
		return url.endsWith(this.API_ENDPOINT_REFRESH);
	}

	public login(usuario: Usuario): Observable<any> {
		return this.http.post<AccessData>(API_URL + this.API_ENDPOINT_LOGIN,usuario)
	}

	private handleError<T>(operation = 'operation', result?: any) {
		return (error: any): Observable<any> => {
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

			// Let the app keep running by returning an empty result.
			return from(result);
		};
	}

	/**
	 * Logout
	 */
	public logout(refresh?: boolean): void {
		this.tokenStorage.clear();
		if (refresh) {
			location.reload(true);
		}
	}

	public saveAccessData(accessData: AccessData) {
		if (typeof accessData !== 'undefined') {
			this.tokenStorage
				.setAccessToken(accessData.access_token)
				.setRefreshToken(accessData.access_token)
				.setPermissoes(accessData.permissoes)
				.setUserRoles(['TESTE'])
				.setExpire(accessData.expires_in)
				.setTokenType(accessData.token_type)
				.setUsuario(accessData.usuario)
			this.onCredentialUpdated$.next(accessData);
		}
	}

	public register(credential: Credential): Observable<any> {
		// dummy token creation
		credential = Object.assign({}, credential, {
			accessToken: 'access-token-' + Math.random(),
			refreshToken: 'access-token-' + Math.random(),
			roles: ['USER'],
		});
		return this.http.post(API_URL + this.API_ENDPOINT_REGISTER, credential)
			.pipe(catchError(this.handleError('register', []))
		);
	}

	public requestPassword(usuario:Usuario): Observable<any> {
		return this.http.post(API_URL + this.API_ENDPOINT_REQUEST_PASSWORD,usuario)
			// .pipe(catchError(this.handleError('forgot-password', [])));
	}

	public getUserData(credential: Credential){
		return this.http.get<any>(API_URL + this.API_ENDPOINT_LOGIN + '?' + this.util.urlParam(credential))
	}

	public isTokenExpired(token?:string){
		if(!token) this.getAccessToken().subscribe(resp => token = resp);
		if(!token) return true;
		let date = this.getTokenExpirationDate(token);
		if(date === undefined) return false;
		return !(date.valueOf() > new Date().valueOf())

	}
	public getTokenExpirationDate(token:string){
		const decoded = jwt_decode(token);
		if(decoded.exp === undefined) return null;
		const date = new Date(0);
		date.setUTCSeconds(decoded.exp);
		return date;
	}

	// public getHeaders(token:string){
	// 	let _request = new HttpRequest(<any>);
	// 	console.log(token);
	// 	return {}
	// }
}
