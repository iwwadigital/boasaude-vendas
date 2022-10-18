import { Component, Inject, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
	trigger,
	state,
	style,
	animate,
	transition,
  } from '@angular/animations';

@Component({
	selector: 'kt-modal-assinatura',
	templateUrl: './modal-assinatura.component.html',
    styleUrls: ['./modal-assinatura.component.scss'],
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
export class ModalAssinaturaComponent implements OnInit{
    public image_get:boolean = false;
    public is_assinatura_impressa:boolean = false;
    public is_other:boolean = false; // Se for true ele vai exibir uma msg perguntando se o usuário deseja alterar os outros tipos de validacao
    @Output() response = new EventEmitter();
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef:MatDialogRef<ModalAssinaturaComponent>,
        private _http:HttpService,
        private functions:FunctionsService,
        private cdr:ChangeDetectorRef
    ){}
    ngOnInit(){
        this.is_other = this.data.is_exist_other;
    }
    public create(){
        if(!this.is_assinatura_impressa){
            this.image_get = true;
        }else{
            let data = {
                id : this.data.proposta_id,
                is_assinatura_presencial : 1
            }
            this._http.put("proposta",data,{other_create: 1} ).subscribe((response:any) => {
                this.functions.printSnackBar(response.message);
                this.response.emit(true);
                this.onNoClick();
            },(erro:any) => {
                this.functions.printMsgError(erro);
            })
        }
    }
    
    setImage(image){
        let data = new FormData();
        data.append("proposta_id",String(this.data.proposta_id));
        data.append("media",image);
        this._http.post("comprovante",data, {other_create: 1} ).subscribe((response:any) => {
            this.functions.printSnackBar(response.message);
            this.response.emit(true);
            this.onNoClick();
        },(erro:any) => {
            this.functions.printMsgError(erro);
        })
        
    }

    public setValidation(){
        this.is_other = false;
        // this.cdr.detectChanges();
    }
    onNoClick(){
		this.dialogRef.close(true);
	}
}