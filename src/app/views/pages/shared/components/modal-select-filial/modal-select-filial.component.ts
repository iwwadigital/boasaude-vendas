import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit ,Inject, ChangeDetectorRef, Output , EventEmitter, OnDestroy} from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { Subscription } from 'rxjs';


@Component({
	selector: 'kt-modal-select-filial',
	templateUrl: './modal-select-filial.component.html',
	styleUrls: ['./modal-select-filial.component.scss']
})
export class ModalSelectFilialComponent implements OnInit,OnDestroy{
	public subs:Subscription = new Subscription();
    public filiais:any[] = [];
    public form:FormGroup = new FormGroup({
        filial : new FormControl(null)
    })
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef:MatDialogRef<ModalSelectFilialComponent>,
		private cdr:ChangeDetectorRef,
		public functions:FunctionsService,
	){}
	ngOnInit(){
        let usuario = this.functions.getUsuario();
        localStorage.setItem("selectFilial","1");
		if(usuario && usuario.usuario_filial && usuario.usuario_filial.length > 0){
			this.filiais = usuario.usuario_filial.map(el => el.filial);
			let filial = localStorage.getItem("filial");
			let filialObj = localStorage.getItem("filialObj");

			if(this.filiais.length > 0){
				if(!filial){
					this.form.patchValue({
						"filial" : this.filiais[0]
					});
					localStorage.setItem("filial",this.filiais[0].nome);
					localStorage.setItem("filialObj",this.filiais[0]);
				}else{
					filialObj = JSON.parse(filialObj);
					this.form.patchValue({
						"filial" : filialObj
					});
				}
			}
		}
        this.subs.add(
            this.form.get('filial').valueChanges.subscribe((value)=>{
                localStorage.setItem("filial",value.nome);
				localStorage.setItem("filialObj",value);
				this.functions.setLogo(value.logo);

				// this.functions.setFilial(value);
				this.functions.setFilialModal(value);
                setTimeout(() => {
                    this.onNoClick();        
                },500)
            })
        );
        
	}

	public objectComparisonFunction = function( option, value ) : boolean {
		return option.id === value.id;
	}

	onNoClick(){
		this.dialogRef.close(true);
	}

	ngOnDestroy(){
		this.subs.unsubscribe();
	}
}
