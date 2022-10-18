import { Comprovante } from './../../../../../core/_base/crud/models/class/comprovante.model';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';
import { OnInit, Component, Input, ElementRef,AfterViewInit, ViewChild  } from '@angular/core';
import { fromEvent } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ModalMessageComponent } from '../modal-message/modal-message.component';
import { Router } from '@angular/router';

@Component({
	selector: 'kt-create-assinatura',
	templateUrl: './create-assinatura.component.html',
	styleUrls: ['./create-assinatura.component.scss']
})
export class CreateAssinaturaComponent implements OnInit {
	// a reference to the canvas element from our template
	@Input() public set setProposta_id(id){
		if(!this.functions.isEmpty(id)){
			this.proposta_id = id;
		}
	}

	public image_get:boolean = false;
	@Input() is_create:boolean = false;
	public image:any;

	public proposta_id:number = 57;
	constructor(
		private router:Router,
		private _http:HttpService,
		private dialog:MatDialog,
		private functions:FunctionsService
	){}
	ngOnInit(){}

	public create(){
		this.image_get = true;
	}

	public setImage(image){
		let comprovante = new FormData();
		let modal_config:MatDialogConfig = new MatDialogConfig();
		modal_config.data = {
			tipo : "sing"
		};
		modal_config.panelClass = 'modal-proposta-criada';
		comprovante.append("proposta_id",String(this.proposta_id));
		comprovante.append("media",image);
		this._http.post("comprovante",comprovante).subscribe((response:any) => {
			modal_config.data.response = response;
			this.dialog.open(ModalMessageComponent,modal_config);
			this.router.navigate(['/']);
		},(erro:any) => {
			modal_config.data.response = erro.error;
			this.dialog.open(ModalMessageComponent,modal_config);
		})
	}
}
