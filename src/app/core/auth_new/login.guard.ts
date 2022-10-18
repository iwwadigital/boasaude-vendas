import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import{ Router, CanActivate } from '@angular/router';

@Injectable({
	providedIn: 'root'
  })
export class LoginGuard implements CanActivate{
	constructor(
		private router:Router,
		private authS: AuthenticationService,
	){}
	private isAuthenticated: boolean = false;

	async canActivate(snapshot:any){
		if(!this.authS.isTokenExpired()){
			this.router.navigate([snapshot.data.permissions.redirectTo]);
			return false;
		}

		return true;


	}
}
