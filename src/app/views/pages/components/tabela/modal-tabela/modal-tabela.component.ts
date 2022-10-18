import { Component, OnInit, ChangeDetectorRef, Inject,EventEmitter, Output } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { Tabela } from './../../../../../core/_base/crud/models/class/tabela.model';

@Component({
    selector: 'kt-modal-tabela',
	templateUrl: './modal-tabela.component.html',
	styleUrls: ['./modal-tabela.component.scss']
})
export class ModalTabelaComponent implements OnInit{
    public form:FormGroup;
    public is_edit:boolean = false;
    public is_loading:boolean = false;
    public is_block:boolean = false;
	public status:number;
    @Output() response = new EventEmitter();
    constructor(
        @Inject(MAT_DIALOG_DATA) public data:any,
		private _http:HttpService,
		private formBuilder:FormBuilder,
		private dialogRef: MatDialogRef<ModalTabelaComponent>,
		private functions:FunctionsService,
        private cdr:ChangeDetectorRef
    ){}
    ngOnInit(){
        this.form = this.formBuilder.group(new Tabela());
        let validators = new Tabela().getValidators();
        
		validators.map(el =>{
			el.validators.map(val =>{
				this.form.get(el.key).setValidators(val);
			})
        });
        // Show Edit
        if(!this.functions.isEmpty(this.data) && !this.functions.isEmptyObj(this.data)){
			this._http.show("tabela",this.data.id).subscribe((response:any) =>{
				this.setForm(response.tabela);
				this.is_edit = true;
			})
		}
    }

    public getForm(){
		let tabela:Tabela = new Tabela(this.form.value);
		delete tabela.status;
		return tabela;
	}

	public setForm(tabela:Tabela){
		tabela.status = tabela.status == "1" ? 'Ativo' : "Inativo";
		this.form.patchValue(tabela);
    }
    
    public create(){
		if(this.form.status !== 'INVALID'){
			this.is_block = true;
			this.is_loading = true;
			let tabela = this.getForm();
			this._http.post("tabela",tabela).subscribe((response:any) =>{
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
			let tabela = this.getForm();
			this.is_block = true;
			this.is_loading = true;
			this._http.put(`tabela`,tabela).subscribe((response:any) =>{
				this.functions.printSnackBar(response.message);
				this.setResponse(response);
				this.is_block = false;
				this.is_loading = false;
				this.cdr.detectChanges();
			},(erro:any)=>{
				this.functions.printMsgError(erro);
				this.setResponse(erro.erro);
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