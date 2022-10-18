import { Component, OnInit, ChangeDetectorRef, Inject,EventEmitter, Output } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { Produto } from './../../../../../core/_base/crud/models/class/produto.model';
import { Tabela } from './../../../../../core/_base/crud/models/class/tabela.model';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'kt-modal-produto',
	templateUrl: './modal-produto.component.html',
	styleUrls: ['./modal-produto.component.scss']
})
export class ModalProdutoComponent implements OnInit{
    public form:FormGroup;
    public is_edit:boolean = false;
	public is_loading:boolean = false;
	public is_block:boolean = false;
	public tabelas:Tabela[] = [];
    @Output() response = new EventEmitter();
    constructor(
        @Inject(MAT_DIALOG_DATA) public data:any,
		private _http:HttpService,
		private formBuilder:FormBuilder,
		private dialogRef: MatDialogRef<ModalProdutoComponent>,
		private functions:FunctionsService,
        private cdr:ChangeDetectorRef
    ){}
    ngOnInit(){
        this.form = this.formBuilder.group(new Produto());
        let validators = new Produto().getValidators();

		validators.map(el =>{
			el.validators.map(val =>{
				this.form.get(el.key).setValidators(val);
			})
		});

		this._http.get("tabela").subscribe((response:any)=>{
			this.tabelas = response.tabelas;
			this.cdr.detectChanges();
		},(error:any)=>{
			this.tabelas = [];
		})

		this.form.get("tabela").valueChanges.pipe(
			debounceTime(500),
			switchMap(value =>{
				if(value !== null && typeof value !== 'object'){
					this._http.get("tabela",{q:value}).pipe(
						catchError((err,caught)=>{
							this.functions.printSnackBar(`Não tem tabela cadastrada com esse nome.`);
							return of(err);
						})
					).subscribe((resp:any)=>{
						this.tabelas = resp.tabelas;
						this.cdr.detectChanges();
					},(erro:any)=>{
						this.tabelas = [];
					})
				}
				return of(null);
			})
		).subscribe();

        // Show Edit
        if(!this.functions.isEmpty(this.data) && !this.functions.isEmptyObj(this.data)){
			this._http.show("produto",this.data.id).subscribe((response:any) =>{
				this.setForm(response.produto);
				this.is_edit = true;
			})
		}
    }

    public getForm(){
		let produto:Produto = new Produto(this.form.value);
		produto.tabela_id = this.form.value.tabela.id;
		return produto;
	}

	public setForm(produto:Produto){
		this.form.patchValue(produto);
    }

    public create(){
		if(this.form.status !== 'INVALID'){
			this.is_block = true;
			this.is_loading = true;
			let produto = this.getForm();
			this._http.post("produto",produto).subscribe((response:any) =>{
				this.functions.printSnackBar(response.message);
				this.is_loading = false;
				this.setResponse(response);
				this.is_block = false;
				this.cdr.detectChanges();
			},(erro:any)=>{
				this.functions.printMsgError(erro);
				this.setResponse(erro.erro);
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
			this.is_block = true;
			let produto = this.getForm();
			this.is_loading = true;
			this._http.put(`produto`,produto).subscribe((response:any) =>{
				this.functions.printSnackBar(response.message);
				this.setResponse(response);
				this.is_loading = false;
				this.is_block = false;
				this.cdr.detectChanges();
			},(erro:any)=>{
				this.functions.printMsgError(erro);
				this.setResponse(erro.erro);
				this.is_loading = false;
				this.is_block = false;
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

	displayFn(data?:any){
		return data ? data.nome : undefined;
	}
}
