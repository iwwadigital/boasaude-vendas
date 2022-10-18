import { PageEvent, 
	MatTableDataSource, 
	MatPaginator, 
	MatDialogConfig, 
	MatDialog
} from '@angular/material';
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter, ViewChild, OnDestroy } from "@angular/core";
import { ModalAceiteVozComponent } from '../modal-aceite-voz/modal-aceite-voz.component';
import { Proposta } from './../../../../../core/_base/crud/models/class/proposta.model';
import {
	trigger,
	state,
	style,
	animate,
	transition,
  } from '@angular/animations';
import { FormGroup, FormControl } from '@angular/forms';
import { LISTA_TIPO_ADESAO, STATUS_PROPOSTAS,TIPOS_PAMENTOS } from './../../../../../api';
import { ModalValidatePropostaComponent } from '../../../proposta/modal-validate-proposta/modal-validate-proposta.component';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-table-proposta',
	templateUrl : './table-proposta.component.html',
	styleUrls : ['./table-proposta.component.scss'],
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
	]
})
export class TablePropostaComponent implements OnInit,OnDestroy{
	private subs:Subscription = new Subscription();
	//Config view
	public isLoading:boolean = false;
	public is_filter:boolean = false;
	@Input() exist_filter:boolean = true;
	private typeSearch:any = {};

	//Table
	public data_table:MatTableDataSource<any>;
	// public data_table:any [] = [];
	public displayedColumns:string[] = ["id",
	"cliente",
	"data",
	"status",
	"vendedor",
	"adesao_online",
	"voz","conferida","visualizar"];
	//Paginacao
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	public page:number = 0;
	public total:number = 0;
	public currentPage:number = 0;
	public limit:number = 50;
	public pagination_config:any = {};
	public list_pagamentos:any;
	public list_pagamento_mensalidade:any;
	
	public form:FormGroup = new FormGroup({
		filtro : new FormControl(null),
		forma_pagamento : new FormControl(null)
	})

	@Input() url_page:string;

	@Input() set setDisplayedColumns(value){
		this.displayedColumns = value;
		this.cdr.detectChanges();
	}

	@Input() set setRefresh(value){
		if(!this.functions.isEmpty(value) && value){
			this.pagination();
		}
	}

	@Input() set setSearch(value){
		this.typeSearch = value;
		// if(!this.functions.isEmpty(value) && !this.functions.isEmptyObj(value)){
		// 	for(let key in value){
		// 			this.typeSearch[key] = value[key];
		// 	};
		// }
		this.pagination();
	}

	@Output() getRefresh = new EventEmitter;

	constructor(
		private route:ActivatedRoute,
		private router:Router,
		public functions:FunctionsService,
		private _http:HttpService,
		private cdr:ChangeDetectorRef,
		private dialog:MatDialog,
		private location:Location
	){
		this.url_page = this.route.routeConfig.path;
	}
	ngOnInit(){
		this.getTipoPagamento()
		
		this.subs.add(
			this.functions.$filial.subscribe((value:any) => {
				if(typeof value == "string"){
					this.typeSearch.filial = value;
					this.pagination();
				}
			})
		);

		this.subs.add(
			this.form.get("filtro").valueChanges.subscribe((filtro:any)=>{
				if(filtro == "Todos"){
					filtro = "";
				}
				this.typeSearch.status = filtro;
				this.typeSearch.page = 1;
				this.location.replaceState(this.location.path().split('?')[0], '');
				this.pagination();
			})
		);
		this.subs.add(
			this.form.get("forma_pagamento").valueChanges.subscribe((forma:any) => {
				if(forma.id == 103){
					this.typeSearch.pagamento_tipo_adesao_id = 0;
				}else{
					if( forma != "0"){
						this.typeSearch.pagamento_tipo_adesao_id = forma.id;
					}else{
						delete this.typeSearch.pagamento_tipo_adesao_id;
					}
				}
				this.pagination()
			})
		)

		// this.pagination(); // REsolver questão de ta carregando duas vezes
	}

	public getTipoPagamento(){
		this._http.get("lista/all").subscribe((resp:any) => {
			this.list_pagamento_mensalidade = resp.pagamentos;
			this.list_pagamentos = resp.adesoes;
			this.handleList();
		},(e)=>{
			this.list_pagamento_mensalidade = TIPOS_PAMENTOS;
			this.handleList();
		})
	}
	public handleList(){
		this.list_pagamentos.map((el) => {
			if(el.id == 103){
				el.nome = "Adesão Paga";
			}
		})
	}

	public pagination(){
		this.subs.add(
			this.route.queryParams.subscribe((params:any)=>{
				if(!this.functions.isEmpty(params.page)){
					if(!this.functions.isEmptyObj(this.typeSearch)){
						// let p:any = params;
						let p:any = {};
						Object.assign(p,params,this.typeSearch);
						// for(let key in this.typeSearch){
						// 	if(!this.functions.isEmpty(this.typeSearch[key])){
						// 		p[key] = this.typeSearch[key];
								
						// 	}
						// }
						params = p;
						
					}

					this.currentPage = parseInt(params.page) - 1;
					this.typeSearch.page = params.page;
					if(!this.functions.isEmpty(params.limit)){
						this.limit = params.limit;
						this.typeSearch.limit = this.limit;
					}
					if(!this.functions.isEmpty(params.status)){
						this.typeSearch.status = params.status;
					}
					this.get(params);
					// this.sendRefresh();
				}else{
					this.currentPage = 0;
					this.get(this.typeSearch);
				}
			})
		);
	}

