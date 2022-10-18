// Angular
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FunctionsService } from '../../../../core/_base/crud/utils/functions.service';
// Layout
import { LayoutConfigService, ToggleOptions } from '../../../../core/_base/layout';

@Component({
	selector: 'kt-header-mobile',
	templateUrl: './header-mobile.component.html',
	styleUrls: ['./header-mobile.component.scss']
})
export class HeaderMobileComponent implements OnInit {
	public filiais:any[] = [];
	private is_value_change = false;
	public form:FormGroup = new FormGroup({
		filial : new FormControl(null)
	});
	// Public properties
	headerLogo: string;
	asideDisplay: boolean;
	tablet:boolean = false;

	toggleOptions: ToggleOptions = {
		target: 'body',
		targetState: 'kt-header__topbar--mobile-on',
		togglerState: 'kt-header-mobile__toolbar-topbar-toggler--active'
	};

	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private layoutConfigService: LayoutConfigService,private cdr:ChangeDetectorRef,private functions:FunctionsService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.headerLogo = this.layoutConfigService.getLogo();
		this.asideDisplay = this.layoutConfigService.getConfig('aside.self.display');
		this.tablet = window.innerWidth <= 1024
		window.onresize = () =>{	
			this.tablet = window.innerWidth <= 1024;
			if(window.innerWidth <= 1024){
				this.cdr.detectChanges();
			}
				
		}
		let usuario = this.functions.getUsuario()
		if(usuario){
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
		}
		
		this.functions.$filialModal.subscribe((value:any) =>{
			this.form.patchValue({
				"filial" : value
			});
		})	

		this.form.get('filial').valueChanges.subscribe((value)=>{
			localStorage.setItem("filial",value.nome);
			localStorage.setItem("filialObj",JSON.stringify(value));
			this.functions.setFilial(value);
			this.functions.setLogo(value.logo);
			
		})
		
	}

	public objectComparisonFunction = function( option, value ) : boolean {
		return option.id === value.id;
	}
}
