import { FunctionsService } from './../_base/crud/utils/functions.service';
import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import{ Router, CanActivate } from '@angular/router';

@Injectable({
	providedIn: 'root'
  })
export class AuthGuard implements CanActivate{
	constructor(
		private router:Router,
		private authS: AuthenticationService,
		private functions:FunctionsService
	){}
	private isAuthenticated: boolean = false;
	private permissao:any = [];
	async canActivate(snapshot:any){
		// if(!this.functions.isEmpty(snapshot.data) && this.functions.isEmptyObj(snapshot.data)){
		// 	return true;
		// }
		let token = null;
		this.authS.isAuthorized().subscribe((_token) =>{
			token = _token;
		},(erro) => {
			token = null;
		});

		if(token !== null && token !== false){
			if(snapshot.data !== {}){
				await this.checkPermission(snapshot.data.permissions).then(value => {
					this.isAuthenticated = value;
				});
			}
			// this.isAuthenticated = true;
			return this.isAuthenticated;
		}

		this.router.navigate([snapshot.data.permissions.redirectTo]);
		return this.isAuthenticated;
	}

	async checkPermission(data:any){
		await this.authS.getPermissoes().subscribe(value =>{
			this.permissao = value;
		});
		let sistema = this.permissao.find(el => el === "sistema-ver");
		if(this.functions.isEmpty(sistema)){
			this.functions.printSnackBar("Usuário sem permissão de acesso ao sistema.");
			this.authS.logout();
			return false;
		}
		if(this.permissao === null){
			this.router.navigate([data.redirectTo]);
			return false;
		}
		for(let i = 0 ; i < this.permissao.length; i++){
			if(typeof data.only === 'string'){
				if(this.permissao[i] === data.only){
					return true;
				}
			}else{
				for(let y = 0; y < data.only.length; y++){
					if(this.permissao[i] === data.only[y]){
						return true;
					}
				}
			}
		}
		this.router.navigate([data.redirectTo]);
		return false;

	}
}
