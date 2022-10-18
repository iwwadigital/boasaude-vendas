import { debounceTime, switchMap } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, Inject,EventEmitter, Output } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { Endereco } from './../../../../../core/_base/crud/models/class/endereco.model';
import { LISTA_ESTADO } from './../../../../../api';

@Component({
    selector: 'kt-modal-endereco',
	templateUrl: './modal-endereco.component.html',
	styleUrls: ['./modal-endereco.component.scss']
})
export class ModalEnderecoComponent implements OnInit{
	private subs:Subscription = new Subscription();
    public form:FormGroup;
    public is_edit:boolean = false;
	public is_loading:boolean = false;
	public is_block:boolean = false;
	public list_estado = [];
    @Output() response = new EventEmitter();
    constructor(
        @Inject(MAT_DIALOG_DATA) public data:any,
		private _http:HttpService,
		private formBuilder:FormBuilder,
		private dialogRef: MatDialogRef<ModalEnderecoComponent>,
		private functions:FunctionsService,
        private cdr:ChangeDetectorRef
    ){}
    ngOnInit(){
		let lista = LISTA_ESTADO;
		let filial = localStorage.getItem("filial");
		
		for(let estado in lista){
			this.list_estado.push(estado);
		}
        this.form = this.formBuilder.group(new Endereco());
        let validators = new Endereco().getValidators();

		validators.map(el =>{
			el.validators.map(val =>{
				this.form.get(el.key).setValidators(val);
			})
		});
		if(filial){
			this.form.patchValue({
				cidade : filial
			})	
		}
		this.subs.add(
			this.form.get('cep').valueChanges.pipe(
				debounceTime(500),
				switchMap((value:string) =>{
					if(!this.functions.isEmpty(value) && typeof value === 'string' && value.length === 8){
						this.cdr.detectChanges();
						this._http.get(`search-cep/${value}`).subscribe((response:any) =>{
							this.form.patchValue({
								rua : response.logradouro,
								bairro : response.bairro,
								cidade: response.localidade,
								uf: response.uf,
							});
							this.cdr.detectChanges();
						},(erro:any) =>{
							this.functions.printMsgError(erro);
							this.cdr.detectChanges();
						})
					}
					return of(value);
				})
			).subscribe()
		);

        // Show Edit
        if(!this.functions.isEmpty(this.data) && !this.functions.isEmptyObj(this.data)){
			this._http.show("endereco",this.data.id).subscribe((response:any) =>{
				this.setForm(response.endereco);
				this.is_edit = true;
			})
		}
	}



    public getForm(){
		let endereco:Endereco = new Endereco(this.form.value);
		return endereco;
	}

	public setForm(endereco:Endereco){
		this.form.patchValue(endereco);
    }

    public create(){
		if(this.form.status !== 'INVALID'){
			this.is_block = true;
			this.is_loading = true;
			let endereco = this.getForm();
			this._http.post("endereco",endereco).subscribe((response:any) =>{
				this.functions.printSnackBar(response.message);
				this.is_loading = false;
				this.is_block = false;
				this.setResponse(response);
				this.cdr.detectChanges();
			},(erro:any)=>{
				this.functions.printMsgError(erro);
				this.setResponse(erro.error);
				this.is_loading = false;
				this.is_block = false;
				this.cdr.detectChanges();
			});
		}else{
			this.functions.printSnackBar("Preencha todos os campos do formulário");
		}
	}

	public update(){
		if(this.form.status !== 'INVALID'){
			let endereco = this.getForm();
			this.is_block = true;
			this.is_loading = true;
			this._http.put(`endereco`,endereco).subscribe((response:any) =>{
				this.functions.printSnackBar(response.message);
				this.setResponse(response);
				this.is_loading = false;
				this.cdr.detectChanges();
			},(erro:any)=>{
				this.functions.printMsgError(erro);
				this.setResponse(erro.error);
				this.is_block = false;
				this.is_loading = false;
				this.cdr.detectChanges();
			});
		}else{
			this.functions.printSnackBar("Preencha todos os campos do formulário");
		}
    }

    public setResponse(response){
		this.response.emit(response);
	}
	onNoClick(){
		this.dialogRef.close(true);
	}

}
