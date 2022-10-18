// Angular
import { Component, Input, OnInit } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
import { currentUser, Logout, User } from '../../../../../core/auth';
import { AuthenticationService } from './../../../../../core/auth_new/authentication.service';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';

@Component({
	selector: 'kt-user-profile3',
	templateUrl: './user-profile3.component.html',
})
export class UserProfile3Component implements OnInit {
	// Public properties
	user$: Observable<User>;
	nome:string = "";

	@Input() avatar = true;
	@Input() greeting = true;
	@Input() badge: boolean;
	@Input() icon: boolean;

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
	constructor(
		private store: Store<AppState>,
		private auth:AuthenticationService,
		public functions:FunctionsService
	) {}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		// this.user$ = this.store.pipe(select(currentUser));
		this.user$ = this.auth.getUserStorage();
		let user = this.functions.getUsuario();
		this.nome = user.nome.split(" ")[0];
	}

	/**
	 * Log out
	 */
	logout() {
		// this.store.dispatch(new Logout());
		this.auth.logout(true);
	}
}
