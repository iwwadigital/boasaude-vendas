import { Component, OnDestroy, OnInit, Output, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
	selector: 'kt-modal-create-aceite-voz',
	templateUrl: './modal-create-aceite-voz.component.html',
	styleUrls: ['./modal-create-aceite-voz.component.scss']
})
export class ModalCreateAceiteVozComponent implements OnInit,OnDestroy{
	public subs:Subscription = new Subscription();
	public is_other:boolean = false; // Se for true ele vai exibir uma msg perguntando se o usuário deseja alterar os outros tipos de validacao
	public is_block:boolean = false;
    @Output() response = new EventEmitter();
    public form:FormGroup = new FormGroup({
		id : new FormControl(null),
		data_aceite_voz : new FormControl(null,[Validators.required]),
		hora_aceite_voz : new FormControl(null,[Validators.required]),
		telefone :new FormControl(null,[Validators.required,Validators.minLength(8)]),
    })
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef:MatDialogRef<ModalCreateAceiteVozComponent>,
        private functions:FunctionsService,
        private _http:HttpService,
        private cdr:ChangeDetectorRef
    ){}
    
    ngOnInit(){
		this.is_other = this.data.is_exist_other;
	}

    public create(){
		if(this.form.status != "INVALID"){
			let aceite_voz = this.getForm();
			this.is_block = true;
			this.subs.add(
				this._http.post("aceite-voz",aceite_voz,{other_create: 1} ).subscribe((response:any) => {
					this.onNoClick();
					this.response.emit(response);
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
    public getForm(){
		let aceite_voz = this.form.value;
        let horas = this.form.value.hora_aceite_voz;
        aceite_voz.proposta_id = this.data.proposta_id;
		aceite_voz.data_aceite_voz = this.functions.formatData(new Date(this.form.value.data_aceite_voz),"YYYY-mm-dd")+" "+horas.hour+":"+horas.minute;
		return aceite_voz;
	}

    onNoClick(){
		this.dialogRef.close(true);
	}
	
	public setValidation(){
        this.is_other = false;
    }
    
    ngOnDestroy(){
        this.subs.unsubscribe();
    }
}