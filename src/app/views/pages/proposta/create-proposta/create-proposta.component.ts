import { ActivatedRoute, Router } from '@angular/router';
import { Vida } from './../../../../core/_base/crud/models/class/vida.model';
import { PagamentoTipo } from './../../../../core/_base/crud/models/class/pagamento_tipo.model';
import { LISTA_BANCO } from './../../../../core/_base/crud/models/lista-bancos';
import { debounceTime, switchMap, catchError, tap } from 'rxjs/operators';
import { Tabela } from './../../../../core/_base/crud/models/class/tabela.model';
import { Produto } from './../../../../core/_base/crud/models/class/produto.model';
import { HttpService } from './../../../../core/_base/crud/services/http.service';
import { FunctionsService } from './../../../../core/_base/crud/utils/functions.service';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { Proposta } from './../../../../core/_base/crud/models/class/proposta.model';
import { of, Subscription, empty } from 'rxjs';
import { Pagamento } from './../../../../core/_base/crud/models/class/pagamento.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ModalDadosClinicosComponent } from './modal-dados-clinicos/modal-dados-clinicos.component';
import {
	trigger,
	state,
	style,
	animate,
	transition,
  } from '@angular/animations';
import { ModalMessageComponent } from './modal-message/modal-message.component';
import {TIPOS_PAMENTOS,LISTA_BANDEIRAS, TIPO_SERVICO_DESC_FOLHA_ID, LISTA_TIPO_CONTA,LISTA_TIPO_ADESAO, TIPO_SERVICO_TRT_FAMI_ID, TIPO_SERVICO_TRT_REGI_ID, LISTA_ESTADO, ADESAO_PAGAMENTO_ONLINE_ID, ESTADO_CIVIL,CORRETORA_ID} from './../../../../api';
import { TipoServico } from './../../../../core/_base/crud/models/class/tipo_servico.model';
import { validateCpf, validateCnpj, validateAutocomplete } from './../../../../core/_base/crud/utils/validate_cpf.service';
import { ModalEnderecoVidaComponent } from './modal-endereco/modal-endereco.component';
import { CanalVendas } from './../../../../core/_base/crud/models/class/canal_vendas.model';
import { ViewportScroller } from '@angular/common';
import { ModalAdesaoOnlineComponent } from '../../shared/components/modal-adesao-online/modal-adesao-online.component';
import { Usuario } from './../../../../core/_base/crud/models/class/usuario.model';
import { SeguroSaude } from './../../../../core/_base/crud/models/class/seguro_saude.model';


