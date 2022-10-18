import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DadoClinico } from './../../../../../core/_base/crud/models/class/dado_clinico.model';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Pergunta } from './../../../../../core/_base/crud/models/class/pergunta.model';
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { Component, OnInit, ChangeDetectorRef,ChangeDetectionStrategy,Inject, Output,EventEmitter } from "@angular/core";
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';

@Component({
	selector: 'kt-modal-dados-clinicos',
	templateUrl: './modal-dados-clinicos.component.html',
	styleUrls: ['./modal-dados-clinicos.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalDadosClinicosComponent implements OnInit{
	public perguntas:Pergunta[] = [];
	public form:FormGroup;
	public dados_clinicos:FormArray;
	public isLoading:boolean = false;
	public is_edit:boolean = true;
	@Output() response = new EventEmitter();

	constructor(
		@Inject(MAT_DIALOG_DATA) public data:any,
		private _http:HttpService,
		private fb:FormBuilder,
		private cdr:ChangeDetectorRef,
		private functions:FunctionsService,
		private dialogRef: MatDialogRef<ModalDadosClinicosComponent>,
	){}
	ngOnInit(){
		this.form = this.fb.group({
			dados_clinicos : new FormArray([])
		})
		this.is_edit = this.data.is_modal_edit;
		this.isLoading = true;
		this._http.get("pergunta").subscribe((response:any)=>{
			this.perguntas = response.perguntas;
			this.dados_clinicos = this.form.get('dados_clinicos') as FormArray;
			this.perguntas.map(el =>{
				let dado_clinico = new DadoClinico({pergunta_id: el.id, pergunta : el});
				if(el.has_qual == 1){
					dado_clinico.qual = null;
				}
				this.dados_clinicos.push(this.fb.group(dado_clinico));

			});
			if(this.data && !this.functions.isEmpty(this.data.dados_clinicos)){
				let data_clinico = Object.assign([],this.data.dados_clinicos);
				this.setForm(data_clinico);
			}
			this.isLoading = false;
			this.cdr.detectChanges();
		},(erro:any)=>{
			this.isLoading = false;
			this.cdr.detectChanges();
		});
		
	}

	public setForm(dados_clinicos){
		if(dados_clinicos.length > 0){
			dados_clinicos.map((el,i) => {
				if(typeof el.resposta == "string"){
					if(el.pergunta.has_qual == 1){
						let resp = el.resposta.split(",");
						delete resp[0];
						resp = resp.join(" ");
						el.qual = resp;
					}
					if(el.pergunta.tipo_campo === "Verdadeiro/Falso"){
						if((el.resposta.indexOf("Sim") >-1) || el.resposta == "1"){
							el.resposta = true;
						}else{
							el.resposta = false;
						}
					}
				}
				this.dados_clinicos.controls[i].patchValue(el);
			});
			// this.dados_clinicos = dados_clinicos;
			this.cdr.detectChanges();
		}
	}

	public getArrayOpcoes(opcoes:string){
		return opcoes.split("|");
	}

	public salve(){
		let dados_clinicos:DadoClinico[] = [];
		dados_clinicos = this.form.get("dados_clinicos").value;
		dados_clinicos.map(el => {
			if(el.pergunta.tipo_campo === 'Verdadeiro/Falso'){
				el.resposta = el.resposta ? "Sim" : "Não";
			}
			if(el.pergunta.tipo_campo === 'Select'){
				el.resposta = el.resposta ? el.resposta : "Nenhuma";
			}
			if(el.pergunta.has_qual === 1 &&  el.resposta){
				el.qual = el.qual ? el.qual : "";
				el.resposta += `, ${el.qual}`;
			}
		})
		this.response.emit(dados_clinicos);
	}

	public onNoClick(){
		this.dialogRef.close();
	}

}
