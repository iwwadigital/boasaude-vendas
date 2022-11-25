import { Component, ChangeDetectorRef, Output, EventEmitter, OnInit, Inject, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import {
	trigger,
	state,
	style,
	animate,
	transition,
  } from '@angular/animations';
import { Vida } from './../../../../../core/_base/crud/models/class/vida.model';
import { ESTADO_CIVIL, LISTA_ESTADO } from "./../../../../../api";
import { SeguroSaude } from "./../../../../../core/_base/crud/models/class/seguro_saude.model";


@Component({
    selector: 'kt-modal-endereco-vida',
	templateUrl: './modal-endereco.component.html',
    styleUrls: ['./modal-endereco.component.scss'],
    animations: [
		trigger('hide',[
		transition(':enter', [
			style({
					'height': '0',
					overflow:'hidden',
				}),  // initial
			animate('350ms',
				style({
					'height': '*'
				}))  // final
			]),
		transition(':leave', [
			style({
				'height': '*',
				overflow:'hidden'
			}),  // initial
			animate('350ms',
				style({
					'height': '0',
					overflow:'hidden'
				}))  // final
			]),
		]),
		trigger('fade',[
			transition(':enter',[
				style({
					"opacity": '0'
				}),
				animate('350ms',
				style({
					'opacity' :'1'
				}))
			]),
			transition(':leave',[
				style({
					"opacity": '1'
				}),
				animate('350ms',
				style({
					'opacity' :'0'
				}))
			]),
		])
	]
})
export class ModalEnderecoVidaComponent implements OnInit, OnDestroy {
    @Output() response = new EventEmitter();
    private subs:Subscription = new Subscription();
    public vida:any;
    public is_matricula:boolean = false;
    public is_block:boolean = false;
    public isLoading:boolean = false;
	public is_edit:boolean = false;
	public is_titular:boolean = false;
	public titular:any;
	public lista_estado = [];
	public lista_estado_civil:any;
	
	public seguros_saude:SeguroSaude[]= [];
	public tabelas:any[];

    public form:FormGroup;

    get f(){
        return this.form.value;
    }
    set f(value:any){
        this.form.patchValue(value);
    }

    constructor(
        @Inject(MAT_DIALOG_DATA) public data:any = null,
		private formBuilder:FormBuilder,
		private cdr:ChangeDetectorRef,
        private functions:FunctionsService,
        private _http:HttpService,
		private dialogRef: MatDialogRef<ModalEnderecoVidaComponent>,
    ){}

    ngOnInit(){
		this.criarFormulario({})
		let lista = LISTA_ESTADO;
		this.getEstadoCivil();
		this.getSeguroSaude({filial: localStorage.getItem("filial")});
		for(let estado in lista){
			this.lista_estado =  lista[estado];
		}
        if(!this.functions.isEmpty(this.data)){
			this.titular = this.data.titular;
			delete this.data.titular;
            this.f = this.data;
			this.vida = this.data;
			this.is_matricula = this.data.is_matricula;
			if(this.data.is_matricula){
				let date = new Date();
			}
        }
		this.iniciarMudancaValoresFormulario();
    }

	private criarFormulario(obj){
		this.form = this.formBuilder.group(new Vida(obj).getCamposModal());
		let validators_vida = new Vida().getValidatorsInfo();
		validators_vida.map(el =>{
			this.form.get(el.key).setValidators(el.validators);
		});
	}

	private iniciarMudancaValoresFormulario(){
		this.subs.add(
			this.form.get("cep").valueChanges.pipe(
				debounceTime(500),
				switchMap((value:string) =>{
					if(!this.functions.isEmpty(value) && typeof value === 'string' && value.length === 8){
						this.isLoading = true;
						this.cdr.detectChanges();
						this._http.get(`search-cep/${value}`).subscribe((response:any) =>{
							this.form.patchValue({
								rua : response.logradouro,
								bairro : response.bairro,
								cidade : response.localidade,
								estado: this.functions.getEstado(response.uf)
							});
							this.isLoading = false;
							this.cdr.detectChanges();
						},(erro:any) =>{
							this.functions.printMsgError(erro);
							this.isLoading = false;
							this.cdr.detectChanges();
						})
					}
					return of(value);
				})
			).subscribe()
		);
		this.subs.add(
			this.form.get("e_endereco_titular").valueChanges.subscribe((value) =>{
				if(value == true){
					this.setTitularVida();
				}else{
					this.setTitularVida(true);
				}
			})
		)
	}

	public displayFn(data?:any){
		return data ? data.codigo+" - "+data.nome : undefined;
	}

	public getEstadoCivil(){
		this._http.get("lista/estado-civil").subscribe((resp:any) => {
			this.lista_estado_civil = resp.data;
		},(e:any) =>{
			this.lista_estado_civil = ESTADO_CIVIL;
		})
	}

    public save(){
		if(this.form.status != "INVALID"){
			let endereco = this.f;
			if(this.is_matricula && this.f.tabela){
				endereco.tabela_id = this.f.tabela.id;
			}
        	this.response.emit(endereco);
		}else{
			this.functions.printSnackBar("Preencha todos os campos obrigatórios.");
		}
        
	}

	public setTitularVida(is_clear?:boolean){
		this.form.patchValue({
			rua :  !is_clear ? this.titular.titular_endereco_rua : '',
			bairro : !is_clear ? this.titular.titular_endereco_bairro : '',
			cep : !is_clear ? this.titular.titular_cep : '',
			cidade : !is_clear ? this.titular.titular_cidade : '',
			estado : !is_clear ? this.titular.titular_uf : '',
			numero : !is_clear ? this.titular.titular_numero : '',
			complemento : !is_clear ? this.titular.titular_endereco_complemento : '',
			referencia : !is_clear ? this.titular.titular_endereco_referencia : '',
			email : !is_clear ? this.titular.titular_urgencia_email : '',
			tel_residencial : !is_clear ? this.titular.titular_tel_residencial : '',
		});
	}

	public getSeguroSaude(parameter?:any){
		this._http.get("seguro-saude",parameter).pipe(
			catchError((err,caught)=>{
				this.seguros_saude = [];
				this.functions.printSnackBar(`Nenhum seguro saúde encontrada.`);
				return of(err);
			})
		).subscribe((response:any)=>{
			this.seguros_saude = response.seguros_saude;
		})
	}

    public onNoClick(){
		this.dialogRef.close();
	}
    ngOnDestroy(){
        this.subs.unsubscribe();
    }
}