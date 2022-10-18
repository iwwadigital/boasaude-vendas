import { BtnConfig } from './../../../../../core/_base/crud/models/layout/btn-config.model';
import { Component,OnInit, Input } from "@angular/core";

@Component({
	selector: 'kt-btn-rectangle',
	templateUrl : './btn-rectangle.component.html',
	styleUrls : ['./btn-rectangle.component.scss'],
})
export class BtnRectangleComponent implements OnInit{
	@Input() set setBtnConfig(value:BtnConfig){
		if(value){
			if(value.is_disabled){
				value.class += " disabled" ;
			}
			this.btn_config = value;
		}
	}
	public btn_config:BtnConfig;
	ngOnInit() {}
}
