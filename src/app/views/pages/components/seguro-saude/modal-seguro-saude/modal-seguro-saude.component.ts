import { Component, OnInit, ChangeDetectorRef, Inject,EventEmitter, Output, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpService } from '../../../../../core/_base/crud/services/http.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FunctionsService } from '../../../../../core/_base/crud/utils/functions.service';
import { SeguroSaude } from "../../../../../core/_base/crud/models/class/seguro_saude.model";
import { Subscription } from "rxjs";

@Component({
    selector: 'kt-modal-seguro-saude',
	templateUrl: './modal-seguro-saude.component.html',
	styleUrls: ['./modal-seguro-saude.component.scss']
})
export class ModalSeguroSaudeComponent implements OnInit,OnDestroy{
    private subs:Subscription = new Subscription();
    public form:FormGroup;
    public is_edit:boolean = false;
	public is_loading:boolean = false;
	public is_block:boolean = false;
    @Output() response = new EventEmitter();
    constructor(
        @Inject(MAT_DIALOG_DATA) public data:any,
		private _http:HttpService,
		private formBuilder:FormBuilder,
		private dialogRef: MatDialogRef<ModalSeguroSaudeComponent>,
		private functions:FunctionsService,
        private cdr:ChangeDetectorRef
    ){}
    ngOnInit(){
        this.form = this.formBuilder.group(new SeguroSaude());
        let validators = new SeguroSaude().getValidators();

		validators.map(el =>{
            this.form.get(el.key).setValidators(el.validators);
		});

        // Show Edit
        if(!this.functions.isEmpty(this.data) && !this.functions.isEmptyObj(this.data)){
            this.is_loading = true;
            this.subs.add(
                this._http.show("seguro-saude",this.data.id).subscribe((response:any) =>{
                    this.setForm(response.seguro_saude);
                    this.is_edit = true;
                    this.is_loading = false;
                    this.cdr.detectChanges();
                },(e:any)=>{
                    this.is_loading = false;
                    this.cdr.detectChanges();
                })
            );
		}
    }
    public getForm(){
		let seguro_saude:SeguroSaude = new SeguroSaude(this.form.value);
        let filial = localStorage.getItem("filial");
        let cidade:any = "Salvador";
        if(!this.functions.isEmpty(filial)){
            cidade = filial;
        }
        seguro_saude.cidade = cidade;
		return seguro_saude;
	}

	public setForm(seguro_saude:SeguroSaude){
		this.form.patchValue(seguro_saude);
    }

    public create(){
		if(this.form.status !== 'INVALID'){
			this.is_block = true;
			this.is_loading = true;
			let seguro_saude = this.getForm();
            this.subs.add(
                this._http.post("seguro-saude",seguro_saude).subscribe((response:any) =>{
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
                })
            );
		}else{
			this.functions.printSnackBar("Preencha todos os campos do formulário");
		}
	}

	public update(){
		if(this.form.status !== 'INVALID'){
			this.is_block = true;
			let seguro_saude = this.getForm();
			this.is_loading = true;
            this.subs.add(
                this._http.put(`seguro-saude`,seguro_saude).subscribe((response:any) =>{
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
                })
            );
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
    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
