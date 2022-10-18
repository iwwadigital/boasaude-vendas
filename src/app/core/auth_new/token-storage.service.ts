import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class TokenStorage {
	/**
	 * Get access token
	 * @returns {Observable<string>}
	 */
	public getAccessToken(): Observable<string> {
		const token: string = <string>localStorage.getItem('accessToken');
		return of(token);
	}

	/**
	 * Get refresh token
	 * @returns {Observable<string>}
	 */
	public getRefreshToken(): Observable<string> {
		const token: string = <string>localStorage.getItem('refreshToken');
		return of(token);
	}

	/**
	 * Get user roles in JSON string
	 * @returns {Observable<any>}
	 */
	public getUserRoles(): Observable<any> {
		const roles: any = localStorage.getItem('userRoles');
		try {
			return of(JSON.parse(roles));
		} catch (e) {}
	}
	public getUsuario(): Observable<any> {
		const usuario: any = localStorage.getItem('usuario');
		try {
			return of(JSON.parse(usuario));
		} catch (e) {}
	}
	public getExpire(){
		const expire:any = localStorage.getItem('expires_in');
		return of(expire);
	}
	public getTokenType(){
		const type:any = localStorage.getItem('token_type');
		return of(type);
	}
	public getPermissoes(){
		const permissoes:any = localStorage.getItem('permissoes');
		if(permissoes){
			let permissoesArray = permissoes.split('|');
			permissoesArray.splice(permissoesArray.length -1 ,1)
			return of(permissoesArray);
		}
		return of(permissoes);
	}
	/**
	 * Set access token
	 * @returns {TokenStorage}
	 */
	public setAccessToken(token: string): TokenStorage {
		localStorage.setItem('accessToken', token);

		return this;
	}

	/**
	 * Set refresh token
	 * @returns {TokenStorage}
	 */
	public setRefreshToken(token: string): TokenStorage {
		localStorage.setItem('refreshToken', token);

		return this;
	}

	/**
	 * Set user roles
	 * @param roles
	 * @returns {TokenStorage}
	 */
	public setUserRoles(roles: any): any {
		if (roles != null) {
			localStorage.setItem('userRoles', JSON.stringify(roles));
		}
		return this;
	}
	public setExpire(expire:any){
		if(expire !==null){
			localStorage.setItem('expires_in',expire);
		}
		return this;
	}
	public setTokenType(type:any){
		if(type !==null){
			localStorage.setItem('token_type',type);
		}
		return this;
	}
	public setUsuario(usuario:any){
		if(usuario !==null){
			localStorage.setItem('usuario', JSON.stringify(usuario));
			if(usuario.usuario_filial && usuario.usuario_filial.length > 0){
				localStorage.setItem('logo', usuario.usuario_filial[0].filial.logo);
			}
		}
		return this;
	}

	public setPermissoes(permissoes:any){
		if(permissoes !== undefined && permissoes !== null  && permissoes.length > 0){
			let newString = "";
			for(let i= 0;i < permissoes.length; i++){
				newString += permissoes[i].permissao+"|"
			}
			localStorage.setItem("permissoes",newString);
		}
		return this;
	}

	/**
	 * Remove tokens
	 */
	public clear() {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('userRoles');
		localStorage.removeItem('expires_in');
		localStorage.removeItem('token_type');
		localStorage.removeItem('permissoes');
		localStorage.removeItem('usuario');
		localStorage.removeItem('selectFilial');
		localStorage.removeItem('filial');
	}
}