	public get(params?:any){
		// this.getRefresh.emit(true);
		this.data_table = undefined;
		this.isLoading = true;
		this.cdr.detectChanges();
		this.subs.add(
			this._http.get("proposta",params).subscribe((response:any) =>{
				this.data_table = new MatTableDataSource(response.propostas);
				this.setPagination(response.pagination);
				// this.data_table.paginator = this.paginator;
				// this.data_table = response.propostas;
				this.isLoading = false;
				this.cdr.detectChanges();
			},(erro:any) =>{
				this.data_table = undefined;
				this.isLoading = false;
				this.cdr.detectChanges();
			})
		);
	}

	public setPagination(pagination){
		this.currentPage = parseInt(pagination.current_page) - 1;
		this.page = pagination.per_page;
		this.total = pagination.total;
		let config = {
			pagination : pagination,
			search :this.typeSearch
		};
		this.pagination_config = config;
	}

	public getPaginatorData(event:PageEvent){
		this.page = event.pageSize;
		// if(event.pageIndex !== this.currentPage){
			this.typeSearch.limit = event.pageSize;
			this.currentPage = event.pageIndex;
			this.typeSearch.page = event.pageIndex+1;
			this.router.navigate([`/${this.url_page}`], {queryParams: this.typeSearch});
		// }
		this.cdr.detectChanges();
	}

	public classAceiteVoz(element){
		let aceite_voz = element.aceite_voz[element.aceite_voz.length - 1];
		if(aceite_voz && aceite_voz.status != 'Validado' && aceite_voz.status != 'Recusado'){
			return "btn-audio";
		}
		if(aceite_voz && aceite_voz.status == 'Validado'){
			return "btn-audio-completed";
		}
		if(aceite_voz && aceite_voz.status == 'Recusado'){
			return "btn-audio-recused";
		}
		if(!aceite_voz){
			return "btn-audio-disabled";
		}
	}
	public classAceiteVozMobile(element){
		let aceite_voz = element.aceite_voz[element.aceite_voz.length - 1];
		if(aceite_voz && aceite_voz.status != 'Validado' && aceite_voz.status != 'Recusado'){
			return "btn-voice";
		}
		if(aceite_voz && aceite_voz.status == 'Validado'){
			return "btn-voice-completed";
		}
		if(aceite_voz && aceite_voz.status == 'Recusado'){
			return "btn-voice-recused";
		}
		if(!aceite_voz){
			return "btn-voice-disabled";
		}
	}

	public openAudio(aceite_voz){
		let matDialogConfig = new MatDialogConfig();
		matDialogConfig.maxWidth = 1000;
		matDialogConfig.maxHeight = 225;
		aceite_voz.is_modal_edit = this.functions.verificarPermissao(['aceite-voz-editar']);
		matDialogConfig.data = aceite_voz;
		matDialogConfig.panelClass = "modal-audio";
		let dialogRef:any = this.functions.openModal(ModalAceiteVozComponent,matDialogConfig);
		this.subs.add(
			dialogRef.componentInstance.response.subscribe((response:any) =>{
				if(response){
					this.pagination();
				}
			})
		);
	}


	public toggleMobile(element:Proposta){
		element.is_mobile_dropdown = !element.is_mobile_dropdown;
		this.cdr.detectChanges();
	}
	public toggleMoreMobile(){
		this.is_filter  = !this.is_filter;
		this.cdr.detectChanges();
	}

	public filterStatus(filter){
		this.typeSearch.status = filter;
		this.is_filter = false;
		this.pagination();
	}
	public filterPagamento(filter){
		this.typeSearch.pagamento_tipo_id = filter;
		this.is_filter = false;
		this.pagination();
	}

	public validatyPaymentOnline(proposta){
		if(proposta.pagamentos && proposta.pagamentos.length > 0){
			let pagamento = proposta.pagamentos.filter((p) => p.transacao_id == 1);
			if(
				pagamento.length > 0 && 
				this.list_pagamento_mensalidade &&
				this.list_pagamento_mensalidade.cadastramento_online &&
				this.list_pagamento_mensalidade.cadastramento_online.includes(pagamento[0].pagamento_tipo_id)
			){
				return true;
			}
		}
		return false;
	}

	public validatyPaymentOnlineClass(proposta){
		let pagamento = proposta.pagamentos.filter((p) => p.transacao_id == 1);
		if(pagamento.length > 0 && pagamento[0].status === 1){
			return "btn-audio-completed";
		}else{
			return "btn-audio";
		}
	}


	public validatyProposta(proposta){
		let is_valid = true;
		let modal_config:MatDialogConfig = new MatDialogConfig();
		modal_config.panelClass = "modal-audio";
		let status = STATUS_PROPOSTAS[2];
	
		if(is_valid){
			modal_config.data = {
				status : status,
				proposta : proposta
			};
			let modal_ref:any = this.dialog.open(ModalValidatePropostaComponent,modal_config);
			this.subs.add(
				modal_ref.componentInstance.response.subscribe((dados:any) =>{
					this.dialog.closeAll();
					this.pagination();
				})
			);
		}else{
			this.functions.printSnackBar("Essa proposta ainda existem pendência não resolvida.");
		}
	}

	ngOnDestroy(){
		this.subs.unsubscribe();
	}
}
