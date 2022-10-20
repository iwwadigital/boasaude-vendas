import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { AceiteVoz } from './../../../../../core/_base/crud/models/class/aceite_voz.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit ,Inject, ChangeDetectorRef, Output , EventEmitter, OnDestroy} from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { Subscription } from 'rxjs';


@Component({
	selector: 'kt-modal-adesao-online',
	templateUrl: './modal-adesao-online.component.html',
	styleUrls: ['./modal-adesao-online.component.scss']
})
export class ModalAdesaoOnlineComponent implements OnInit,OnDestroy{
	public subs:Subscription = new Subscription();
	public is_proposta_pagamento_online:boolean = false;
	public is_inclusion:boolean = false;
	public url:string = "";
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef:MatDialogRef<ModalAdesaoOnlineComponent>,
		private _http:HttpService,
		private cdr:ChangeDetectorRef,
		public functions:FunctionsService,
	){}
	ngOnInit(){
		this.url = this.data.url_payment;
	}

    public handleSendEmailClient(){
        this.subs.add(
            this._http.show("proposta/pagamento/send",this.data.id,{type : this.data.type, label: this.data.label_send_now}).subscribe((resp:any) =>{
                this.functions.printSnackBar(resp.message);
            },(e:any) =>{
                this.functions.printMsgError(e);
            })
        );
    }
	
    public clickPayment(){
		window.open(this.url, '_blank');
	}

    public clickShareWhatsApp(){
        let msg = `Falta pouco para você completar a sua adesão à BoaSaúde. Acesse o link para realizar o pagamento da sua adesão: ${this.url}`;
        let url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`
        window.open(url, '_blank');
    }

	onNoClick(){
		this.dialogRef.close(true);
	}

	ngOnDestroy(){
		this.subs.unsubscribe();
	}
}
