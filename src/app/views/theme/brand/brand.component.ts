// Angular
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FunctionsService } from '../../../core/_base/crud/utils/functions.service';
// Layout
import { LayoutConfigService } from '../../../core/_base/layout';
import { HtmlClassService } from '../html-class.service';

@Component({
	selector: 'kt-brand',
	templateUrl: './brand.component.html',
	styleUrls: ['brand.component.scss']
})
export class BrandComponent implements OnInit, AfterViewInit {
	// Public properties
	headerLogo: string;
	headerStickyLogo: string;
	menuHeaderDisplay: boolean;

	constructor(private layoutConfigService: LayoutConfigService, public htmlClassService: HtmlClassService,private functions:FunctionsService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		// let logoStorage = localStorage.getItem("logo");
		// if(!logoStorage){
		// 	this.headerLogo = this.layoutConfigService.getLogo();
		// }else{
		// 	this.headerLogo = logoStorage;
		// }
		this.headerLogo = this.layoutConfigService.getLogo();
		this.headerStickyLogo = this.layoutConfigService.getStickyLogo();

		const config = this.layoutConfigService.getConfig();

		// get menu header display option
		// this.menuHeaderDisplay = objectPath.get(config, 'header.menu.self.display');

		// this.functions.$logo.subscribe((logo:any)=>{
		// 	if(!this.functions.isEmpty(logo)){
		// 		this.headerLogo = logo;
		// 	}else{
		// 		this.headerLogo = this.layoutConfigService.getLogo();
		// 	}
		// })
	}

	/**
	 * On after view init
	 */
	ngAfterViewInit(): void {
	}
}
