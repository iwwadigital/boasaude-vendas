import { Component, OnInit, ChangeDetectorRef, Inject,EventEmitter, Output } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpService } from '../../../../../core/_base/crud/services/http.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FunctionsService } from '../../../../../core/_base/crud/utils/functions.service';
import { CanalVendas } from '../../../../../core/_base/crud/models/class/canal_vendas.model';

@Component({
    selector: 'kt-modal-canal-vendas',
	templateUrl: './modal-canal-vendas.component.html',
	styleUrls: ['./modal-canal-vendas.component.scss']
})
export class ModalCanalVendasComponent implements OnInit{
    public form:FormGroup;
    public is_edit:boolean = false;
	public is_loading:boolean = false;
	public is_block:boolean = false;
    @Output() response = new EventEmitter();
    constructor(
        @Inject(MAT_DIALOG_DATA) public data:any,
		private _http:HttpService,
		private formBuilder:FormBuilder,
		private dialogRef: MatDialogRef<ModalCanalVendasComponent>,
		private functions:FunctionsService,
        private cdr:ChangeDetectorRef
    ){}
    ngOnInit(){
        this.form = this.formBuilder.group(new CanalVendas());
        let validators = new CanalVendas().getValidators();

		validators.map(el =>{
			el.validators.map(val =>{
				this.form.get(el.key).setValidators(val);
			})
		});

        // Show Edit
        if(!this.functions.isEmpty(this.data) && !this.functions.isEmptyObj(this.data)){
			this._http.show("canal-vendas",this.data.id).subscribe((response:any) =>{
				this.setForm(response.canal_vendas);
				this.is_edit = true;
			})
		}
    }

    public getForm(){
		let canal_vendas:CanalVendas = new CanalVendas(this.form.value);
		return canal_vendas;
	}

	public setForm(canal_vendas:CanalVendas){
		this.form.patchValue(canal_vendas);
    }

    public create(){
		if(this.form.status !== 'INVALID'){
			this.is_block = true;
			this.is_loading = true;
			let canal_vendas = this.getForm();
			this._http.post("canal-vendas",canal_vendas).subscribe((response:any) =>{
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
			let canal_vendas = this.getForm();
			this.is_loading = true;
			this._http.put(`canal-vendas`,canal_vendas).subscribe((response:any) =>{
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
