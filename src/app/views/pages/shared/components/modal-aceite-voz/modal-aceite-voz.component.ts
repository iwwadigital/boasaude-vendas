import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { AceiteVoz } from './../../../../../core/_base/crud/models/class/aceite_voz.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit ,Inject, ChangeDetectorRef, Output , EventEmitter, OnDestroy} from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { Subscription } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
	selector: 'kt-modal-aceite-voz',
	templateUrl: './modal-aceite-voz.component.html',
	styleUrls: ['./modal-aceite-voz.component.scss']
})
export class ModalAceiteVozComponent implements OnInit,OnDestroy{
	public subs:Subscription = new Subscription();
	public is_done:boolean = false;
	public is_pendencia:boolean = false;
	public is_modal_edit:boolean = true;
	public is_edit:boolean = false;
	public is_edit_second:boolean = false;
	public btn_new_aceite:boolean = false;
	public create_new_aceite:boolean = false;

	public is_block:boolean = false;

	public msg:string = "";
	public status:string = "";
	public proposta_id:number;
	@Output() response = new EventEmitter();
	public aceite_voz:any;
	public form:FormGroup = new FormGroup({
		id : new FormControl(null),
		data_aceite_voz : new FormControl(null,[Validators.required]),
		hora_aceite_voz : new FormControl(null,[Validators.required]),
		telefone :new FormControl(null,[Validators.required,Validators.minLength(8)]),
	})
	public form_new:FormGroup = new FormGroup({
		id : new FormControl(null),
		data_aceite_voz : new FormControl(null,[Validators.required]),
		hora_aceite_voz : new FormControl(null,[Validators.required]),
		telefone :new FormControl(null,[Validators.required,Validators.minLength(8)]),
	})

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef:MatDialogRef<ModalAceiteVozComponent>,
		private _http:HttpService,
		private cdr:ChangeDetectorRef,
		public functions:FunctionsService,
	){}
	ngOnInit(){
		if(!this.functions.isEmpty(this.data)){
			this.setAceite(0)
			this.proposta_id = this.data[0].proposta_id;
			this.aceite_voz = this.data[this.data.length - 1];
			this.is_modal_edit = this.aceite_voz.is_modal_edit;
			if(this.data.length > 1){
				this.setAceite(1);
				this.btn_new_aceite = true;
				this.is_edit_second = false;
			}
		}
	}

	public setAceite(indice){
		let data_aceite_voz = new Date(this.data[indice].data_aceite_voz);
		this.data[indice].hora_aceite_voz = {
			hour : data_aceite_voz.getHours(),
			minute : data_aceite_voz.getMinutes()
		}
		if(indice == 0){
			this.form.patchValue(this.data[indice]);
		}else{
			this.form_new.patchValue(this.data[indice]);
		}
	}

	public update(){
		if(this.form.status != "INVALID"){
			let aceite_voz;
			if(this.is_edit_second){
				aceite_voz = this.getFormNew();
			}else{
				aceite_voz = this.getForm();
			}
			this.is_block = true;
			this.subs.add(
				this._http.put("aceite-voz",aceite_voz).subscribe((response:any) => {
					this.refresh(true);
					this.is_edit = false;
					this.is_edit_second = false;
					this.functions.printSnackBar(response.message);
					this.is_block = false;
					this.cdr.detectChanges();
				},(erro:any) =>{
					this.functions.printMsgError(erro);
					this.is_block = false;
					this.cdr.detectChanges();
				})
			);
		}else{
			this.functions.printSnackBar("Preecha todos os campos.");
		}
	}

	public create(){
		if(this.form_new.status != "INVALID"){
			this.is_block = true;
			let aceite_voz = this.getFormNew();
			this.subs.add(
				this._http.post("aceite-voz",aceite_voz).subscribe((response:any) => {
					this.refresh(true);
					this.is_edit_second = false;
					this.functions.printSnackBar(response.message);
					this.is_block = false;
					this.cdr.detectChanges();
				},(erro:any) =>{
					this.functions.printMsgError(erro);
					this.is_block = false;
					this.cdr.detectChanges();
				})
			);
		}else{
			this.functions.printSnackBar("Preecha todos os campos.");
		}
	}

	public newACeite(){
		this.btn_new_aceite = true;
		this.create_new_aceite = true;
		this.is_edit_second = true;
	}

	public getForm(){
		let aceite_voz = this.form.value;
		let horas = this.form.value.hora_aceite_voz;
		aceite_voz.data_aceite_voz = this.functions.formatData(new Date(this.form.value.data_aceite_voz),"YYYY-mm-dd")+" "+horas.hour+":"+horas.minute;
		return aceite_voz;
	}
	public getFormNew(){
		let aceite_voz = this.form_new.value;
		aceite_voz.proposta_id = this.proposta_id;
		let horas = this.form_new.value.hora_aceite_voz;
		aceite_voz.data_aceite_voz = this.functions.formatData(new Date(this.form_new.value.data_aceite_voz),"YYYY-mm-dd")+" "+horas.hour+":"+horas.minute;
		return aceite_voz;
	}

	public changeStatus(status){
		let aceiteVoz = new AceiteVoz(this.data[this.data.length - 1]);
		aceiteVoz.status = status;
		this.status = status;
		this._http.put("aceite-voz",aceiteVoz).subscribe((response:any) => {
			this.msg = `Aceite de voz foi ${status}.`;
			this.is_done = true;
			this.refresh(true);
			this.cdr.detectChanges();
		},(erro:any) =>{
			status = status == "Validado" ? 'validar' : 'recusar';
			this.msg = `Não foi possivel ${status} o aceite de voz.`;
			this.cdr.detectChanges();
		})
	}
	public pendenciaCreate(response){
		this.is_pendencia = true;
		if(response.success){
			this.msg = "Pendência criada com sucesso";
			this.refresh(true);

		}else{
			this.msg = "Não foi possivel inserir a pendência no momento.";
		}
		this.cdr.detectChanges();
	}

	public refresh(response){
		this.response.emit(response);
	}

	public changeEdit(){
		if(this.data.length > 1){
			this.is_edit_second = !this.is_edit_second;
		}else{
			this.is_edit = !this.is_edit;
		}
	}

	onNoClick(){
		this.dialogRef.close(true);
	}

	ngOnDestroy(){
		this.subs.unsubscribe();
	}
}
