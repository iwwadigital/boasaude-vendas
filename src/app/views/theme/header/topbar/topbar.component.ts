// Angular
import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './../../../../core/auth_new/authentication.service';
import { FunctionsService } from './../../../../core/_base/crud/utils/functions.service';

@Component({
	selector: 'kt-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnDestroy{
	private subs:Subscription = new Subscription();
	private is_value_change = false;
	is_desktop:boolean = false;
	public filiais:any[] = [];
	public form:FormGroup = new FormGroup({
		filial : new FormControl(null)
	});

	constructor(
		public functions:FunctionsService,
		private cdr:ChangeDetectorRef,
		private auth:AuthenticationService,
	){
		this.is_desktop = window.innerWidth > 1024;
		window.onresize = () => {
			this.is_desktop = window.innerWidth > 1024
			if(window.innerWidth > 1024){
				this.cdr.detectChanges();
			}
		};

		let usuario = this.functions.getUsuario();
		if(usuario && usuario.usuario_filial && usuario.usuario_filial.length > 0){
			this.filiais = usuario.usuario_filial.map(el => el.filial);
			let filial = localStorage.getItem("filial");
			let filialObj = localStorage.getItem("filialObj");
			if(this.filiais.length > 0){
				if(!filial){
					this.form.patchValue({
						"filial" : this.filiais[0]
					});
					
					localStorage.setItem("filial",this.filiais[0].nome);
					localStorage.setItem("filialObj",JSON.stringify(this.filiais[0]));
				}else{
					filialObj = JSON.parse(filialObj);
					this.form.patchValue({
						"filial" : filialObj
					});
				}
			}
		}else{
			this.functions.printSnackBar("Usuário sem uma filial.");
			this.auth.logout(true);
		}

		this.subs.add(
			this.form.get('filial').valueChanges.subscribe((value)=>{
				localStorage.setItem("filial",value.nome);
				localStorage.setItem("filialObj",JSON.stringify(value));
				this.functions.setFilial(value.nome);
				this.functions.setLogo(value.logo)
			})
		);
		this.subs.add(
			this.functions.$filialModal.subscribe((value:any) =>{
				this.form.patchValue({
					"filial" : value
				});
			})
		);
		// this.subs.add(
		// 	this.functions.$filial.subscribe((value:any) =>{
		// 		if(!this.is_value_change && typeof value == "string"){
		// 			this.form.patchValue({
		// 				"filial" : value
		// 			});
		// 		}else{
		// 			this.is_value_change  = true;
		// 		}
		// 	})	
		// );
		
	}
	public objectComparisonFunction = function( option, value ) : boolean {
		return option.id === value.id;
	}

	ngOnDestroy(){
		this.subs.unsubscribe();
	}
 }
