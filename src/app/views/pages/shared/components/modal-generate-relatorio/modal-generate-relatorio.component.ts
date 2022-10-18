import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription, of } from 'rxjs';
import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { URL_PDF } from './../../../../../api';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'kt-modal-generate-relatorio',
  templateUrl: './modal-generate-relatorio.component.html',
  styleUrls: ['./modal-generate-relatorio.component.scss']
})
export class ModalGenerateRelatorioComponent implements OnInit {
    @Output() response = new EventEmitter();
    private subs:Subscription = new Subscription();
    public title:string = "Gerar Relatório";
    public types:any = ["recusada","canal_vendas","diario","propostas_importadas","fechamento_caixa"];
    public path:string = "";
    public filename:string = "";
    public canais_vendas:any[] = [];
    public equipes:any[] = [];
    public vendedores:any[] = [];
    public form_class:any = {};
    public form:FormGroup = new FormGroup({
        data_inicio : new FormControl(null,[Validators.required]),
        data_fim : new FormControl(null,[Validators.required]),
        canal_vendas : new FormControl(null),
        adesao : new FormControl(null),
        equipe : new FormControl(null),
        vendedor : new FormControl(null),
    })
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ModalGenerateRelatorioComponent>,
        private functions:FunctionsService,
		private _http:HttpService
		) { }

    ngOnInit() {
        this.form_class = this.form.value;
        this.form_class.data_inicio = "item item-radius-tl-all item-radius-bl-lg-min item-radius-tr-md-max col-sm-12 col-lg-6";
        this.form_class.data_fim = "item item-margin-md-max item-border-lg item-radius-br-all item-radius-tr-lg-min item-radius-bl-xs-max col-sm-12 col-lg-6";
        if(!this.functions.isEmpty(this.data)){
            switch(this.data.type){
                case "recusada": {
                    this.title = "Gerar Relatório - Propostas recusadas";
                    this.path = "proposta-recusada";
                    this.filename = "propostas_recusadas_";
                    break;
                }
                case "assinatura" :{
                    this.title = "Gerar Relatório - Assinatura";
                    this.path = "/relatorio/assinatura";
                    this.filename = "relatorio_assinatura_";
                    this.form_class.data_inicio = "item item-radius-tl-all item-radius-bl-sm-min item-radius-tr-xs-max col-sm-6";
                    this.form_class.data_fim = "item item-border-sm item-radius-br-all item-radius-bl-xs-max item-radius-tr-sm-min col-sm-6";
                    break;
                }
                case "ficha_visita" :{
                    this.title = "Gerar Relatório - Ficha de visita";
                    this.path = "/relatorio/ficha-visita";
                    this.filename = "relatorio_ficha_visita_";
                    this.form_class.data_inicio = "item item-radius-tl-all item-radius-bl-sm-min item-radius-tr-xs-max col-sm-6";
                    this.form_class.data_fim = "item item-border-sm item-radius-br-all item-radius-bl-xs-max item-radius-tr-sm-min col-sm-6";
                    break;
                }
                case "canal_vendas": {
                    this.title = "Gerar Relatório - Canais de vendas";
                    this.path = "proposta-canal-vendas";
                    this.filename = "propostas_canais_vendas_";
                    this.form_class.data_inicio = "item item-radius-bl-md item-radius-bl-sm item-radius-tl-all item-radius-tr-xs-max  item-radius-bl-lg-min  col-sm-3 ";
                    this.form_class.data_fim = "item  item-border-sm   col-sm-4 col-lg-3";
                    this.form_class.canal_vendas = "item  item-border-sm   col-sm-4 col-lg-3";
                    this.form_class.adesao = "item  item-border-sm item-radius-br-all item-radius-tr-sm-min item-radius-bl-xs-max col-sm-4 col-lg-3";
                    break;
                }
                case "diario": {
                    this.title = "Gerar Relatório - Propostas diarias";
                    this.path = "proposta-diaria";
                    this.form_class.data_inicio = "item item-radius-tl-all item-radius-tr-xs-max col-sm-6";
                    this.form_class.data_fim = "item item-border-sm item-radius-tr-sm-min col-sm-6";
                    this.form_class.canal_vendas = "item item-margin-xs-min item-radius-bl-sm-min col-sm-3";
                    this.form_class.adesao = "item item-margin-xs-min item-border-sm col-sm-3";
                    this.form_class.equipe = "item item-margin-xs-min item-border-sm col-sm-3";
                    this.form_class.vendedor = "item item-margin-xs-min item-border-sm item-radius-br-all  item-radius-bl-xs-max col-sm-3";
                    this.filename = "propostas_aprovadas_";
                    break;
                }
                case "fechamento_caixa": {
                    this.title = "Gerar Relatório - Fechamento de Caixa";
                    this.path = "relatorio-caixa";
                    this.form_class.data_inicio = "item item-radius-tl-all item-radius-tr-xs-max col-sm-6";
                    this.form_class.data_fim = "item item-border-sm item-radius-tr-sm-min col-sm-6";
                    this.form_class.canal_vendas = "item item-margin-xs-min item-radius-bl-sm-min col-sm-3";
                    this.form_class.adesao = "item item-margin-xs-min item-border-sm col-sm-3";
                    this.form_class.equipe = "item item-margin-xs-min item-border-sm col-sm-3";
                    this.form_class.vendedor = "item item-margin-xs-min item-border-sm item-radius-br-all  item-radius-bl-xs-max col-sm-3";
                    this.filename = "propostas_fechamento_caixa";
                    break;
                }
                case "propostas_importadas": {
                    this.title = "Gerar Relatório - Propostas importadas ERP";
                    this.path = "proposta-status";
                    this.form_class.data_inicio = "item item-radius-bl-md item-radius-bl-sm item-radius-tl-all item-radius-tr-xs-max  item-radius-bl-lg-min  col-sm-6";
                    this.form_class.data_fim = "item  item-border-sm item-radius-br-all item-radius-tr-sm-min item-radius-bl-xs-max col-sm-6";
                    this.filename = "propostas_aprovadas_";
                    break;
                }
            }
        }
        this.getCanalVendas();
        this.getEquipes({cidade: localStorage.getItem("filial")});
        this.getVendedor();
        //funcao de autocomplete da tabela
        this.subs.add(
            this.form.get("canal_vendas").valueChanges.pipe(
                debounceTime(500),
                switchMap(value =>{
                    if(value !== null && typeof value !== 'object'){
                        this.getCanalVendas({q:value});
                    }
                    return of(null);
                })
            ).subscribe()
        );
        this.subs.add(
            this.form.get("equipe").valueChanges.pipe(
                debounceTime(500),
                switchMap(value =>{
                    if(value !== null && typeof value !== 'object'){
                        this.getEquipes({q:value,cidade: localStorage.getItem("filial")});
                    }
                    return of(null);
                })
            ).subscribe()
        );
        this.subs.add(
            this.form.get("vendedor").valueChanges.pipe(
                debounceTime(500),
                switchMap(value =>{
                    if(value !== null && typeof value !== 'object'){
                        this.getVendedor({q:value});
                    }
                    return of(null);
                })
            ).subscribe()
        );
    }
    

    public getCanalVendas(parameter?:any){
		this._http.get("canal-vendas",parameter).pipe(
			catchError((err,caught)=>{
				this.functions.printSnackBar(`Nenhum canal de vendas encontrado.`);
				return of(err);
			})
		).subscribe((response:any)=>{
			this.canais_vendas = response.canais_vendas;
		})
	}
    public getEquipes(parameter?:any){
		this._http.get("equipe",parameter).pipe(
			catchError((err,caught)=>{
				this.functions.printSnackBar(`Nenhuma equipe encontrada.`);
				return of(err);
			})
		).subscribe((response:any)=>{
			this.equipes = response.equipes;
		})
	}
    public getVendedor(parameter?:any){
		this._http.get("usuario",parameter).pipe(
			catchError((err,caught)=>{
				this.functions.printSnackBar(`Nenhumo usuário encontrado.`);
				return of(err);
			})
		).subscribe((response:any)=>{
			this.vendedores = response.usuarios;
		})
	}
    public generateRelatorio(){
        if(this.form.status != "INVALID"){
            let dados = this.getForm();
            let href = this.prepareHref(dados);
            window.open(href,"blank");    
        }else{
            this.functions.printSnackBar("Preencha os campos obrigatórios.")
        }
    }


    public getForm(){
        let date = new Date();
        let value:any  = this.form.value;
        value.data_inicio = this.functions.formatData(value.data_inicio,"YYYY-mm-dd");
        value.data_fim = this.functions.formatData(value.data_fim,"YYYY-mm-dd");
        value.token =localStorage.getItem("accessToken");
        value.date = this.functions.formatData(date,"dd-mm-YYYY");

        if(!this.functions.isEmpty(value.canal_vendas)){
            value.canal_vendas = value.canal_vendas.id;
        }
        if(!this.functions.isEmpty(value.equipe)){
            value.equipe = value.equipe.id;
        }
        if(!this.functions.isEmpty(value.vendedor)){
            value.vendedor = value.vendedor.id;
        }
        return value;
    }

    public prepareHref(dados:any){
        let data = new Date();
        let href = URL_PDF+this.path+"?data-inicio="+dados.data_inicio+"&data-fim="+dados.data_fim;
        let filial = localStorage.getItem("filial");
        if( dados.canal_vendas){
            href += "&canal-vendas="+dados.canal_vendas;
        }
        if(this.data.type == "propostas_importadas"){
            href += "&status=Aprovado";
        }
        if(dados.equipe){
            href += "&equipe="+dados.equipe;
        }
        if(dados.vendedor){
            href += "&vendedor="+dados.vendedor;
        }
        if(dados.adesao){
            href += "&adesao="+dados.adesao;
        }
        href += "&filial="+filial;
        href += "&token="+dados.token;
        data = this.functions.formatData(data,"dd-mm-YYYY")
        href += `&filename=${this.filename}${data}`;
        return href;
    }
    public preparePdf(href:string,dados:any){
        let url = `http://iwwapdf.iwwadigital.com.br/?url=${href}&filename=${this.filename}${dados.date}.pdf`;
        return url;
    }

    public displayFn(data?:any){
		return data ? data.nome : undefined;
    }

	onNoClick(){
		this.dialogRef.close();
	}

}
