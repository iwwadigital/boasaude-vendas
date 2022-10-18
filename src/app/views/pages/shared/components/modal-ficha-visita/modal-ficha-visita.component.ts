import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit ,Inject, ChangeDetectorRef, Output , EventEmitter, OnDestroy, Input} from "@angular/core";
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { Subscription } from 'rxjs';
import { FichaVisita } from './../../../../../core/_base/crud/models/class/ficha_visita.model';

@Component({
	selector: 'kt-modal-ficha-visita',
	styleUrls: ['./modal-ficha-visita.component.scss'],
	templateUrl: './modal-ficha-visita.component.html',
})
export class ModalFichaVisitaComponent implements OnInit,OnDestroy{
	@Output() response = new EventEmitter();
	public proposta_id:number;
    public subs:Subscription = new Subscription();
    public proposta_form:any;
	public is_form:boolean = false;
	public is_create:boolean = true;
	public ficha_visitas:FichaVisita[];

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef:MatDialogRef<ModalFichaVisitaComponent>,
		private cdr:ChangeDetectorRef,
		public functions:FunctionsService,
		public _http:HttpService,
    ){}
    
    ngOnInit(){
		this.proposta_form = this.data.proposta_form;
		this.proposta_id = this.data.proposta_form.id;
		this.is_form = this.data.is_create;
		this.ficha_visitas = this.data.ficha_visitas;
    }
    

	public outputFichaVisita(response){
		this.response.emit({show:true});
        this.dialogRef.close(true);
	}

	public deleteFicha(id){
		this.subs.add(
			this._http.delete("ficha-visita",id).subscribe((resp:any) =>{
				if(resp.success){
					this.functions.printSnackBar(resp.message);
					let index_ficha:any = this.ficha_visitas.filter((el,index) => {
						if(el.id == id){
							return el;
						}
					});
					this.ficha_visitas.splice(index_ficha.id,1);
				}
			},(e)=>{
				this.functions.printMsgError(e);
			})
		);
	}

	public addFicha(){
		this.proposta_form = this.data.proposta_form;
		this.is_create = true;
		this.is_form = true;
		this.cdr.detectChanges();
	}

	public editFicha(item){
		this.proposta_form = item;
		this.is_create = false;
		this.is_form = true;
	}

	public back(item){
		this.is_form = false;
	}

	onNoClick(){
		this.dialogRef.close(true);
	}

	ngOnDestroy(){
		this.subs.unsubscribe();
	}
}
