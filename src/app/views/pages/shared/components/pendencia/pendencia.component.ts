import { BtnConfig } from './../../../../../core/_base/crud/models/layout/btn-config.model';
import { Observacao } from './../../../../../core/_base/crud/models/class/observacao.model';
import { Pendencia } from './../../../../../core/_base/crud/models/class/pendencia.model';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { Usuario } from './../../../../../core/_base/crud/models/class/usuario.model';

@Component({
	selector: 'kt-pendencia',
	templateUrl : './pendencia.component.html',
	styleUrls : ['./pendencia.component.scss'],
})
export class PendenciaComponent implements OnInit{
	public usuario:Usuario;
	@Input() show_create:boolean;
	public is_update:boolean = true;
	public pendencia:Pendencia;
	public proposta_id:number;
	public form:FormGroup = new FormGroup({
		id : new FormControl(null),
		proposta_id : new FormControl(null,[Validators.required]),
		observacao : new FormControl(null,[Validators.required])
	});

	@Input() set setPropostaId(value){
		if(!this.functions.isEmpty(value)){
			this.proposta_id = value;
			this.form.patchValue({proposta_id: value});
		}
	}
	@Input() set setPendencia(value){
		if(!this.functions.isEmpty(value)){
			this.pendencia = value;
			if(value.observacoes && value.observacoes.length > 0){
				this.form.patchValue({
					id: value.id
				})
				this.is_update = false;
			}
		}
	}
	@Output() response = new EventEmitter();



	constructor(
		public functions:FunctionsService,
		private cdr:ChangeDetectorRef,
		private _http:HttpService
	){}

	ngOnInit(){
		this.usuario = this.functions.getUsuario();
	}

	public create(){
		if(this.form.status !== "INVALID"){
			let pendencia:any = this.getForm();
			let url = "pendencia"
			if(!this.is_update){
				url = "observacao";
				pendencia = pendencia.observacao[0];
			}
			this._http.post(url,pendencia).subscribe((response:any) => {
				this.refresh(response);
				this.show_create = false;
				this.cdr.detectChanges();
			},(erro:any) =>{
				this.refresh(erro.error);
				this.show_create = false;
				this.cdr.detectChanges();
			})
		}else{
			this.functions.printSnackBar("Escreva uma observação para poder comentar.")
		}
	}

	public checkStatus(){
		let pendencia:any = this.getForm();
		this._http.put("pendencia",{id: pendencia.id , status :2}).subscribe((response:any) =>{
			this.functions.printSnackBar("Pendência resolvida com sucesso");
			this.refresh(true);
		},(erro:any)=>{
			this.functions.printMsgError(erro);
		})
	}

	public getForm(){
		let form = this.form.value;
		let observacao = new Observacao({observacao : form.observacao});
		let pendencia = new Pendencia(form);
		pendencia.observacao = [];
		if(!this.functions.isEmpty(form.id)){
			observacao.pendencia_id = form.id;
		}
		pendencia.observacao.push(observacao);
		return pendencia;
	}

	public refresh(response){
		this.response.emit(response);
	}

}
