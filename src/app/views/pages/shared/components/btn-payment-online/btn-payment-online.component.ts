import { Component,OnInit, Input, Output, EventEmitter } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ADESAO_PAGAMENTO_ONLINE_ID } from "./../../../../../api";
import { Proposta } from "./../../../../../core/_base/crud/models/class/proposta.model";
import { FunctionsService } from "./../../../../../core/_base/crud/utils/functions.service";
import { ModalAdesaoOnlineComponent } from "../modal-adesao-online/modal-adesao-online.component";

@Component({
	selector: 'kt-btn-payment-online',
	templateUrl : './btn-payment-online.component.html',
	styleUrls : ['./btn-payment-online.component.scss'],
})
export class BtnPaymentOnlineComponent implements OnInit{
    public tipos_pagamento:any[] = [];
    public adesao:any;
    public mensalidade:any;
    public proposta:Proposta;
	@Output() resetRefresh = new EventEmitter();

	@Input() set setTiposPagamentos(value){
		if(!this.functions.isEmpty(value)){
			this.tipos_pagamento = value;
		}
	}
	@Input() set setMensalidade(value){
		this.mensalidade = value;		
	}
	@Input() set setAdesao(value){
		this.adesao = value;		
	}
	@Input() set setProposta(value){
		if(!this.functions.isEmpty(value)){
			this.proposta = value;
		}
	}
	@Input() set refresh(value){
		if(value){
			this.checkMensalidadeFill();
		}
	}

    public has_accession_online:boolean = false;
	public has_month_online:boolean = false;
	public has_inclusion_online:boolean = false;

    constructor(
        private functions:FunctionsService,
        private dialog:MatDialog
    ){}

	ngOnInit() {
        // this.checkMensalidadeFill();
    }

    public verificaTipoPagamento(value,tipo){
		let arr = this.tipos_pagamento[tipo];
		for(let i=0; i< arr.length; i++ ){
			if(!this.functions.isEmpty(value)){
				if(arr[i] == value){
					return true;
				}
			}
		}
		return false;
	}

    public checkMensalidadeFill(){
		this.has_accession_online = false;
		this.has_month_online = false;
		this.has_inclusion_online = false;
		if(this.adesao.pagamento_tipo_id == ADESAO_PAGAMENTO_ONLINE_ID && (this.adesao.status == undefined || this.adesao.status == 0) ){
			this.has_accession_online = true;
		}else{
			this.has_accession_online = false;
		}
		if(this.checkMensalidadePayment(this.mensalidade)){
			this.has_month_online = true;
		}else{
			this.has_month_online = false;
		}
		if(this.proposta.matricula_titular != null){
			this.has_inclusion_online = true; 
		}else{
			this.has_inclusion_online = false; 
		}

		this.resetRefresh.emit(false);
	}

    public checkMensalidadePayment(mensalidade){

		if(
			mensalidade.pagamento_online == 1
		){
			if(
				(this.verificaTipoPagamento(mensalidade.pagamento_tipo_id,"cartao_d") || 
				this.verificaTipoPagamento(mensalidade.pagamento_tipo_id,"cartao")) &&
				this.functions.isEmpty(mensalidade.cartao_numero)
			){
				return true;
			}else if(
				this.verificaTipoPagamento(mensalidade.pagamento_tipo_id,"conta") &&
				this.functions.isEmpty(mensalidade.banco)
			){
				return true;
			}else if(
				this.verificaTipoPagamento(mensalidade.pagamento_tipo_id,"boleto")
			){
				return true;
			}
		}
		return false;
	}

    
	public clickModalPayment(type:string){
		let modal_config :MatDialogConfig = new MatDialogConfig();
		let is_payment_online:boolean = false;
		let data:any = {
			type : type,
			id: this.proposta.id,
		};
		switch(type){
			case "adesao" : {
				is_payment_online = true;
				data.url_payment = this.proposta.url_payment;
				data.label_send_now = "Pagar agora";
				data.is_accession = true;
				break;
			}
			case "mensalidade" : {
				data.url_payment = this.proposta.url_payment_month;
				data.label_send_now = "Preencher agora";
				data.is_month = true;
				break;
			}
			case "inclusao" : {
				data.url_payment = this.proposta.url_payment_inclusion;
				data.label_send_now = "Inclusão Online";
				data.is_inclusion = true;
				break;
			}
		}
		modal_config.data = data;
		let dialogRef:any = this.dialog.open(ModalAdesaoOnlineComponent,modal_config);
        // this.subs.add(
		// 	dialogRef.componentInstance.response.subscribe((value) =>{
		// 		if(!this.functions.isEmpty(value)){
		// 			this.show();
		// 		}
		// 	})
		// );
	}
}