@Component({
    selector: 'kt-create-proposta',
	templateUrl: './create-proposta.component.html',
	styleUrls: ['./create-proposta.component.scss'],
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
export class CreatePropostaComponent implements OnInit, OnDestroy{
	private subs:Subscription = new Subscription();
	public current:number = 1;
	public limit:number = 5;
	public isLoading:boolean = false
	// FORMS
    public form:FormGroup;
	public date_actual:Date = new Date();
	public produtos:Produto[] = [];
	public tabelas:Tabela[]= [];
	public canais_vendas:CanalVendas[] = [];
	public tipos_servico:TipoServico[]= [];
	public pagamentos_tipos:PagamentoTipo[]= [];
	public seguros_saude:SeguroSaude[]= [];
	public vidas:FormArray;
	public proposta_id:number = null;
	public tabela:Tabela;
	public tabela_antiga:Tabela; // USADO QUANDO TEM INCLUSÃO
	public is_tabela_antiga:boolean = false;

	// REGRA NEGOCIO
	public btn_block_click:boolean = false; // BLOQUEIA O CLICK DO BOTÃO
	public valor_produto = null;
	public lista_bancos; // LISTA DE BANCO PARA USAR NA ADESÃO
	public lista_bancos_other; // LISTA DE BANCO PARA USAR NA MENSALIDADE
	public lista_bancos_backup;
	public dont_phone:boolean = false; // USADO PARA CONTROLAR QUANDO NÃO TEM CELULAR
	public numero_serie:number =  Math.floor(Math.random() * (10000 - 1 + 1));
	public data_vencimento:number[] = [5,10,15,20,25,30];
	public list_filiais:any[] = []
	public is_matricula_titular:boolean = false; // SE TEM MATRICULA TICULAR VALIDADA
	public control_dependent_matricular:boolean = false; // Controle para só adicionar um dependente quando passar de pagina(Quando tiver matricula)
	public is_cpf_valid:boolean = false;
	public titular_e_menor:boolean = false; // SE O TITULAR É DE MENOR OU NÃO
	public is_cobranca:boolean = false; // CASO SEJA DE MENOR, ATIVARA ESSA FLAG
	public is_rascunho:boolean = false;
	public lista_estado_civil:any;

	public validade_matricula:boolean = true;  // DETECTA VALIDADE DA MATRICULA
	public is_endereco_valido:boolean = true;  // DETECTA VALIDADE DO ENDERECO

	public data_minima = new Date("01/01/1900 00:00");
	public data_maxima = new Date();

	public qtd_vidas:number; // QTD VIDAS DA INCLUSAO DA MATRICULA
	public can_load_data:boolean = false;
	public is_desc_folha:boolean = false; // CASO O TIPO SERVIÇO ESCOLHIDO SEJA DESCONTO EM FOLHA

	//Anexo
	public midias:any = [];
	public showAnexo:boolean = true;
	// ACEITE/ASSINATURA
	public is_assinatura:boolean = false;
	public is_aceite_voz:boolean = false;
	public is_assinatura_presencial:boolean = false;
	public is_anexa_arquivos:boolean = false;
	public is_ficha_visita:boolean = false;

	public show_btn_ficha_visita:boolean = true;

	public form_assinatura = new FormGroup({
		is_assinatura_presencial : new FormControl(false)
	})
	
	public tipos_pagamento:any = [];
	public lista_adesao:any[] = [];

	public lista_tipo_conta:any[] = [];
	public lista_bandeiras:any[] = [];
	public list_tipo_servico_ids = [];

	public list_estado = [];

	public regra_negocio_adesao:string;
	public regra_negocio_mensalidade:string;

	//PAGAMENTO NO Site
	public url_payment:string = "";
	public url_payment_inclusion:string = "";
	public has_payment:boolean = false;

	public tipo_servico_trt:number;
	public proposta:Proposta;
	public adesao:any = {};
	public mensalidade:any = {};
	public corretora_id = CORRETORA_ID;
	public usuario:Usuario;
	public refreshPayment:boolean = false;
    constructor(
		private formBuilder:FormBuilder,
		private functions:FunctionsService,
		private _http:HttpService,
		private dialog:MatDialog,
		private route:ActivatedRoute,
		private router:Router,
		private cdr:ChangeDetectorRef,
		private viewportScroller: ViewportScroller
	){}

    ngOnInit(){
		let lista = LISTA_ESTADO;
		for(let estado in lista){
			this.list_estado.push(lista[estado]);
		}
		this.usuario = this.functions.getUsuario();
		let filial = localStorage.getItem("filial");
		this.getRegrasNegocio({filial: filial});
		let validators_inclusao = new Proposta().getValidatorsInclusao();
		if(this.usuario.equipes.length > 0){
			let cidades =  [];
			this.usuario.equipes.map(equipe => {
				if(cidades.indexOf(equipe.cidade) == -1){	
					cidades.push(equipe.cidade);
				}
			})
			this.list_filiais =	cidades;
		}else{
			this.list_filiais.push(this.usuario.equipe.cidade);
		}

		this.form = this.formBuilder.group(new Proposta);
		if(!filial){
			filial = "Salvador";
		}
		this.form.patchValue({
			"filial" : filial
		});
		let ano = new Date();
		let param_tabela:any = {filial: filial};
		if(filial != "São Luis"){
			param_tabela.ano =  ano.getFullYear();
		}
		this.getTabela(param_tabela);
		this.getSeguroSaude(param_tabela);
		this._http.get("pagamento-tipo",{filial:filial}).subscribe((response:any)=>{
			this.pagamentos_tipos = response.pagamentos_tipos;
			this.cdr.detectChanges();
		});
		


		this.form.addControl('tabela',new FormControl({value:null,disabled:false}));
		this.form.addControl('tabela_matricula_titular',new FormControl(null));
		this.form.addControl('canal_vendas',new FormControl(null,[Validators.required,validateAutocomplete]));
		this.form.addControl('tipo_servico',new FormControl(null,[Validators.required,validateAutocomplete]));
		// this.form.addControl('produto',new FormControl({value:null,disabled:true}));
		let adesao = new Pagamento({transacao_id:1});
		let mensalidade = new Pagamento({transacao_id:2,correspondencia:'titular',pagamento_data_vencimento:null,periodicidade:null});
		// Cria Adesao e Mensalidade
		this.form.addControl("adesao",this.formBuilder.group(adesao));
		this.form.addControl("mensalidade",this.formBuilder.group(mensalidade));
		// Cria vidas e pega o titula e anexa a uma delas
		this.form.addControl("vidas",new FormArray([]));
		this.vidas = this.form.get("vidas") as FormArray;
		this.vidas.push(this.formBuilder.group(new Vida({is_titular:1}))) // Adiciono o titular

		// Coloca Validacoes na proposta
		let validators_proposta = new Proposta().getValidators();
		validators_proposta.map(el =>{
			this.form.get(el.key).setValidators(el.validators);
		});
		// GET TIPO SERVICO
		let parameter_tipo_servico:any = {};
		if(filial){
			parameter_tipo_servico.filial = filial;
		}
		this.getTiposServico(parameter_tipo_servico);
		this.getTipoServicoSaeb();
		// GET CANAL VENDAS
		this.getCanalVendas();

		this.subs.add(
			this.form.get("matricula_titular").valueChanges.pipe(
				tap(()=>{
					this.validade_matricula = false;
				}),
				debounceTime(1000),
				switchMap(value =>{

					if(!this.functions.isEmpty(this.form.get("filial").value)){
						if(!this.functions.isEmpty(value)){
							this.isLoading = true;
							this.cdr.detectChanges();
							this._http.get("proposta-web-service",{matricula : value,filial :this.form.get("filial").value}).subscribe((response:any) =>{
								this.retirarValidacaoFormularioInclusao();
								
								this.is_matricula_titular = true;
								setTimeout(() => {
									this.isLoading = false;
									this.cdr.detectChanges();
								}, 1000);
								response.proposta.correspondencia = "titular";
								response.proposta.data_nascimento = this.functions.formatData(response.proposta.data_nascimento,"YYYY-mm-dd");
								this.form.patchValue(response.proposta);
								if(!this.is_tabela_antiga){
									this.tabela_antiga = response.proposta.tabela;
								}
								
								this.qtd_vidas = response.proposta.qtd_vidas;
								this.form.get("tabela").disable();
								this.validade_matricula = true;
								this.cdr.detectChanges();
							},(erro:any) =>{
								this.retirarValidacaoFormularioInclusao(false);
								let matconfig = new MatDialogConfig();
								this.form.get("matricula_titular").patchValue("");
								this.form.get("tabela").enable();
								this.clear();
								this.is_matricula_titular = false;
								this.isLoading = false;
								this.qtd_vidas = null;
								matconfig.panelClass = 'modal-proposta-criada';
								matconfig.data = {
									icon : "./assets/vitalmed/icone_Assinatura_rejeitada.svg",
									response : {
										message : "Matrícula não encontrada.<br/> No momento não será possível fazer uma inclusão em um contrato existente. <br/><b>Verifique se o número digitado está correto ou tente novamente mais tarde.</b>",
									}
								}
								this.dialog.open(ModalMessageComponent,matconfig)
							
								// this.functions.printMsgError(erro);
								this.validade_matricula = true;
								this.cdr.detectChanges();
							})
						}else{
							this.clear();
							this.is_matricula_titular = false;
							this.isLoading = false;
							this.validade_matricula = true;
							this.retirarValidacaoFormularioInclusao(false);
							this.cdr.detectChanges();
						}
						
					}else{
						this.functions.printSnackBar("Filial não escolhida.");
					}
					return of(value);
				})
			).subscribe()
		);

		//funcao de autocomplete da tabela
		this.subs.add(
			this.form.get("tabela").valueChanges.pipe(
				debounceTime(500),
				switchMap(value =>{
					if(value !== null && typeof value !== 'object'){
						let params:any ={q:value,filial: this.form.value.filial};
						
						if(this.is_matricula_titular){
							params.ano = new Date().getFullYear();
						}
						this.getTabela(params);
					}
					if(typeof value === 'object' && !this.functions.isEmptyObj(value)){
						this.tabela = value;
						// this.form.get("produto").enable();
						// this.getProdutos({tabela_id: value.id});
					}
					return of(null);
				})
			).subscribe()
		);
		//funcao de autocomplete da seguro saude
		this.subs.add(
			this.form.get("seguro_saude").valueChanges.pipe(
				debounceTime(500),
				switchMap(value =>{
					if(value !== null && typeof value !== 'object'){
						let params:any = {q:value,filial: this.form.value.filial};
						this.getSeguroSaude(params);
					}
					return of(null);
				})
			).subscribe()
		);
		//funcao de autocomplete da tabela_matricula_titular
		this.subs.add(
			this.form.get("tabela_matricula_titular").valueChanges.pipe(
				debounceTime(500),
				switchMap(value =>{
					if(value !== null && typeof value !== 'object'){
						let params:any ={
							q:value,
							filial: this.form.value.filial,
							ano : new Date().getFullYear()
						};
						if(this.form.value.filial != "São Luis"){
							params.filial = this.form.value.filial;
						}
						this.getTabela(params);
					}
					if(typeof value === 'object' && !this.functions.isEmptyObj(value)){
						this.tabela = value;
						this.applyDesconto();
					}
					return of(null);
				})
			).subscribe()
		);
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
		//funcao de autocomplete da tipo_servico
		this.subs.add(
			this.form.get("tipo_servico").valueChanges.pipe(
				debounceTime(500),
				switchMap(value =>{
					if(value !== null && typeof value !== 'object'){
						this.getTiposServico({q:value,filial:this.form.value.filial});
					}
					if(typeof value === 'object' && !this.functions.isEmptyObj(value)){
						if(this.list_tipo_servico_ids.includes(value.id) || value.id === this.tipo_servico_trt){
							if(this.list_tipo_servico_ids.includes(value.id)){
								this.form.get("adesao").patchValue({
									valor : 0,
									pagamento_tipo_id : 1
								})
								this.is_desc_folha = true;
								
								this.form.get("mensalidade").patchValue({
									pagamento_data_vencimento : 2
								});
								this.data_vencimento[6] = 2;
							}
							if(value.id === this.tipo_servico_trt ){
								this.form.get("mensalidade").patchValue({
									pagamento_data_vencimento : 25
								});
							}
							this.form.get("mensalidade").get("pagamento_data_vencimento").disable();
						}else{
							this.form.get("mensalidade").patchValue({
								pagamento_data_vencimento : null
							});
							this.form.get("mensalidade").get("pagamento_data_vencimento").enable();
							delete this.data_vencimento[6];
						}
					}
					return of(null);
				})
			).subscribe()
		);
				
		// Pesquisa pelo cep
		this.subs.add(
			this.form.get('titular_cep').valueChanges.pipe(
				debounceTime(250),
				switchMap((value:string) =>{
					if(!this.functions.isEmpty(value) && typeof value === 'string' && value.length === 8 && !this.is_matricula_titular){
						this.isLoading = true;
						this.cdr.detectChanges();
						this._http.get(`search-cep/${value}`).subscribe((response:any) =>{
							if(response.success != undefined && !response.success){
								this.functions.printSnackBar("Endereço está na blacklist");
								this.is_endereco_valido = false;
								return;
							}else{
								this.is_endereco_valido = true;
							}
							if(response.bairro || response.localidade || response.logradouro){
								this.form.patchValue({
									titular_endereco_bairro : response.bairro,
									titular_cidade : response.localidade,
									titular_uf : this.functions.getEstado(response.uf)
								});
								if(!this.is_matricula_titular){
									this.form.patchValue({
										titular_endereco_rua : response.logradouro,
									});
								}
							}
							this.isLoading = false;
							this.cdr.detectChanges();
						},(erro:any) =>{
							this.functions.printMsgError(erro);
							this.isLoading = false;
							this.cdr.detectChanges();
						})

					}
					return of(value);
				})
			).subscribe()
		);
		this.subs.add(
			this.form.get("titular_data_nascimento").valueChanges.pipe(
				debounceTime(250),
				switchMap((value:any) =>{
					if(!this.functions.isEmpty(value) && ((typeof value._i == 'string' && value._i.length >= 8) ||  (typeof value._i == "object")) ){
						let idade = this.functions.idade(new Date(value));
						if(idade < 18){
							this.titular_e_menor = true;
							this.form.get("titular_cpf").clearValidators();
							this.form.get("titular_cpf").setValidators([validateCpf]);
							this.form.get("titular_cpf").updateValueAndValidity();
						}else{
							this.titular_e_menor = false;
							this.form.get("titular_cpf").setValidators([Validators.required,validateCpf]);
							this.form.get("titular_cpf").updateValueAndValidity();
						}
						this.cdr.detectChanges();
					}
					return of(value);
				})
			).subscribe()
		);
		this.subs.add(
			this.form.get("titular_cpf").valueChanges.pipe(
				debounceTime(250),
				switchMap((value:string) =>{
					if(!this.functions.isEmpty(value) && value.length == 11){
						if(!this.functions.validarCPF(value)){
							this.functions.printSnackBar("CPF é inválido.");
						}else{
							let params = {
								cpf : value,
								filial : this.form.get("filial").value,
								tipo_servico_id : this.form.get("tipo_servico").value.id
							}
							if(!this.is_matricula_titular){
								this._http.get("validar-cpf",params).subscribe((validacao:any) =>{
									if(validacao.validacao == 1){
										this.functions.printSnackBar("CPF já está cadastrado no sistema.");
										this.is_cpf_valid = true;
									}else{
										this.is_cpf_valid = false;
									}
								})
							}
						}
					}else{
						this.is_cpf_valid = false;
					}
					return of(value);
				})
			).subscribe()
		);


		// CHECK BANCO
		let adesao_form = this.form.get("adesao");
		this.subs.add(
			adesao_form.get("banco").valueChanges.pipe(
				debounceTime(250),
				switchMap((value:string) =>{
					if(!this.functions.isEmpty(value) && this.handleTipoConta("adesao")){
						adesao_form.get("conta_tipo").setValidators([Validators.required]);
						adesao_form.get("conta_tipo").updateValueAndValidity();
					}else{
						adesao_form.get("conta_tipo").clearValidators();
						adesao_form.get("conta_tipo").updateValueAndValidity();
						adesao_form.get("conta_tipo").patchValue(null);						
					}
					return of(value);
				})
			).subscribe()
		);
		this.subs.add(
			adesao_form.get("cep_pagador").valueChanges.pipe(
				debounceTime(250),
				switchMap((value:string) =>{
					if(!this.functions.isEmpty(value) && typeof value === 'string' && value.length === 8){
						this.cdr.detectChanges();
						this._http.get(`search-cep/${value}`).subscribe((response:any) =>{
							adesao_form.patchValue({
								rua_pagador : response.logradouro,
								bairro_pagador : response.bairro,
								cidade_pagador : response.localidade,
								estado_pagador : this.functions.getEstado(response.uf)
							});
							this.cdr.detectChanges();
						},(erro:any) =>{
							this.functions.printMsgError(erro);
							this.cdr.detectChanges();
						})
					}
					return of(value);
				})
			).subscribe()
		);
		let mensalidade_form = this.form.get("mensalidade");
		this.subs.add(
			mensalidade_form.get("banco").valueChanges.pipe(
				debounceTime(250),
				switchMap((value:string) =>{
					if(!this.functions.isEmpty(value) && this.handleTipoConta("mensalidade")){
						mensalidade_form.get("conta_tipo").setValidators([Validators.required]);
						mensalidade_form.get("conta_tipo").updateValueAndValidity();
					}else{
						mensalidade_form.get("conta_tipo").clearValidators();
						mensalidade_form.get("conta_tipo").updateValueAndValidity();
						mensalidade_form.get("conta_tipo").patchValue(null);						
					}
					return of(value);
				})
			).subscribe()
		);
		this.subs.add(
			mensalidade_form.get("cobranca_cep").valueChanges.pipe(
				debounceTime(250),
				switchMap((value:string) =>{
					if(!this.functions.isEmpty(value) && typeof value === 'string' && value.length === 8){
						this.cdr.detectChanges();
						this._http.get(`search-cep/${value}`).subscribe((response:any) =>{
							mensalidade_form.patchValue({
								cobranca_endereco_rua : response.logradouro,
								cobranca_endereco_bairro : response.bairro,
								cobranca_cidade : response.localidade,
								cobranca_uf : this.functions.getEstado(response.uf)
							});
							this.cdr.detectChanges();
						},(erro:any) =>{
							this.functions.printMsgError(erro);
							this.cdr.detectChanges();
						})
					}
					return of(value);
				})
			).subscribe()
		);
		//Validacao CPF
		this.subs.add(
			mensalidade_form.get("cobranca_cpf").valueChanges.pipe(
				debounceTime(250),
				switchMap((value:string) =>{
					if(!this.functions.isEmpty(value) && value.length == 11){
						if(!this.functions.validarCPF(value)){
							this.functions.printSnackBar("CPF é inválido.");
						}
					}
					return of(value);
				})
			).subscribe()
		);
		this.subs.add(
			mensalidade_form.get("cobranca_cnpj").valueChanges.pipe(
				debounceTime(250),
				switchMap((value:string) =>{
					if(!this.functions.isEmpty(value) && value.length == 14){
						if(!this.functions.validarCNPJ(value)){
							this.functions.printSnackBar("CNPJ é inválido.");
						}
					}
					return of(value);
				})
			).subscribe()
		);
		this.subs.add(
			mensalidade_form.get("cobranca_tipo_pessoa").valueChanges.subscribe((value:any) => {
				if(value == 1 ){
					mensalidade_form.get("cobranca_cnpj").clearValidators();
					mensalidade_form.get("cobranca_cnpj").updateValueAndValidity();
					mensalidade_form.get("cobranca_cnpj").patchValue(null);
					mensalidade_form.get("cobranca_cpf").setValidators([Validators.required,validateCpf]);
					mensalidade_form.get("cobranca_cpf").updateValueAndValidity();
					
				}else{
					mensalidade_form.get("cobranca_cpf").clearValidators();
					mensalidade_form.get("cobranca_cpf").updateValueAndValidity();
					mensalidade_form.get("cobranca_cpf").patchValue(null);
					mensalidade_form.get("cobranca_cnpj").setValidators([Validators.required,validateCnpj]);
					mensalidade_form.get("cobranca_cnpj").updateValueAndValidity();
					mensalidade_form.get('cobranca_sexo').patchValue('3');
				}
			})
		);
		// RASCUNHO
		this.subs.add(
			this.route.queryParams.subscribe((params:any)=>{
				if(!this.functions.isEmpty(params.numero_serie)){
					this.numero_serie = params.numero_serie;
					let proposta = this.getPropostaRascunho(params.numero_serie);
					if(proposta){
						this.setForm(proposta);
					}
				}
			})
		);
		// FILIAL ATUALIZANDO
		this.subs.add(
			this.functions.$filial.subscribe((value) =>{
				if(this.current == 1 && typeof value == "string"){
					let change_value:any = {
						filial: value,
						tipo_servico:null
					};
					
					this.getTiposServico({filial:value});
					this.getTabela({filial:value});
					this.getRegrasNegocio({filial:value});
					this.getSeguroSaude({filial:value});
					// if(this.form.get('tipo_servico').value){
					// 	this.getTabela({filial:value});
					// }
					change_value.tabela = null;
					this.form.patchValue(change_value);
				}
			})	
		);
    }
	// REGRAS NEGOCIOS ------------------------------------------------------------------------------------------------------------
	public getRegrasNegocio(params?:any){
		this._http.get("lista/all",params).subscribe((resp:any) => {
			this.tipos_pagamento = resp.pagamentos;
			this.lista_adesao = resp.adesoes;
			this.lista_tipo_conta = resp.contas;
			this.lista_bandeiras = resp.cartoes;
			this.lista_bancos = resp.bancos; 
			this.lista_bancos_other = resp.bancos;
			this.lista_bancos_backup = resp.bancos;
			this.tipo_servico_trt = resp.regra_negocio.tipo_servico_trt_regi_id;
			this.regra_negocio_adesao = resp.regra_negocio.adesao;
			this.regra_negocio_mensalidade = resp.regra_negocio.mensalidade;
			this.lista_estado_civil = resp.estados_civil;
		},(e:any) =>{
			this.tipos_pagamento = TIPOS_PAMENTOS;
			this.lista_adesao = LISTA_TIPO_ADESAO;
			this.lista_tipo_conta = LISTA_TIPO_CONTA;
			this.lista_bandeiras = LISTA_BANDEIRAS;
			this.lista_estado_civil = ESTADO_CIVIL;
		})
	}

	public getTabela(parameter?:any){
		this._http.get("tabela",parameter).pipe(
			catchError((err,caught)=>{
				this.functions.printSnackBar(`Nenhuma tabela encontrada.`);
				return of(err);
			})
		).subscribe((response:any)=>{
			this.tabelas = response.tabelas;
		})
	}

	public getSeguroSaude(parameter?:any){
		this._http.get("seguro-saude",parameter).pipe(
			catchError((err,caught)=>{
				this.seguros_saude = [];
				this.functions.printSnackBar(`Nenhum seguro saúde encontrada.`);
				return of(err);
			})
		).subscribe((response:any)=>{
			this.seguros_saude = response.seguros_saude;
		})
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

	public getTiposServico(parameter?:any){
		this._http.get("tipo-servico",parameter).pipe(
			catchError((err,caught)=>{
				this.functions.printSnackBar(`Nenhum tipo de servico encontrado.`);
				return of(err);
			})
		).subscribe((response:any)=>{
			this.tipos_servico = response.tipos_servico;
			this.cdr.detectChanges();
		})
	}

	public getProdutos(parameter?:any){
		
		this._http.get("produto",parameter).pipe(
				catchError((err,caught)=>{
					this.functions.printSnackBar(`Nenhuma produto encontrada.`);
					return of(err);
				})
			).subscribe((response:any)=>{
			this.produtos = response.produtos;
		})
	}

	public checkIsRequired(){
		let current_id:any = document.getElementById(`${this.current}`);
		// let classNames = current_id.querySelectorAll("ng-invalid");
		let classNames = current_id.getElementsByClassName("ng-invalid");
		// return true; // TESTE
		if(classNames.length > 0){
			for(let i = 0; i < classNames.length ; i++){
				classNames[i].classList.add("mat-form-field-invalid");
			}
			return false;
		}
		if(this.current == 2){
			let form = this.form.value;
			if(this.functions.isEmpty(form.matricula_titular) && this.functions.isEmpty(form.titular_tel_residencial) && this.functions.isEmpty(form.titular_tel_comercial) && this.functions.isEmpty(form.titular_tel_celular)){
				this.dont_phone = true;
				return false;
			}
		}
		return true;
	}

	public displayFn(data?:any){
		return data ? data.nome : undefined;
	}

	public displayFnFilial(data?:any){
		return data ? data.cidade : undefined;
	}
	public displayFnSeguroSaude(data?:any){
		return data ? data.codigo+" - "+data.nome : undefined;
	}

	public getTipoServicoSaeb(){
		this._http.get("tipo-servico/get/desconto-saeb").subscribe((resp:any) => {
			this.list_tipo_servico_ids = resp.tipos_servicos_ids;
		});
	}
	
	// FORMULARIO ------------------------------------------------------------------------------------------------------------
	public create(){
		this.btn_block_click = true;
		this.cdr.detectChanges();
		if(this.form.status !== "INVALID"){
			this.deletePropostaRascunho();
			let proposta = this.getForm();
			if(this.titular_e_menor && !this.is_cobranca){
				this.functions.printSnackBar("Preencha o campo de cobrança!")
				this.btn_block_click = false;
				this.cdr.detectChanges();
				return ;
			}
			if(this.is_matricula_titular && !this.checkEnderecoVida()){
				this.functions.printSnackBar("Preencha os campos de endereço da vida!")
				this.btn_block_click = false;
				this.cdr.detectChanges();
				return ;
			}
			if(!this.verificaCpfWebServiceVidas()){
				this._http.post("proposta",proposta).subscribe((response:any)=>{
					this.current = 6;
					this.accordion("assinatura");
					// let id = response.proposta.id;
					this.proposta = response.proposta;
					this.proposta_id = response.proposta.id;
					this.url_payment = response.proposta.url_payment;
					this.url_payment_inclusion = response.proposta.url_payment_inclusion;
					if(this.form.value.adesao){
						let adesao = this.form.value.adesao;
						let mensalidade  = this.form.value.mensalidade;
						if(adesao.pagamento_tipo_id == 3 || 
							adesao.pagamento_tipo_id == ADESAO_PAGAMENTO_ONLINE_ID || 
							mensalidade.pagamento_online == 1 || 
							this.form.value.matricula_titular != null
							// this.verificaTipoPagamento({id: mensalidade.pagamento_tipo_id},"cadastramento_online")
						){
							this.has_payment = true;
						}
					}
					this.refreshPayment = true;
					this.cdr.detectChanges();
					this.btn_block_click = false;
					this.cdr.detectChanges();
	
				},(erro:any) =>{
					this.functions.printMsgError(erro);
					this.btn_block_click = false;
					this.cdr.detectChanges();
				});
			}else{
				this.functions.printSnackBar("CPF já está cadastrado no sistema!");
				this.btn_block_click = false;
				this.cdr.detectChanges();
			}
		}else{
			this.functions.printSnackBar("Prencha os campos obrigatórios!")
			this.btn_block_click = false;
			this.cdr.detectChanges();
		}
	}

	public getForm(){
		let proposta:Proposta = new Proposta(this.form.getRawValue());
		let pagamento_mensalidade = this.form.get("mensalidade").value;
		let pagamento_adesao = this.form.get("adesao").value;

		this.adesao = pagamento_adesao;
		this.mensalidade = pagamento_mensalidade;

		proposta.numero_serie = this.numero_serie;
		proposta.pagamentos = [];
		proposta.filial = this.form.get("filial").value;
		proposta.tabela_id = this.form.get("tabela").value.id;
		if(!this.functions.isEmpty(this.form.get("tabela_matricula_titular").value)){
			proposta.tabela_id = this.form.get("tabela_matricula_titular").value.id;
		}
		proposta.canal_venda_id = this.form.get("canal_vendas").value.id;
		proposta.vidas = this.vidas.getRawValue();

		if(!this.functions.isEmpty(proposta.titular_data_nascimento)){
			if(typeof proposta.titular_data_nascimento == "string"){
				proposta.titular_data_nascimento = proposta.titular_data_nascimento+" 00:00:00";
			}
			proposta.titular_data_nascimento = this.functions.formatData(new Date(proposta.titular_data_nascimento),"YYYY-mm-dd");
		}

		proposta.vidas.map(el => {
			el.data_nascimento = this.functions.formatData(new Date(el.data_nascimento),"YYYY-mm-dd");
			if(!this.functions.isEmpty(el.seguro_saude) && typeof el.seguro_saude == 'object'){
				el.seguro_saude_id = el.seguro_saude.id;
			}
		})
		if(!this.is_matricula_titular){
			proposta.pagamento_data_vencimento = this.form.getRawValue().mensalidade.pagamento_data_vencimento;
			proposta.pagamento_forma = this.form.get("mensalidade").value.periodicidade
			proposta.pagamentos.push(this.getValuesPagamento("adesao"));
			proposta.pagamentos.push(this.getValuesPagamento("mensalidade"));
			proposta.correspondencia = this.form.get("mensalidade").value.correspondencia;
		}

		if(!this.functions.isEmpty(proposta.seguro_saude) && typeof proposta.seguro_saude == 'object'){
			proposta.seguro_saude_id = proposta.seguro_saude.id;
			proposta.titular_seguro_saude = null;
		}

		proposta.tipo_servico_id = this.form.get("tipo_servico").value.id;

		if(proposta.correspondencia === "outra_pessoa"){
			let newPag = new Pagamento(this.form.get("mensalidade").value).getCobranca();
			if(newPag.cobranca_nascimento){
				let idade = this.functions.idade(new Date(newPag.cobranca_nascimento));
				newPag.cobranca_nascimento = this.functions.formatData(new Date(newPag.cobranca_nascimento),"YYYY-mm-dd");
				if(idade < 18){
					this.is_cobranca = false;
				}else{
					this.is_cobranca = true;
				}
			}
			proposta = Object.assign(proposta, newPag);			
			
		}else{
			this.is_cobranca = false;
		}

		
		if(!this.functions.isEmpty(pagamento_mensalidade.observacao)){
			proposta.observacoes = pagamento_mensalidade.observacao;
		}
		
		if(pagamento_adesao.pagamento_tipo_id == 1){
			if(pagamento_adesao.fiador == "1"){
				proposta.pagamentos[0].nome_pagador = proposta.titular_nome;
				proposta.pagamentos[0].telefone_pagador = proposta.titular_tel_residencial;
				proposta.pagamentos[0].rua_pagador = proposta.titular_endereco_rua;
				proposta.pagamentos[0].bairro_pagador = proposta.titular_endereco_bairro;
				proposta.pagamentos[0].cidade_pagador = proposta.titular_cidade;
				proposta.pagamentos[0].estado_pagador = proposta.titular_uf;
				proposta.pagamentos[0].complemento_pagador = proposta.titular_endereco_complemento;
				proposta.pagamentos[0].numero_endereco_pagador = proposta.titular_numero;
				proposta.pagamentos[0].cep_pagador = proposta.titular_cep;
			}
		}

		//SE FOR RASCUNHO
		if(this.is_rascunho){
			proposta.status = "Rascunho";
		}

		return proposta;
	}

	public setForm(proposta:Proposta){
		this.form.patchValue(proposta);
		if(proposta.vidas.length > 0){
			proposta.vidas.map(el => {
				if(el.is_titular != 1){
					this.vidas.push(this.formBuilder.group(new Vida(el)));
					this.setValidatorsVidas();
				}
			});
		}
		this.cdr.detectChanges();
	}

	public prev(){
		if(this.current == 2){
			this.can_load_data = false;
		}
        if(this.current - 1 < 1){
            this.current = 1
        }else{
            this.current--;
        }
    }

    public next(){
		if(this.current + 1 === 3){
			let vida:Vida = new Vida();
			vida.is_titular = 1;
			vida.id = this.functions.generateAlphaNumeric();
			vida.nome = this.form.value.titular_nome;
			// vida.sexo = this.form.value.titular_sexo;
			vida.sexo = this.form.getRawValue().titular_sexo;
			// vida.data_nascimento = this.form.value.titular_data_nascimento;
			vida.data_nascimento = this.form.getRawValue().titular_data_nascimento;
			vida.cpf = this.form.value.titular_cpf;
			vida.rua = this.form.value.titular_endereco_rua;
			vida.cep = this.form.value.titular_cep;
			vida.bairro = this.form.value.titular_endereco_bairro;
			vida.cidade = this.form.value.titular_cidade;
			vida.estado = this.form.value.titular_uf;
			vida.numero = this.form.value.titular_numero;
			vida.estado_civil = this.form.getRawValue().titular_estado_civil;
			vida.tel_residencial = this.form.value.titular_tel_residencial;
			vida.tel_comercial = this.form.value.titular_tel_comercial;
			vida.tel_celular = this.form.value.titular_tel_celular;
			vida.complemento = this.form.value.titular_endereco_complemento;
			vida.referencia = this.form.value.titular_endereco_referencia;
			vida.email = this.form.value.titular_urgencia_email;
			vida.tel_responsavel_tit = this.form.value.titular_urgencia_telefone;
			vida.responsavel_tit = this.form.value.titular_urgencia_contato_nome;
			vida.nome_preposto = this.form.value.nome_preposto;
			vida.cpf_preposto = this.form.value.cpf_preposto;
			if(!this.functions.isEmpty(this.form.value.seguro_saude)){
				vida.seguro_saude_id = this.form.value.seguro_saude.id;
			}
			this.vidas.controls[0].patchValue(vida);
			this.applyDesconto();
			if(this.functions.isEmpty(this.form.get("matricula_titular").value) ){
				this.vidas.controls[0].get("valor").setValidators(Validators.required);
			}else{
				this.vidas.controls[0].get("valor").clearValidators();
				this.vidas.controls[0].get("valor").updateValueAndValidity();
			}
		}
		this.getValorTotal();
		if(!this.is_desc_folha){
			this.form.get("adesao").patchValue({
				valor: this.valor_produto
			});
		}
		this.form.get("mensalidade").patchValue({
			valor: this.valor_produto
		});
		let endreco_preenchido = this.checkEnderecoVida();
		if(this.is_endereco_valido && this.checkIsRequired() && !this.verificaCpfWebServiceVidas() && endreco_preenchido && !this.is_cpf_valid && this.validade_matricula){
			let proposta = this.getForm();
			if(this.current + 1 > this.limit){ // SE A ATUAL + 1 FOR MAIOR QUE LIMITE, RECEBE LIMITE
				this.current = this.limit;
			}else{ // SE NÃO PASSA DE PAGE
				// this.current++;

				if(!this.functions.isEmpty(proposta.matricula_titular)){ 
					this.is_matricula_titular = true;
					if(this.current + 1 == 3 && !this.control_dependent_matricular){
						this.addDepented();
						this.control_dependent_matricular = true;
					}
				}else{
					//Seto a validacao dos pagamentos só se n for do tipo inclusao
					let validators_pagamento = new Pagamento().getValidators();
					validators_pagamento.map(el =>{
						let ad = this.form.get("adesao");
						let mens = this.form.get("mensalidade");
						ad.get(el.key).setValidators(el.validators);
						mens.get(el.key).setValidators(el.validators);
					})
				}
				if(this.is_desc_folha && (this.current + 1 == 4)){
					this.current = 5;
				}else{
					this.current++;
				}
			}

			
			this.setPropostaRascunho(proposta);

			//ROLAR SCOLL
			document.getElementById("kt_scrolltop").click();

		}else{
			if(!this.is_endereco_valido){
				this.functions.printSnackBar("CEP está na blacklist.")
				return;
			}
			if(this.is_cpf_valid || this.verificaCpfWebServiceVidas()){
				this.functions.printSnackBar("CPF já está cadastro no sistema.")
			}else{
				if(!endreco_preenchido){
					this.functions.printSnackBar("Preencha os campos de endereço da vida.");
				}else{
					if(this.dont_phone){
						this.dont_phone = false;
						this.functions.printSnackBar("Preencha ao menos um telefone.");
					}else{
						this.functions.printSnackBar("Preencha os campos obrigatório.");
					}
				}
			}
		}
	}

	// VIDAS ------------------------------------------------------------------------------------------------------------
	public addDepented(){
		this.vidas.push(this.formBuilder.group(new Vida({is_titular:0,id:this.functions.generateAlphaNumeric()})));
		this.setValidatorsVidas();
		let i = this.vidas.length - 1;
		let control:any = this.vidas.controls[i];
		this.subs.add(
			control.get("data_nascimento").valueChanges.subscribe((value) =>{
				if(
					!this.functions.isEmpty(value) && 
					this.can_load_data &&
					((typeof value._i == 'string' && value._i.length >= 8) ||  
					(typeof value._i == "object")
					) 
				){
					this.applyDesconto();
				}
				
			})
		);
		this.subs.add(
			control.get("cpf").valueChanges.pipe(
				debounceTime(350),
				switchMap((el:any) =>{
					if(!this.functions.isEmpty(el) && el.length == 11){
						if(!this.functions.validarCPF(el)){
							this.functions.printSnackBar("CPF é inválido.");
						}else{
							let params = {
								cpf : el,
								filial : this.form.get("filial").value,
								cpf_vida : 1,
								tipo_servico_id : this.form.get("tipo_servico").value.id
							}
							this._http.get("validar-cpf",params).subscribe((validacao:any) =>{
								if(validacao.validacao == 1){
									this.functions.printSnackBar("CPF já está cadastrado no sistema.");
									control.patchValue({
										is_cpf_webService: true
									});
								}else{
									control.patchValue({
										is_cpf_webService: false
									});
								}
							})
						}
					}
					return of(el);
				})
			)
			.subscribe()
		)
		
		this.cdr.detectChanges();
	}

	public applyDesconto(){
		let qtd_vidas = !this.functions.isEmpty(this.qtd_vidas) ? this.qtd_vidas +  this.vidas.length : this.vidas.length;
		if(!this.functions.isEmpty(this.form.get("matricula_titular").value)){
			qtd_vidas--; // RETIRA O TITULAR DAS VIDAS
		}
		let datas = [];
		this.isLoading = true;
		for(let i =0;i < this.vidas.controls.length; i++){
			let vida_individual = this.vidas.controls[i];
			if(!this.functions.isEmpty(vida_individual.get("data_nascimento").value)){
				let data = this.functions.formatData(vida_individual.get("data_nascimento").value,"YYYY-mm-dd");
				datas.push(data);
			}
		}
		let params = {
			datas: datas,
			qtd_vidas : qtd_vidas,
			tabela_id : this.tabela.id,
			tipo_servico_id : this.form.get("tipo_servico").value.id,
			filial : this.form.get("filial").value
		}
		this._http.post("proposta-calculate",params).subscribe((resp:any) =>{
			this.vidas.controls.map((el) =>{
				if(!this.functions.isEmpty(el.get("data_nascimento").value)){
					let data = this.functions.formatData(el.get("data_nascimento").value,"YYYY-mm-dd");
					el.patchValue({
						valor : resp.valores_individuais[data]
					});
				}
			});
			this.form.get("adesao").patchValue({valor:resp.total});
			this.form.get("mensalidade").patchValue({valor:resp.total});
			this.isLoading = false;
			this.can_load_data = true;
			this.cdr.detectChanges();
		},(e:any) =>{
			// this.vidas.controls[i].patchValue({valor:0});
			if(e.error && e.error.status && e.error.status == 7){
				this.functions.printSnackBar(e.error.message);
			}
			this.isLoading = false;
			this.can_load_data = true;
			this.cdr.detectChanges();
		});

	}

	public removeDependented(i){
		let index = this.vidas.value.findIndex(vida => vida.id == i);
		this.vidas.removeAt(index);
		this.applyDesconto();
		this.cdr.detectChanges();
	}

	public setValidatorsVidas(){
		let validators_vida = new Vida().getValidators();
		validators_vida.map(el => {
			this.vidas.controls[this.vidas.controls.length - 1].get(el.key).setValidators(el.validators);
		})
	}

	public getValorTotal(){
		let valor = 0;
		this.vidas.controls.map(el =>{
			valor += el.get("valor").value;
		});
		this.valor_produto = valor;
	}

	public checkValorTabela(nascimento){
		let idade = this.functions.idade(new Date(nascimento));
		let getValor = null;
		for(let i = 0; i < this.tabela.produtos.length; i++){
			if(idade >=  this.tabela.produtos[i].idade_inicial && idade <= this.tabela.produtos[i].idade_final){
				getValor = this.tabela.produtos[i];
				break;
			}
		}
		if(getValor){
			return getValor;
		}
		return null;
	}

	public openModal(i?:any){
		let modal_config:MatDialogConfig = new MatDialogConfig();
		modal_config.minHeight = 400;
		modal_config.minWidth = 400;
		modal_config.panelClass = 'modal-dados-clinicos';
		modal_config.data =this.vidas.controls[i].value;

		let modal_ref:any = this.dialog.open(ModalDadosClinicosComponent,modal_config);
		modal_ref.componentInstance.response.subscribe((dados:any) =>{
			this.dialog.closeAll();
			if(dados.length > 0){
				this.vidas.controls[i].patchValue({
					dados_clinicos : dados
				})
			}
		});
	}

	public openModalEndereco(i?:any){
		let modal_config:MatDialogConfig = new MatDialogConfig();
		modal_config.minHeight = 400;
		modal_config.minWidth = 400;
		modal_config.panelClass = "modal-endereco-vida-custom";
		let data = this.vidas.controls[i].value;
		data.is_matricula = this.is_matricula_titular;
		data.titular = this.form.value;
		modal_config.data = data;

		let modal_ref:any = this.dialog.open(ModalEnderecoVidaComponent,modal_config);
		modal_ref.componentInstance.response.subscribe((dados:any) =>{
			this.dialog.closeAll();
			this.vidas.controls[i].patchValue(dados);
		});
	}


	public verificaCpfWebServiceVidas(){
		let is_cpf_exist = false;
		for(let i=0;i < this.vidas.controls.length; i++){
			let vida_individual = this.vidas.controls[i];
			if(vida_individual.get("is_cpf_webService").value){
				is_cpf_exist = true;
			}
		}
		return is_cpf_exist;
	}

	public checkEnderecoVida(){
		let exist = true;
		if(this.current == 3){
			for(let i=0;i < this.vidas.controls.length; i++){
				let vida_individual = this.vidas.controls[i];
				if(this.functions.isEmpty(vida_individual.get("rua").value)){
					exist = false;
				}
			}
		}
		return exist;
	}

	// FORMA DE PAGAMENTO -----------------------------------------------------------------------------------------------
	public getValuesPagamento(tipo){
		let pagamento:Pagamento = this.form.get(tipo).value;
		if(!this.functions.isEmpty(this.form.get(tipo).get("pagamento_tipo").value)){
			pagamento.pagamento_tipo = this.form.get(tipo).get("pagamento_tipo").value;
			pagamento.pagamento_tipo_id = this.form.get(tipo).get("pagamento_tipo").value.id;
		}
		return pagamento;
	}

	public changeFormPagamento(event,tipo:string){
		let validators_cartao = new Pagamento().getValidatorsCartao();
		let validators_conta = new Pagamento().getValidatorsConta();
		let validators_respase = new Pagamento().getValitatorsRepasse();
		let validators_dinheiro = new Pagamento().getValitatorsDinheiro();
		let validators_dinheiro_fiador = new Pagamento().getValitatorsDinheiroFiador();
		let validators_cartao_deb = new Pagamento().getValidatorsCartaoDeb();
		for(let pagamento in this.tipos_pagamento){
			for(let i = 0; i< this.tipos_pagamento[pagamento].length; i++){
				if(this.tipos_pagamento[pagamento][i] == event.value.id){
					switch(pagamento){
						case "cartao":{
							//RETIRA AS VALIDAÇOES ANTERIORES
							this.retirarValidacaoPagamento(validators_conta,tipo);
							this.retirarValidacaoPagamento(validators_respase,tipo);
							this.retirarValidacaoPagamento(validators_dinheiro,tipo);
							this.retirarValidacaoPagamento(validators_dinheiro_fiador,tipo);
							// coloca as nova
							validators_cartao.map(el => {
								this.form.get(tipo).get(el.key).setValidators(el.validators);
							})
							if(tipo == "adesao"){
								this.form.get(tipo).get('cartao_cvv').setValidators(Validators.required);
								this.form.get(tipo).get('cartao_nome').setValidators(Validators.required);
							}
							break;
						}
						case "cartao_d":{
							//RETIRA AS VALIDAÇOES ANTERIORES
							this.retirarValidacaoPagamento(validators_conta,tipo);
							this.retirarValidacaoPagamento(validators_respase,tipo);
							this.retirarValidacaoPagamento(validators_dinheiro,tipo);
							this.retirarValidacaoPagamento(validators_dinheiro_fiador,tipo);
							this.form.get(tipo).get("cartao_cvv").clearValidators();
							this.form.get(tipo).get("cartao_cvv").updateValueAndValidity();
							// coloca as nova
							validators_cartao_deb.map(el => {
								this.form.get(tipo).get(el.key).setValidators(el.validators);
							})
							break;
						}
						case "conta": {
							//RETIRA AS VALIDAÇOES ANTERIORES
							this.retirarValidacaoPagamento(validators_cartao,tipo);
							this.retirarValidacaoPagamento(validators_respase,tipo);
							this.retirarValidacaoPagamento(validators_dinheiro,tipo);
							this.retirarValidacaoPagamento(validators_dinheiro_fiador,tipo);
							this.retirarValidacaoPagamento(validators_cartao_deb,tipo);
							// coloca as nova
							validators_conta.map(el => {
								this.form.get(tipo).get(el.key).setValidators(el.validators);
							})
							break;
						}
						case "repasse": {
							//RETIRA AS VALIDAÇOES ANTERIORES
							//RETIRA AS VALIDAÇOES ANTERIORES
							this.retirarValidacaoPagamento(validators_cartao,tipo);
							this.retirarValidacaoPagamento(validators_conta,tipo);
							this.retirarValidacaoPagamento(validators_dinheiro,tipo);
							this.retirarValidacaoPagamento(validators_dinheiro_fiador,tipo);
							this.retirarValidacaoPagamento(validators_cartao_deb,tipo);
							validators_respase.map(el => {
								this.form.get(tipo).get(el.key).setValidators(el.validators);
							});
							break;
						}
						case "dinheiro": {
							this.retirarValidacaoPagamento(validators_conta,tipo);
							this.retirarValidacaoPagamento(validators_cartao,tipo);
							this.retirarValidacaoPagamento(validators_respase,tipo);
							this.retirarValidacaoPagamento(validators_cartao_deb,tipo);
							validators_dinheiro_fiador.map(el => {
								this.form.get(tipo).get(el.key).setValidators(el.validators);
							});
							this.subs.add(
								this.form.get(tipo).get("fiador").valueChanges.subscribe((el) =>{
									if(el == "2"){
										validators_dinheiro.map(el => {
											this.form.get(tipo).get(el.key).setValidators(el.validators);
										});
									}else{
										this.retirarValidacaoPagamento(validators_dinheiro,tipo);
									}
								})
							);
							break;
						}
						default: {
							this.retirarValidacaoPagamento(validators_conta,tipo);
							this.retirarValidacaoPagamento(validators_cartao,tipo);
							this.retirarValidacaoPagamento(validators_respase,tipo);
							this.retirarValidacaoPagamento(validators_dinheiro,tipo);
							this.retirarValidacaoPagamento(validators_dinheiro_fiador,tipo);
							this.retirarValidacaoPagamento(validators_cartao_deb,tipo);
							break;
						}
					}
				}
			}
		}		
	}
	
	public changePagamentoOnline(value){
		let validators_cartao = new Pagamento().getValidatorsCartao();
		let validators_conta = new Pagamento().getValidatorsConta();
		let validators_respase = new Pagamento().getValitatorsRepasse();
		let validators_dinheiro = new Pagamento().getValitatorsDinheiro();
		let validators_dinheiro_fiador = new Pagamento().getValitatorsDinheiroFiador();
		let validators_cartao_deb = new Pagamento().getValidatorsCartaoDeb();
		if(!value.checked){
			this.changeFormPagamento({value: {...this.form.get('mensalidade').value.pagamento_tipo}},"mensalidade");
		}else{
			this.retirarValidacaoPagamento(validators_conta,"mensalidade");
			this.retirarValidacaoPagamento(validators_cartao,"mensalidade");
			this.retirarValidacaoPagamento(validators_respase,"mensalidade");
			this.retirarValidacaoPagamento(validators_dinheiro,"mensalidade");
			this.retirarValidacaoPagamento(validators_dinheiro_fiador,"mensalidade");
			this.retirarValidacaoPagamento(validators_cartao_deb,"mensalidade");
		}
	}

	public retirarValidacaoPagamento(arr,tipo){
		//RETIRA AS VALIDAÇOES ANTERIORES
		arr.map(el => {
			this.form.get(tipo).get(el.key).clearValidators();
			this.form.get(tipo).get(el.key).updateValueAndValidity();
			//LIMPAR VALORES DOS OUTROS CAMPOS
			this.form.get(tipo).get(el.key).patchValue(null);
		});
		if(tipo == "adesao"){
			this.form.get(tipo).get("cartao_cvv").clearValidators();
			this.form.get(tipo).get("cartao_cvv").updateValueAndValidity();
			this.form.get(tipo).get("cartao_nome").clearValidators();
			this.form.get(tipo).get("cartao_nome").updateValueAndValidity();
		}
	}

	public verificaTipoPagamento(value,tipo){
		let arr = this.tipos_pagamento[tipo];
		for(let i=0; i< arr.length; i++ ){
			if(!this.functions.isEmpty(value)){
				if(arr[i] == value.id){
					return true;
				}
			}
		}
		return false;
	}

	public verificaCobrancaRepasseDFolha(pagamento_tipo){
		let tabela = this.form.get("tabela").value;
		let tipo_servico = this.form.get("tipo_servico").value;
		let cond:boolean = false;
		// let index_pagamento_tipo = [93,94,98,102];
		let index_pagamento_tipo = this.tipos_pagamento['df'];
		let tipo_servicos_df = this.list_tipo_servico_ids;
		if(index_pagamento_tipo.indexOf(pagamento_tipo.id) > -1){
			if(tipo_servico && (tipo_servicos_df.indexOf(tipo_servico.id) > -1 )){
				cond = true;
			}
		}else{
			cond = true;
		}

		return cond;
	}

	public changeCorrespondencia(event){
		let validators_cobranca = new Pagamento().getValidatorsCobranca();
		
		if(event.value === "outra_pessoa"){
			validators_cobranca.map(el =>{
				this.form.get('mensalidade').get(el.key).setValidators(el.validators);
			});
			let mensalidade = this.form.get('mensalidade');
			if(this.functions.isEmpty(mensalidade.get('cobranca_tipo_pessoa').value)){
				mensalidade.get('cobranca_tipo_pessoa').patchValue("1");
			}
		}else{
			validators_cobranca.map(el =>{
				this.form.get('mensalidade').get(el.key).clearValidators();
				this.form.get('mensalidade').get(el.key).updateValueAndValidity();
			});
			this.form.get('mensalidade').get('cobranca_cpf').clearValidators();
			this.form.get('mensalidade').get('cobranca_cpf').updateValueAndValidity();
		}
	}

	public copyTitular(){
		let proposta = this.form.value;
		let campos = ["cep","cidade","endereco_rua","endereco_bairro","endereco_complemento","endereco_referencia","uf"]
		let copy:any = {};
		campos.map(el =>{
			copy["cobranca_"+el] = proposta["titular_"+el];
		});
		copy.cobranca_endereco_numero = proposta.titular_numero;

		this.form.get("mensalidade").patchValue(copy);

	}

	// ASSINAR CONTRATO -----------------------------------------------------------------------------------------------
	public accordion(tipo){
		switch(tipo){
			case "aceite_voz":{
				this.is_aceite_voz = !this.is_aceite_voz;
				this.is_assinatura = false;
				this.is_assinatura_presencial = false;
				this.is_anexa_arquivos = false;
				this.is_ficha_visita = false;
				if(window.screen.availWidth <= 1024){
					document.body.style.overflow = "auto";
				}
				break;
			}
			case "assinatura":{
				this.is_aceite_voz = false;
				this.is_assinatura = !this.is_assinatura;
				this.is_assinatura_presencial = false;
				this.is_anexa_arquivos = false;
				this.is_ficha_visita = false;
				if(window.screen.availWidth <= 1024){
					setTimeout(()=>{
						this.viewportScroller.scrollToAnchor("sing_anchor");
						document.body.style.overflow = "hidden";
					},350);	// Tempo da animação		
				}

				break;
			}
			case "assinatura_presencial":{
				this.is_aceite_voz = false;
				this.is_assinatura = false;
				this.is_anexa_arquivos = false;
				this.is_assinatura_presencial = !this.is_assinatura_presencial;
				this.is_ficha_visita = false;
				if(window.screen.availWidth <= 1024){
					document.body.style.overflow = "auto";
				}
				break;
			}
			case "anexa_arquivos":{
				this.is_aceite_voz = false;
				this.is_assinatura = false;
				this.is_assinatura_presencial = false;
				this.is_anexa_arquivos = !this.is_anexa_arquivos;
				this.is_ficha_visita = false;
				if(window.screen.availWidth <= 1024){
					document.body.style.overflow = "auto";
				}
				break;
			}
			case "ficha_visita":{
				this.is_aceite_voz = false;
				this.is_assinatura = false;
				this.is_anexa_arquivos = false;
				this.is_assinatura_presencial = false;
				this.is_ficha_visita = !this.is_ficha_visita;
				if(window.screen.availWidth <= 1024){
					document.body.style.overflow = "auto";
				}
				break;
			}
			default :{
				this.is_aceite_voz = false;
				this.is_assinatura = false;
				this.is_assinatura_presencial = false;
				this.is_anexa_arquivos = false;
				this.is_ficha_visita = false;
				if(window.screen.availWidth <= 1024){
					document.body.style.overflow = "auto";
				}
			}
			this.cdr.detectChanges();
		}
	}

	public assinatura_create(){
		let modal_config:MatDialogConfig = new MatDialogConfig();
		modal_config.data = {
			tipo : "sing"
		};
		modal_config.panelClass = 'modal-proposta-criada';
		
		this._http.put("proposta",{id: this.proposta_id,is_assinatura_presencial : this.form_assinatura.value.is_assinatura_presencial ? 1 : 0 })
			.subscribe((response:any) => {
				modal_config.data.response = response;
				this.dialog.open(ModalMessageComponent,modal_config);
				this.router.navigate(['/']);
			},(erro:any) =>{
				modal_config.data.response = erro.error;
				this.dialog.open(ModalMessageComponent,modal_config);
				this.router.navigate(['/']);
			})
	}

	// RASCUNHO -----------------------------------------------------------------------------------------------
	public getPropostaRascunho(numero_serie?:number){
		let lista_rascunho:any = localStorage.getItem("lista_rascunho");
		let rascunho:any;
		if(lista_rascunho){
			lista_rascunho = JSON.parse(lista_rascunho);
			numero_serie = numero_serie ? numero_serie : this.numero_serie;
			if(lista_rascunho){
				rascunho = lista_rascunho.filter( el => String(el.numero_serie) == String(numero_serie));
				return rascunho[0];
			}
		}
		return null;
	}

	public setPropostaRascunho(proposta:Proposta){
		let lista_rascunho:Proposta[] = [];
		let search;
		lista_rascunho = JSON.parse(localStorage.getItem("lista_rascunho"));
		if(!this.functions.isEmpty(lista_rascunho)){
			search = lista_rascunho.findIndex(el => String(el.numero_serie) == String(proposta.numero_serie));
		}else{
			lista_rascunho = [];
		}
		if(!this.functions.isEmpty(search) && search > -1){
			lista_rascunho[search] = new Proposta(proposta);
		}else{
			lista_rascunho.push( new Proposta(proposta));
		}
		localStorage.setItem("lista_rascunho",JSON.stringify(lista_rascunho));
	}

	public deletePropostaRascunho(){
		let lista_rascunho:Proposta[] = [];
		let search;
		lista_rascunho = JSON.parse(localStorage.getItem("lista_rascunho"));
		if(!this.functions.isEmpty(lista_rascunho)){
			search = lista_rascunho.findIndex(el => String(el.numero_serie) == String(this.numero_serie));
			lista_rascunho.splice(search,1);
		}
		localStorage.setItem("lista_rascunho",JSON.stringify(lista_rascunho));
	}

	//Evento do botão escolha um arquivo ************************************************
	public addFile(event){
		// this.isLoading = true;
		if(event.target.files && event.target.files){
			// this.anexos = event.target.files;
			if(event.target.files.length > 0){
				for(let i= 0; i < event.target.files.length; i++){
					this.midias.push(event.target.files[i]);
					this.cdr.detectChanges();
				}
			}
		}
	}

	public insertMedia(){
		if(this.midias.length > 0){
			let midia = new FormData();
			for(let i = 0; i < this.midias.length; i++){
				midia.append("media[]",this.midias[i]);
			}
			midia.append("proposta_id","46");
			midia.append("is_anexo","1");
			this._http.post("comprovante",midia).subscribe((resp:any) =>{
				this.functions.printSnackBar("Comprovantes anexados com sucesso.");
				this.accordion("assinatura");
				this.cdr.detectChanges();
			},(e:any)=>{
				this.functions.printMsgError(e);
			})
		}
	}


	public savePropostaRascunho(){
		this.is_rascunho = true;
		this.create();
	}

	public removeMidia(i){
		this.midias.splice(i,1);
		this.cdr.detectChanges();
	}

	public clear(){
		if(this.is_matricula_titular){
			this.form.patchValue(new Proposta({filial: this.form.value.filial}));
			this.form.patchValue({
				tabela: null,
				tabela_matricula_titular: null,
				canal_vendas: null,
				tipo_servico: null,
			})
			this.form.get("tabela").enable();
			this.cdr.detectChanges();
		}
	}

	public retirarValidacaoFormularioInclusao(retire:boolean = true){
		let arr = [
			"titular_nome",
			"titular_cpf",
			"titular_sexo",
			"titular_estado_civil",
			"titular_data_nascimento",
			"titular_cep",
			"titular_endereco_rua",
			'titular_numero',
			'titular_endereco_referencia',
			"titular_endereco_bairro",
			"titular_cidade",
			"titular_uf",
			'titular_endereco_complemento',
			"titular_tel_residencial",
			"titular_urgencia_email",
		];
		//RETIRA AS VALIDAÇOES ANTERIORES
	
			arr.map(el => {
				if(retire){
					this.form.get(el).clearValidators();
					this.form.get(el).updateValueAndValidity();
					//LIMPAR VALORES DOS OUTROS CAMPOS
					this.form.get(el).patchValue(null);
				}else{
					this.form.get(el).setValidators([Validators.required]);
				}
			});
		
	}


	public changeTipoPessoaCobranca(event){
		Pagamento.changeTipoPessoaCobranca(event,this.form);
	}


	public clickPayment(){
		// window.open(this.url_payment, '_blank');
		let modal_config :MatDialogConfig = new MatDialogConfig();
		let adesao = this.form.value.adesao;
		let mensalidade = this.form.value.mensalidade;
		let arr_mensalidade_online = [104,105,106];
		// let is_payment_online = (adesao.pagamento_tipo_id != ADESAO_PAGAMENTO_ONLINE_ID) || (arr_mensalidade_online.filter(el => mensalidade.pagamento_tipo_id == el).length == 0);
		let is_payment_online = (adesao.pagamento_tipo_id != ADESAO_PAGAMENTO_ONLINE_ID);
		
		modal_config.data = {
			id: this.proposta_id,
			url_payment : this.url_payment,
			is_payment_online: is_payment_online,
			url_payment_inclusion : this.url_payment_inclusion,
			is_inclusion : this.form.get("matricula_titular").value != null
		};
		let dialogRef:any = this.dialog.open(ModalAdesaoOnlineComponent,modal_config);
	}

	public outputFichaVisita(event){
		this.show_btn_ficha_visita = false;
	}

	public handleTipoConta(type){
		if(this.functions.isEmpty(this.form.controls[type].value.banco)){
			return false;
		}
		if(this.form.controls[type].value.banco == "104 – Caixa Econômica Federal"){
			return true;
		}
		return false;
	}	

	public resetRefresh(value){
		this.refreshPayment = value;
	}

	ngOnDestroy(){
		this.subs.unsubscribe();
		if(window.screen.availWidth < 1024){
			document.body.style.overflow = "auto";
		}
	}
}
