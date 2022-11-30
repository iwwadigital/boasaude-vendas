import { BtnConfig } from './../../../../core/_base/crud/models/layout/btn-config.model';
import { Proposta } from './../../../../core/_base/crud/models/class/proposta.model';
import { HttpService } from './../../../../core/_base/crud/services/http.service';
import { Pendencia } from './../../../../core/_base/crud/models/class/pendencia.model';
import { FunctionsService } from './../../../../core/_base/crud/utils/functions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, FormArray, Form, Validators } from '@angular/forms';
import { Pagamento } from './../../../../core/_base/crud/models/class/pagamento.model';
import { Vida } from './../../../../core/_base/crud/models/class/vida.model';
import { Tabela } from './../../../../core/_base/crud/models/class/tabela.model';
import { PagamentoTipo } from './../../../../core/_base/crud/models/class/pagamento_tipo.model';
import { LISTA_BANCO } from './../../../../core/_base/crud/models/lista-bancos';
import { Subscription, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { Produto } from './../../../../core/_base/crud/models/class/produto.model';
import { MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { ModalDadosClinicosComponent } from '../create-proposta/modal-dados-clinicos/modal-dados-clinicos.component';
import { ModalAceiteVozComponent } from '../../shared/components/modal-aceite-voz/modal-aceite-voz.component';
import { ModalValidatePropostaComponent } from '../modal-validate-proposta/modal-validate-proposta.component';
import { ModalMessageComponent } from '../create-proposta/modal-message/modal-message.component';
import {TIPOS_PAMENTOS,LISTA_BANDEIRAS, API_URL, URL_PDF, TIPO_SERVICO_DESC_FOLHA_ID, LISTA_TIPO_CONTA, LISTA_TIPO_ADESAO, TIPO_SERVICO_TRT_REGI_ID, LISTA_ESTADO, ADESAO_PAGAMENTO_ONLINE_ID} from './../../../../api';
import {
	trigger,
	state,
	style,
	animate,
	transition,
  } from '@angular/animations';
import { validateCpf, validateCnpj } from './../../../../core/_base/crud/utils/validate_cpf.service';
import { ModalCreateAceiteVozComponent } from '../../shared/components/modal-create-aceite-voz/modal-create-aceite-voz.component';
import { ModalAssinaturaComponent } from '../../shared/components/modal-assinatura/modal-assinatura.component';
import { ModalFichaVisitaComponent } from '../../shared/components/modal-ficha-visita/modal-ficha-visita.component';
import { ModalAdesaoOnlineComponent } from '../../shared/components/modal-adesao-online/modal-adesao-online.component';
import { ModalLogHistoryComponent } from '../modal-log-history/modal-log-history.component';
import { SeguroSaude } from './../../../../core/_base/crud/models/class/seguro_saude.model';


@Component({
	selector: 'kt-view-proposta',
	templateUrl : './view-proposta.component.html',
	styleUrls : ['./view-proposta.component.scss'],
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
export class ViewPropostaComponent implements OnInit, OnDestroy{
	private subs:Subscription = new Subscription();
	public proposta:Proposta = null;
	public tabelas:Tabela[] = [];
	public produtos:Produto[] = [];
	public valor_prod:number = 0;
	public seguros_saude:SeguroSaude[]= [];
	public pagamentos_tipos:PagamentoTipo[] = [];
	public lista_bancos; // LISTA DE BANCO PARA USAR NA ADESÃO
	public lista_bancos_other; // LISTA DE BANCO PARA USAR NA MENSALIDADE
	public is_ready_input:boolean = true;
	public is_disabled_data_vencimento = false;
	public show_pendencia:boolean = false;
	public isLoading:boolean = false;
	public data_vencimento:number[] = [5,10,15,20,25,30];
	public form:FormGroup;
	public vidas:FormArray;	
	public tipos_pagamento:any;
	public lista_bandeiras:any[];
	public tipos_servico:any[] = [];
	//REGRA DE NEGOCIO
	public tabela:Tabela;
	public valor_produto:number = 0;
	public titular:Vida;
	public data_minima = new Date("01/01/1900 00:00");
	public data_maxima = new Date();
	public first_loading:boolean = true;
	public qtd_vidas:number;
	public can_load_data:boolean = false;
	public ctrl_payment:boolean = false; // CONTROLE DA REQUISICAO A API QUANDO CALCULAR O PAGAMENTO
	public is_desc_folha:boolean = false; // CASO O TIPO SERVIÇO ESCOLHIDO SEJA DESCONTO EM FOLHA
	public first_load:boolean = true;
	public disable_btn_without_value:boolean = false; // CASO NAO ENCONTRE VALOR DAS VIDAS
	public is_update_proposta:boolean = false;
	public valor_total:number;
	public tipo_servico_trt: number;
	public regra_negocio_adesao: string;
	public regra_negocio_mensalidade: string;
	public lista_estado_civil:any;

	//Tabela
	public colunas:string[] = ['nome',"idade","valor"];
	public colunas_log:string[] = ['log',"autor","data"];
	public list_vidas:any[] = [];
	public data_source:any;
	public is_show_associate:boolean = false;
	public log_data:any[] = [];
	public lista_tipo_conta:any[];
	public lista_adesao:any[];
	public list_estado = [];
	public list_tipo_servico_ids = [];
	public refreshPayment:boolean = false;


	public has_payment:boolean = false;
	public has_accession_online:boolean = false;
	public has_month_online:boolean = false;
	public has_inclusion_online:boolean = false;
	public url_payment:string = "";
	public adesao:any = {};
	public mensalidade:any = {};

	constructor(
		public functions:FunctionsService,
		private fb:FormBuilder,
		private _http:HttpService,
		private router:Router,
		private route:ActivatedRoute,
		private dialog:MatDialog,
		private cdr:ChangeDetectorRef
	){}
	ngOnInit(){
		let lista = LISTA_ESTADO;
		let filial = localStorage.getItem("filial");
		this.getRegrasNegocio({filial : filial});
		for(let estado in lista){
			this.list_estado.push(lista[estado]);
		}
		
		this.route.params.subscribe((params:any) =>{
			if(!this.functions.isEmpty(params.id)){
				if(!this.functions.isEmpty(this.form)){
					this.form.reset();
					while(this.vidas.length !== 0){
						this.vidas.removeAt(0);
					}
				}
				this.show(params.id);
				
			}else{
				this.functions.printSnackBar("Identificador da proposta não foi passado.");
			}
		})
		this.getTipoServicoSaeb();
		this.obseravableForm();
		

	} 
	// FIM NgOnIniT ---------------------------------------------------------------------------------------------------
	public getRegrasNegocio(params?:any){
		this._http.get("lista/all",params).subscribe((resp:any) => {
			this.tipos_pagamento = resp.pagamentos;
			this.lista_adesao = resp.adesoes;
			this.lista_tipo_conta = resp.contas;
			this.lista_bandeiras = resp.cartoes;
			this.lista_bancos = resp.bancos;
			this.lista_bancos_other = resp.bancos;
			this.tipo_servico_trt = resp.regra_negocio.tipo_servico_trt_regi_id;
			this.regra_negocio_adesao = resp.regra_negocio.adesao;
			this.regra_negocio_mensalidade = resp.regra_negocio.mensalidade;
			this.lista_estado_civil = resp.estados_civil;
		},(e:any) =>{
			this.tipos_pagamento = TIPOS_PAMENTOS;
			this.lista_adesao = LISTA_TIPO_ADESAO;
			this.lista_tipo_conta = LISTA_TIPO_CONTA;
			this.lista_bandeiras = LISTA_BANDEIRAS;
			this.lista_bancos = Object.assign([],LISTA_BANCO);
			this.lista_bancos_other = Object.assign([],LISTA_BANCO);
		})
	}
	public obseravableForm(){
		this.form = this.fb.group(new Proposta());
		this.form.get("cobranca_sexo").setValidators([Validators.required]);
		this.form.get("cobranca_sexo").updateValueAndValidity();
		//VALIDAR CPF
		this.subs.add(
			this.form.get("titular_cpf").valueChanges.pipe(
				debounceTime(250),
				switchMap((value:string) =>{
					if(!this.functions.isEmpty(value) && value.length == 11){
						if(!this.functions.validarCPF(value)){
							this.functions.printSnackBar("CPF inválido.");
						}
					}
					return of(value);
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
		
		// Pesquisa pelo cep
		this.subs.add(
			this.form.get('titular_cep').valueChanges.pipe(
				debounceTime(250),
				switchMap((value:string) =>{
					if(!this.functions.isEmpty(value) && typeof value === 'string' && value.length === 8 && !this.is_ready_input){
						this.isLoading = true;
						this.cdr.detectChanges();
						this._http.get(`search-cep/${value}`).subscribe((response:any) =>{
							this.form.patchValue({
								titular_endereco_rua : response.logradouro,
								titular_endereco_bairro : response.bairro,
								titular_cidade : response.localidade,
								titular_uf : this.functions.getEstado(response.uf)
							});
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
			this.form.get('cobranca_cep').valueChanges.pipe(
				debounceTime(250),
				switchMap((value:string) =>{
					if(!this.functions.isEmpty(value) && typeof value === 'string' && value.length === 8 && !this.is_ready_input){
						this.isLoading = true;
						this.cdr.detectChanges();
						this._http.get(`search-cep/${value}`).subscribe((response:any) =>{
							this.form.patchValue({
								cobranca_endereco_rua : response.logradouro,
								cobranca_endereco_bairro : response.bairro,
								cobranca_cidade : response.localidade,
								cobranca_uf : this.functions.getEstado(response.uf)
							});
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
	}

	public getTabela(parameter?:any){
		this._http.get("tabela",parameter).pipe(
			catchError((err,caught)=>{
				// this.functions.printSnackBar(`Nenhuma tabela encontrada.`);
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

	public getPagamentoTipo(parameter?:any){
		this.subs.add(
			this._http.get("pagamento-tipo",parameter).subscribe((response:any)=>{
				this.pagamentos_tipos = response.pagamentos_tipos;
				this.cdr.detectChanges();
			})
		);
	}

	public getMatriculaInclusao(filial,matricula){
		this.subs.add(
			this._http.get("proposta-web-service",{matricula : matricula,filial :filial}).subscribe((response:any) =>{
				this.qtd_vidas = response.proposta.qtd_vidas;
				this.can_load_data = true;
				this.cdr.detectChanges();
			},(erro:any) =>{
				this.qtd_vidas = null;
				this.cdr.detectChanges();
			})
		);
	}

	public print(){
		let token = localStorage.getItem("accessToken");
		// let href = API_URL+"/proposta-print?token="+token+"&proposta_id="+this.proposta.id;
		// let href = "http://vendas.vitalmed.com.br/proposta-pdf/"+this.proposta.id+"?token="+token;
		let href = URL_PDF+"proposta-pdf/"+this.proposta.id+"?token="+token;
		href = encodeURIComponent(href);
		let url = "https://iwwapdf.iwwadigital.com.br/?url="+href+"&filename=proposta_"+this.proposta.id+".pdf";
		window.open(url,"blank");
	}

	public show(id?:any){
		this.first_loading = true;
		this.cdr.detectChanges();
		id = !id ? this.proposta.id : id;
		//RESET SHOW
		this.tabela = null;
		this.valor_produto = 0;
		this.titular = null;
		this.is_show_associate = false;
		this.data_source = null;
		this.is_ready_input = true;
		this.show_pendencia = false;
		this.can_load_data = false;
		this.adesao = {};	
		this.mensalidade = {};
		//END

		this.isLoading = true;
		this._http.show("proposta",id).subscribe(( response:any ) =>{
			this.isLoading = false;
			
			this.log_data = this.generateLog(response.proposta);
			
			let title_aceite = 'Validar Aceite de Voz';
			let title_comprovante = "Cadastrar Assinatura";
			if(this.functions.verificarTipoUsuario([4])){
				title_aceite = 'Ver Aceite de Voz';
			}
			this.proposta = new Proposta(response.proposta);
			this.tabela = this.proposta.tabela;
			let ano = new Date();
			if(this.proposta.filial != localStorage.getItem("filial")){
				this.getRegrasNegocio({filial:this.proposta.filial});
			}
			this.getTiposServico({filial:this.proposta.filial});
			this.getPagamentoTipo({filial:this.proposta.filial});
			this.getSeguroSaude({filial:this.proposta.filial});
			// this.getTabela({filial:this.proposta.filial,ano: ano.getFullYear()});
			// this.valor_prod = this.proposta.produto.valor;
			if(response.proposta.pagamentos && response.proposta.pagamentos.length > 0){
				this.url_payment = response.proposta.url_payment;
				let adesao = response.proposta.pagamentos.filter((el:any) =>{
					return el.transacao_id == 1;
				});
				let mensalidade = response.proposta.pagamentos.filter((el:any) =>{
					return el.transacao_id == 2;
				})
				
				if(adesao.length > 0 || mensalidade.length > 0){
					if(adesao.length > 0){
						this.adesao = adesao[0];
					}
					if(mensalidade.length > 0){
						this.mensalidade = mensalidade[0];
					}
					this.checkMensalidadeFill();
				}
			}

			this.prepareForm();
			if(!this.functions.isEmpty(this.proposta.matricula_titular)){
				this.getMatriculaInclusao(this.proposta.filial,this.proposta.matricula_titular);
				let filter = this.proposta.vidas.filter(el => el.is_titular == 0);
				if(filter.length > 0){
					this.valor_total = filter.map(el => el.valor).reduce((el,sum) => el + sum);
				}else{
					if(this.proposta.vidas.length > 0){
						this.valor_total = this.proposta.vidas[0].valor;
					}
				}

				this.retirarValidacaoFormularioInclusao();
			}else{
				this.applyDesconto();
				this.retirarValidacaoFormularioInclusao(false);
			}
			// if(this.functions.isEmpty(this.proposta.aceite_voz) || !this.functions.verificarPermissao(['aceite-voz-editar'])){ // retirei pq o admin de vendas 
			//só vai ver aceite se tiver validado

			if(this.proposta.e_conferida){
				this.is_update_proposta = true;
			}
			// SET TIPO PESSOA
			if(!this.functions.isEmpty(this.proposta.cobranca_cpf)){
				this.form.get("cobranca_tipo_pessoa").patchValue("1");
			}else{
				this.form.get("cobranca_tipo_pessoa").patchValue("2");
			}

			this.refreshPayment = true;
			this.cdr.detectChanges();
		},( erro:any ) =>{
			this.isLoading = false;
			this.functions.printSnackBar(erro.error.message);
			this.cdr.detectChanges();
			// this.router.navigate(['/dashboard']);
		});
	}

	public getProdutos(){
		this._http.get("produto",{tabela_id: this.form.value.tabela.id}).subscribe((response:any)=>{
			this.produtos = response.produtos;
		})
	}

	public displayFn(data?:any){
		return data ? data.nome : undefined;
	}
	public displayFnSeguroSaude(data?:any){
		return data ? data.codigo+" - "+data.nome : undefined;
	}

	

	public getTipoServicoSaeb(){
		this._http.get("tipo-servico/get/desconto-saeb").subscribe((resp:any) => {
			this.list_tipo_servico_ids = resp.tipos_servicos_ids;
		});
	}
	
	
	//FORMULARIO --------------------------------------------------------------------------------------------------------------
	public switchEditProposta(){
		this.is_ready_input = !this.is_ready_input;
		let tipo_servico_id = 0;
		if(!this.functions.isEmpty(this.form.get("tipo_servico").value)){
			tipo_servico_id = this.form.get("tipo_servico").value.id
			if(tipo_servico_id == this.tipo_servico_trt || this.list_tipo_servico_ids.includes(tipo_servico_id)){
				this.is_disabled_data_vencimento = true;
			}else{
				this.is_disabled_data_vencimento = false;
			}
		}
		this.cdr.detectChanges();
	}

	//VERIFICO SE AQUELE CAMPO DO FORMULARIO JA EXISTE, SE NÃO EXISTE EU CRIO ELE, SE EXISTIR EU SÓ ATUALIZO OS DADOS DELES
	public checkExistForm(field,value,add_control){
		if(!this.form.controls[field]){
			this.form.addControl(field,add_control);
		}else{
			this.form.get(field).patchValue(value);
		}
	}

	public prepareForm(){
		this.form.patchValue(this.proposta);
		
		this.checkExistForm('tabela',this.proposta.tabela,new FormControl(this.proposta.tabela));
		this.checkExistForm('tipo_servico',this.proposta.tipo_servico,new FormControl(this.proposta.tipo_servico));
		// this.form.addControl('produto',new FormControl(this.proposta.produto));
		let adesao;
		let mensalidade;

		// Coloca Validacoes na proposta
		let validators_proposta = new Proposta().getValidators();
		let validators_proposta_inclusao = new Proposta().getValidatorsInclusao();
		// Só coloca validacao para propostas q naos ao inclusoes
		if(this.functions.isEmpty(this.proposta.matricula_titular)){
			validators_proposta.map(el =>{
				this.form.get(el.key).setValidators(el.validators);
			});
			// Se nao tiver seguro saude id, ele n será obrigatorio
			if(this.proposta.seguro_saude_id == null){
				this.form.get('seguro_saude').setValidators(null); 
			}
		}
		
		
		//ADD PAGAMENTO
		if(this.proposta.pagamentos.length > 0){
			this.proposta.pagamentos.map(el => {
				if(el.transacao_id === 1){
					adesao = new Pagamento(el);
					this.checkExistForm('adesao',adesao,this.fb.group(adesao));
				}else{
					el.pagamento_online = String(el.pagamento_online);
					mensalidade  = new Pagamento(el);
					this.checkExistForm('mensalidade',mensalidade,this.fb.group(mensalidade));
				}
			});
			//Validators Pagamento
			this.changeFormPagamento({value: adesao.pagamento_tipo_id},"adesao");
			if( mensalidade.pagamento_online != 1  ){
				this.changeFormPagamento({value: mensalidade.pagamento_tipo_id},"mensalidade");
			}
			// Cria Adesao e Mensalidade
			this.form.get("mensalidade").patchValue({
				pagamento_data_vencimento :   parseInt(this.proposta.pagamento_data_vencimento)
			});
			this.searchFormPagamento();
		}
		//ADD VIDA
		this.form.addControl("vidas",new FormArray([]));
		this.vidas = this.form.get("vidas") as FormArray;
		this.proposta.vidas.map(el =>{
			if(el.is_titular != 1){
				this.addDepented(el);
			}else{
				this.titular = new Vida(el);
			}
		});

		this.subs.add(
			this.form.get("tipo_servico").valueChanges.pipe(
				debounceTime(500),
				switchMap(value =>{
					if(value !== null && typeof value !== 'object'){
						this.getTiposServico({q:value,filial : this.proposta.filial});
					}
					if(typeof value === 'object' && !this.functions.isEmptyObj(value)){
						if(this.list_tipo_servico_ids.includes(value.id) && this.form.get("adesao")){
							
							let validators_dinheiro = new Pagamento().getValitatorsDinheiro();
							this.retirarValidacaoPagamento(validators_dinheiro,"adesao");
						}
						
					}
					return of(null);
				})
			).subscribe()
		);

		this.subs.add(
			this.form.get("cobranca_cnpj").valueChanges.pipe(
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
			this.form.get("cobranca_tipo_pessoa").valueChanges.subscribe((value:any) => {
				if(!this.functions.isEmpty(value) && this.functions.isEmpty(this.proposta.matricula_titular)){
					if(value == 1 ){
						this.form.get("cobranca_cnpj").clearValidators();
						this.form.get("cobranca_cnpj").updateValueAndValidity();
						this.form.get("cobranca_cnpj").patchValue(null);
						this.form.get("cobranca_cpf").setValidators([Validators.required,validateCpf]);
						this.form.get("cobranca_cpf").updateValueAndValidity();
						
					}else{
						this.form.get("cobranca_cpf").clearValidators();
						this.form.get("cobranca_cpf").updateValueAndValidity();
						this.form.get("cobranca_cpf").patchValue(null);
						this.form.get("cobranca_cnpj").setValidators([Validators.required,validateCnpj]);
						this.form.get("cobranca_cnpj").updateValueAndValidity();
					}
				}
			})
		);

		this.changeFormTitular("titular_nome","nome");
		this.changeFormTitular("titular_cpf","cpf");
		this.changeFormTitular("titular_sexo","sexo");
		this.changeFormTitular("titular_data_nascimento","data_nascimento");
		this.changeFormTitular("titular_estado_civil","estado_civil");
		this.changeFormTitular("titular_endereco_rua","rua");
		this.changeFormTitular("titular_endereco_bairro","bairro");
		this.changeFormTitular("titular_endereco_complemento","numero");
		this.changeFormTitular("titular_endereco_referencia","complemento");
		this.changeFormTitular("titular_cidade","cidade");
		this.changeFormTitular("titular_uf","estado");
		this.changeFormTitular("titular_cep","cep");
		this.changeFormTitular("titular_tel_residencial","tel_residencial");
		this.changeFormTitular("titular_tel_celular","tel_celular");
		this.changeFormTitular("titular_tel_comercial","tel_comercial");
		this.changeFormTitular("titular_urgencia_email","email");
		this.changeFormTitular("titular_urgencia_contato_nome","responsavel_tit");
		this.changeFormTitular("titular_urgencia_telefone","tel_responsavel_tit");
		
		if(this.proposta.tipo_servico && this.list_tipo_servico_ids.includes(this.proposta.tipo_servico.id) && this.form.get("adesao")){
			this.data_vencimento[6] = 2;
			// let validators_dinheiro = new Pagamento().getValitatorsDinheiro();
			// this.retirarValidacaoPagamento(validators_dinheiro,"adesao");
		}
		this.cdr.detectChanges();
	}

	public getTiposServico(parameter?:any){
		this.subs.add(
			this._http.get("tipo-servico",parameter).pipe(
				catchError((err,caught)=>{
					this.functions.printSnackBar(`Nenhum tipo de servico encontrado.`);
					return of(err);
				})
			).subscribe((response:any)=>{
				this.tipos_servico = response.tipos_servico;
				this.cdr.detectChanges();
			})
		);
	}

	public getForm(){
		let proposta:Proposta = new Proposta(this.form.getRawValue());
		if(this.titular){
			proposta.vidas.splice(0,0,this.titular);
		}
		
		proposta.tabela_id = this.tabela.id;
		proposta.pagamentos = [];
		if( !this.functions.isEmpty(proposta.titular_data_nascimento) ){ // Verifico se a data do titular ta preenchida
			proposta.titular_data_nascimento = this.functions.formatData(proposta.titular_data_nascimento,"YYYY-mm-dd");
		}


		if( !this.functions.isEmpty(proposta.cobranca_nascimento) ){ // Verifico se a data do titular da combranca ta preenchida
			proposta.cobranca_nascimento = this.functions.formatData(proposta.cobranca_nascimento,"YYYY-mm-dd");
		}
		
		if(!this.functions.isEmpty(proposta.seguro_saude) && typeof proposta.seguro_saude == 'object'){
			proposta.seguro_saude_id = proposta.seguro_saude.id;
		}

		let n_editado = [];
		//Retira os dependentes que não foi editado
		for(let i=0; i < proposta.vidas.length ; i++){
			if(!proposta.vidas[i].is_dado_clinicios_edited){
				n_editado.push(i);
			}
			proposta.vidas[i].data_nascimento = this.functions.formatData(proposta.vidas[i].data_nascimento,"YYYY-mm-dd");
			if(!this.functions.isEmpty(proposta.vidas[i].seguro_saude) && typeof proposta.vidas[i].seguro_saude == 'object'){
				proposta.vidas[i].seguro_saude_id = proposta.vidas[i].seguro_saude.id;
			}
		}
		for(let i=0; i < n_editado.length ; i++){
			let index = n_editado[i];
			delete proposta.vidas[index].dados_clinicos;
		}
		proposta.tipo_servico_id = this.form.get("tipo_servico").value.id;
		//Fim
		if(this.form.get("adesao")){
			proposta.pagamentos.push(this.form.get("adesao").value);
		}
		if(this.form.get("mensalidade")){
			proposta.pagamentos.push(this.form.get("mensalidade").value);
			proposta.correspondencia = this.form.get("mensalidade").value.correspondencia;
			proposta.pagamento_data_vencimento = this.form.get("mensalidade").value.pagamento_data_vencimento;
			proposta.pagamento_forma = this.form.get("mensalidade").value.periodicidade
		}
		if(proposta.correspondencia === "outra_pessoa"){
			let newPag = new Pagamento(this.form.get("mensalidade").value).getCobranca();
			newPag.cobranca_nascimento = this.functions.formatData(new Date(newPag.cobranca_nascimento),"YYYY-mm-dd");
			proposta = Object.assign(proposta, newPag);
		}
		return proposta;
	}

	public update(){
		if(this.form.status !== "INVALID"){
			let modal_config:MatDialogConfig = new MatDialogConfig();
			modal_config.panelClass = 'modal-proposta-criada';
			let proposta = this.getForm();
			
			this.isLoading = true;
			this._http.put("proposta",proposta).subscribe((response:any)=>{
				let is_new_vida = false; // SE TIVER UMA NOVA VIDA INSERIDA EU DOU O REFRESH NA PAGE
				this.vidas.value.filter((el:any)=>{
					if(!Number.isInteger(el.id)){
						is_new_vida = true;
					}
				});
				if(is_new_vida){
					location.reload(); //PREVINIR O BUG DE GERAR VARIAS VIDAS
				}else{
					modal_config.data = {response : response};
					this.dialog.open(ModalMessageComponent,modal_config);
					this.is_ready_input = true;
					this.is_update_proposta = true;
				}
				this.isLoading = false;
				if(this.form.get("mensalidade") && this.form.get("mensalidade").value){
					this.mensalidade = this.form.get("mensalidade").value;
				}
				if(this.form.get("adesao") && this.form.get("adesao").value){
					this.adesao = this.form.get("adesao").value;
				}
				this.checkMensalidadeFill();
				this.cdr.detectChanges();
			},(erro:any) =>{
				modal_config.data ={ response:erro.error,tipo: "refused" } ;
				this.dialog.open(ModalMessageComponent,modal_config);
				this.isLoading = false;
				this.cdr.detectChanges();
			})
		}else{
			this.functions.printSnackBar("Preencha todos os campos obrigatórios");
		}
	}


	// VIDAS --------------------------------------------------------------------------------------------------------------
	public setValidatorsVidas(){
		let validators_vida = new Vida().getValidators();
		let validators_vida_info = new Vida().getValidatorsInfo();
		let control = this.vidas.controls[this.vidas.controls.length - 1];
		validators_vida.map(el => {
			control.get(el.key).setValidators(el.validators);
		})
		validators_vida_info.map(el => {
			control.get(el.key).setValidators(el.validators);
		})
	}

	public addDepented(vida?:any){
		if(vida){
			this.vidas.push(this.fb.group(new Vida(vida)));
		}else{
			this.vidas.push(this.fb.group(new Vida({id: this.functions.generateAlphaNumeric(),is_titular:0,is_dado_clinicios_edited: true})));
		}
		let i = this.vidas.length - 1;
		let control:any = this.vidas.controls[i];
		this.subs.add(
			control.get("data_nascimento").valueChanges
			.pipe(
				debounceTime(250),
				switchMap((value:any) =>{
					if(
						!this.functions.isEmpty(value) && 
						this.can_load_data &&
						((typeof value._i == 'string' && value._i.length >= 8) ||  
						(typeof value._i == "object")
						) 
					){
						this.applyDesconto();
					}	
					return of(value);
				})
			)
			.subscribe()
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
								filial : this.proposta.filial,
								tipo_servico_id : this.proposta.tipo_servico_id,
								cpf_vida : 1
							}
							this.isLoading = true;
							
							if(
								this.proposta.status !== "Aprovado" && 
								this.proposta.status !== "Recusado" && 
								!this.first_loading &&
								el != control.value.cpf
								){
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
									this.isLoading = false;
									this.cdr.detectChanges();
								},(e) =>{
									this.isLoading = false;
									this.cdr.detectChanges();
								})
							}else{
								this.first_loading = false;
								this.isLoading = false;
								this.cdr.detectChanges();
							}
						}
					}
					return of(el);
				})
			)
			.subscribe()
		);
		// Pesquisa pelo cep
		this.subs.add(
			control.get('cep').valueChanges.pipe(
				debounceTime(250),
				switchMap((value:string) =>{
					if(!this.functions.isEmpty(value) && typeof value === 'string' && value.length === 8 && !this.is_ready_input){
						this.isLoading = true;
						this.cdr.detectChanges();
						this._http.get(`search-cep/${value}`).subscribe((response:any) =>{
							control.patchValue({
								rua : response.logradouro,
								bairro : response.bairro,
								cidade : response.localidade,
								estado : response.uf
							});
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
		
		// this.applyDesconto();
		this.setValidatorsVidas();
		this.cdr.detectChanges();
	}

	public removeDependented(i){
		let index = this.vidas.value.findIndex(vida => vida.id == i);
		if(!this.functions.isEmpty(this.vidas.controls[index].get("id").value) && Number.isInteger(this.vidas.controls[index].get("id").value)){
			let id = this.vidas.controls[index].get("id").value;
			this._http.delete("vida",id).subscribe((resp)=>{
				this.functions.printSnackBar(resp.message);
			})
		}
		this.vidas.removeAt(index);
		this.applyDesconto();
		this.cdr.detectChanges();
	}

	public changeFormTitular(field_form,field_vida){
		this.subs.add(
			this.form.get(field_form).valueChanges.pipe(
				debounceTime(500),
				switchMap(value =>{
					if(!this.functions.isEmpty(value) && !this.functions.isEmpty(this.titular)){
						this.titular[field_vida] = value;
						// let vida:any = {};
						// vida[field_vida] = value;
						// this.vidas.controls[0].patchValue(vida);
						this.cdr.detectChanges();
					}
					if(field_vida == "data_nascimento" && !this.functions.isEmpty(value)){
						if(typeof value == 'object'){
							value = this.functions.formatData( value,"YYYY-mm-dd" );
						}
						if(value != this.proposta.titular_data_nascimento){
							this.applyDesconto();
						}
					}
					return of(null)
				})
			).subscribe()
		)
	}

	public openModal(i?:any,titular?:any){
		let vida:any;
		let modal_config:MatDialogConfig = new MatDialogConfig();
		modal_config.minHeight = 400;
		modal_config.minWidth = 400;
		modal_config.panelClass ="modal-dados-clinicos";
		if(!titular){
			if((this.vidas.controls[i] && !Array.isArray(this.vidas.controls[i].value.dados_clinicos)) && this.proposta.vidas[i + 1]){
				vida = this.proposta.vidas[i + 1];
			}else{
				vida = this.vidas.controls[i].value;
			}
		}else{
			vida = titular;
		}
		vida.is_modal_edit = !this.is_ready_input;
		modal_config.data = vida;
		let modal_ref:any = this.dialog.open(ModalDadosClinicosComponent,modal_config);
		modal_ref.componentInstance.response.subscribe((dados:any) =>{
			this.dialog.closeAll();
			if(dados.length > 0){
				if(!titular){
					this.vidas.controls[i].patchValue({
						dados_clinicos : dados,
						is_dado_clinicios_edited: true
					})
				}else{
					this.titular.dados_clinicos = dados;
					this.titular.is_dado_clinicios_edited = true;
					
				}
			}
		});
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
		return {
			valor:0,
			qtd_pessoas_desconto: 0,
			qtd_vidas: 0,
			limite_desconto : 0
		};
	}

	public getValorTotal(){
		let valor = 0;
		if(!this.functions.isEmpty(this.titular) && !this.functions.isEmpty(this.titular.valor) ){
			valor += this.titular.valor; // Valor do titular
		}
		this.vidas.controls.map(el =>{
			valor += el.get("valor").value;
		});
		this.valor_produto = valor;
		if(this.form.get("adesao")){
			this.form.get("adesao").patchValue({
				valor : valor
			})
		}
		if(this.form.get("mensalidade")){
			this.form.get("mensalidade").patchValue({
				valor : valor
			})
		}
	}

	public applyDesconto(){
		let qtd_vidas = !this.functions.isEmpty(this.qtd_vidas) ? this.qtd_vidas +  this.vidas.length : this.vidas.length + 1;		
		let datas = [];
		this.isLoading = true;
		if(!this.functions.isEmpty(this.form.getRawValue().titular_data_nascimento)){
			let data;
			if(typeof this.form.getRawValue().titular_data_nascimento == 'object'){
				data = this.functions.formatData(this.form.getRawValue().titular_data_nascimento,"YYYY-mm-dd");
			}else{
				data = this.form.getRawValue().titular_data_nascimento;
			}
			datas.push(data);
		}
		
		for(let i =0;i < this.vidas.controls.length; i++){
			let vida_individual = this.vidas.getRawValue()[i];
			let data;
			if(!this.functions.isEmpty(vida_individual.data_nascimento)){
				if(typeof vida_individual.data_nascimento == 'object'){
					data = this.functions.formatData(vida_individual.data_nascimento,"YYYY-mm-dd");
				}else{
					data = vida_individual.data_nascimento;
				}
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
		this.subs.add(
			this._http.post("proposta-calculate",params).subscribe((resp:any) =>{
				this.vidas.controls.map((el) =>{
					if(!this.functions.isEmpty(el.get("data_nascimento").value)){
						let data;
						if(typeof el.get("data_nascimento").value == 'object'){
							data = this.functions.formatData(el.get("data_nascimento").value,"YYYY-mm-dd");
							el.patchValue({
								valor : resp.valores_individuais[data]
							});
						}else{
							data = el.get("data_nascimento").value;
							el.patchValue({
								valor : resp.valores_individuais[data]
							});
						}					
					}
				});
				if(this.form.get("adesao")){
					if(!this.functions.isEmpty(this.form.get('tipo_servico').value) && typeof this.form.get('tipo_servico').value == 'object' && this.list_tipo_servico_ids.includes(this.form.get('tipo_servico').value.id)){
						this.form.get("adesao").patchValue({valor:0});	
					}else{
						this.form.get("adesao").patchValue({valor:resp.total});
					}
				}
				if(this.form.get("mensalidade")){
					this.form.get("mensalidade").patchValue({valor:resp.total});
				}
	
				this.isLoading = false;
				this.can_load_data = true;
				this.disable_btn_without_value = false;
				this.cdr.detectChanges();
			},(e:any) =>{
				// this.vidas.controls[i].patchValue({valor:0});
				if(e.error && e.error.status && e.error.status == 7){
					this.disable_btn_without_value = true;
					this.functions.printSnackBar(e.error.message);
				}
				this.isLoading = false;
				this.can_load_data = true;
				this.cdr.detectChanges();
			})
		);
	}

	//TABELAS
	public saveInTabela(){
		this.proposta.vidas.map((el) => {
			let vida:any = {};
			vida.nome = el.nome;
			vida.idade = this.functions.idade(new Date(el.data_nascimento));
			vida.valor = this.checkValorTabela(new Date(el.data_nascimento));
			this.list_vidas.push(vida);
		});
		this.data_source = new MatTableDataSource(this.list_vidas);
		this.cdr.detectChanges();
	}

	public open_acordion(){
		this.is_show_associate = !this.is_show_associate;
	}

	public getTotalCost() {
		return this.list_vidas.map(t => t.valor).reduce((acc, value) => acc + value, 0);
	}

	public toggleMobile(element:Proposta){
		element.is_mobile_dropdown = !element.is_mobile_dropdown;
		this.cdr.detectChanges();
	}

	//FORMA DE PAGAMENTO --------------------------------------------------------------------------------------------------------------
	public resetRefresh(value){
		this.refreshPayment = value;
	}
	public changeFormPagamento(event,tipo:string){
		let validators_cartao = new Pagamento().getValidatorsCartao();
		let validators_conta = new Pagamento().getValidatorsConta();
		let validators_respase = new Pagamento().getValitatorsRepasse();
		let validators_dinheiro = new Pagamento().getValitatorsDinheiro();
		let validators_cartao_deb = new Pagamento().getValidatorsCartaoDeb();
		
		let pagamento = "";
		
		for(let p in this.tipos_pagamento){
			if(this.tipos_pagamento[p].filter(e => e == event.value).length > 0){
				pagamento = p; 
				break;
			}
		}		
		switch(pagamento){
			case "cartao":{
				//RETIRA AS VALIDAÇOES ANTERIORES
				this.retirarValidacaoPagamento(validators_conta,tipo);
				this.retirarValidacaoPagamento(validators_respase,tipo);
				this.retirarValidacaoPagamento(validators_dinheiro,tipo);
				// coloca as nova
				// validators_cartao.map(el => {
				// 	el.validators.map(val =>{
				// 		this.form.get(tipo).get(el.key).setValidators(val);
				// 	})
				// })
				break;
			}
			case "cartao_d":{
				//RETIRA AS VALIDAÇOES ANTERIORES
				this.form.get(tipo).get("cartao_cvv").clearValidators();
				this.form.get(tipo).get("cartao_cvv").updateValueAndValidity();
				this.retirarValidacaoPagamento(validators_conta,tipo);
				this.retirarValidacaoPagamento(validators_respase,tipo);
				this.retirarValidacaoPagamento(validators_dinheiro,tipo);
				// coloca as nova
				validators_cartao_deb.map(el => {
					this.form.get(tipo).get(el.key).setValidators(el.validators);
				})
				break;
			}
			case "conta": {
				//RETIRA AS VALIDAÇOES ANTERIORES
				this.retirarValidacaoPagamento(validators_cartao,tipo);
				this.retirarValidacaoPagamento(validators_cartao_deb,tipo);
				this.retirarValidacaoPagamento(validators_respase,tipo);
				this.retirarValidacaoPagamento(validators_dinheiro,tipo);
				// coloca as nova
				validators_conta.map(el => {
					this.form.get(tipo).get(el.key).setValidators(el.validators);
				})
				break;
			}
			case "repasse": {
				//RETIRA AS VALIDAÇOES ANTERIORES
				this.retirarValidacaoPagamento(validators_cartao,tipo);
				this.retirarValidacaoPagamento(validators_cartao_deb,tipo);
				this.retirarValidacaoPagamento(validators_conta,tipo);
				this.retirarValidacaoPagamento(validators_dinheiro,tipo);
				// validators_respase.map(el => {
				// 	el.validators.map(val =>{
				// 		this.form.get(tipo).get(el.key).setValidators(val);
				// 	})
				// });
				break;
			}
			case "dinheiro": {
				this.retirarValidacaoPagamento(validators_conta,tipo);
				this.retirarValidacaoPagamento(validators_cartao,tipo);
				this.retirarValidacaoPagamento(validators_respase,tipo);
				this.retirarValidacaoPagamento(validators_cartao_deb,tipo);
				validators_dinheiro.map(el => {
					this.form.get(tipo).get(el.key).setValidators(el.validators);
				});
				break;
			}
			default: {
				this.retirarValidacaoPagamento(validators_conta,tipo);
				this.retirarValidacaoPagamento(validators_cartao,tipo);
				this.retirarValidacaoPagamento(validators_respase,tipo);
				this.retirarValidacaoPagamento(validators_dinheiro,tipo);
				this.retirarValidacaoPagamento(validators_cartao_deb,tipo);
				break;
			}
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
	}

	public verificaTipoPagamento(value,tipo){
		if(!this.functions.isEmpty(this.tipos_pagamento[tipo])){
			let arr = this.tipos_pagamento[tipo];
			for(let i=0; i< arr.length; i++ ){
				if(!this.functions.isEmpty(value)){
					if(arr[i] == value){
						return true;
					}
				}
			}
		}
		return false;
	}

	public searchFormPagamento(){
		// Pesquisar banco
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
						this.isLoading = true;
						this.cdr.detectChanges();
						this._http.get(`search-cep/${value}`).subscribe((response:any) =>{
							mensalidade_form.patchValue({
								cobranca_endereco_rua : response.logradouro,
								cobranca_endereco_bairro : response.bairro,
								cobranca_cidade : response.localidade,
								cobranca_uf : this.functions.getEstado(response.uf)
							});
							this.isLoading = false;
							this.cdr.detectChanges();
						},(erro:any) =>{
							this.functions.printMsgError(erro);
							this.cdr.detectChanges();this.isLoading = false;
							this.isLoading = false;
							this.cdr.detectChanges();
						})
					}
					return of(value);
				})
			).subscribe()
		);
	}

	public changeFormProduto(){
		this.subs.add(
			this.form.get("produto").valueChanges.pipe(
				debounceTime(250),
				switchMap(value =>{
					if(!this.functions.isEmpty(value)){
						this.vidas.controls.map(el =>{
							el.patchValue({
								valor: value.valor
							});
						})
						this.valor_prod =value.valor;
						this.form.get("adesao").patchValue({
							valor : value.valor
						});
						this.form.get("mensalidade").patchValue({
							valor : value.valor
						});
						this.cdr.detectChanges();
					}
					return of(null)
				})
			).subscribe()
		)
	}

	public printCheckPagamento(pagamento,value){
		if(pagamento == value){
			return true;
		}
		return false;
	}

	public changeTipoPessoaCobranca(event){
		Pagamento.changeTipoPessoaCobranca(event,this.form);
	}

	public checkMensalidadePayment(mensalidade){
		if(
			mensalidade.pagamento_online == 1
		){
			if(
				(
					this.verificaTipoPagamento(mensalidade.pagamento_tipo_id,"cartao_d") || 
					this.verificaTipoPagamento(mensalidade.pagamento_tipo_id,"cartao") 
				) && 
				this.functions.isEmpty(mensalidade.cartao_numero)
			){
				return true;
			}else if(
				this.verificaTipoPagamento(mensalidade.pagamento_tipo_id,"conta")  && this.functions.isEmpty(mensalidade.numero_conta)
			){
				return true;
			}
		}
		return false;
	}

	public checkMensalidadeFill(){
		this.has_accession_online = false;
		this.has_month_online = false;
		this.has_inclusion_online = false;
		if(this.adesao.pagamento_tipo_id == ADESAO_PAGAMENTO_ONLINE_ID && this.adesao.status == 0){
			this.has_accession_online = true;
		}
		if(this.checkMensalidadePayment(this.mensalidade)){
			this.has_month_online = true;
		}
		if(this.proposta.matricula_titular != null){
			this.has_inclusion_online = true; 
		}
		// if(
		// 	// adesao[0].pagamento_tipo_id == 3 || 
		// 	(this.adesao.pagamento_tipo_id == ADESAO_PAGAMENTO_ONLINE_ID && this.adesao.status == 0) ||
		// 	this.checkMensalidadePayment(this.mensalidade) || 
		// 	this.proposta.matricula_titular != null // ESSA CONDICAO É PRA QUANDO FOR INCLUSÃO O BOTAO DE ADESAO APARECER
		// 	// this.verificaTipoPagamento(mensalidade[0].pagamento_tipo.id,"cadastramento_online") 
		// ){
		// 	this.has_payment = true;
		// }else{
		// 	this.has_payment = false;
		// }
	}

	public handleBtnForcePayment(){
		let params = {
			params :  encodeURI(this.proposta.url_payment_runs)
		}
		this._http.get("obtencao-pagamento",params).subscribe((resp:any) =>{
			this.functions.printSnackBar(resp.message);
		});
	}
	//FIM FORMA DE PAGAMENTO --------------------------------------------------------------------------------------------------------------	
	
	//ANEXOS--------------------------------------------------------------------------------------------------------------
	public getDownload(anexo){
		window.open(anexo.midia_url,"_blank");
	}

	public addFile(event){

		this.isLoading = true;
		if(event.target.files && event.target.files){
			// this.anexos = event.target.files;
			let midias = new FormData();
			if(event.target.files.length > 0){
				for(let i= 0; i < event.target.files.length; i++){
					midias.append("media[]",event.target.files[i]);
				}
				midias.append("proposta_id",this.proposta.id.toString());
				midias.append("is_anexo","1");
				this._http.post("comprovante",midias).subscribe((resp:any) =>{
					this.functions.printSnackBar("Comprovantes anexados com sucesso.");
					this.show();
					this.isLoading = false;
					this.cdr.detectChanges();
				},(e:any)=>{
					this.isLoading = false;
					this.functions.printMsgError(e);
					this.cdr.detectChanges();
				})
			}
		}
	}

	public deleteFile(anexo:any){
		this._http.delete("comprovante",anexo.id).subscribe((resp:any)=>{
			this.functions.printSnackBar(resp.message);
			this.show();
		},(e) =>{
			this.functions.printMsgError(e);
		})
	}

	// Verifico se ja existe Aceite de voz, Assinatura, ou é impresso
	public checkExistFildsExtra(){
		if(this.proposta.e_assinatura_presencial == 1){
			return true;
		}
		if(this.proposta.aceite_voz.length > 0){
			return true;
		}
		if(!this.functions.isEmpty(this.proposta.comprovante)){
			return true;
		}
		return false;
	}

	public clearForm(){
		let controls = this.form.controls;
		for(let value in controls){
			if(this.functions.isEmpty(this.form.get(value).value)){
				this.form.get(value).patchValue(null);
			}
		}
		
	}

	// LOG DE DATAS DA PROPOSTA -----------------------------------------------------------------------------------------------------------------
	public generateLog(proposta:Proposta){
		let arr_datas:any = [];
		arr_datas.push({
			message : "Proposta criada na data ",
			autor : proposta.vendedor.nome,
			data : proposta.proposta_data
		});
		if(proposta.aceite_voz && proposta.aceite_voz.length > 0){
			for(let i = 0; i < proposta.aceite_voz.length; i++){
				arr_datas.push({
					message : "Aceite de voz inserido na data ",
					autor : proposta.aceite_voz[i].criador.nome,
					data : proposta.aceite_voz[i].data_criacao
				});
				if(!this.functions.isEmpty(proposta.aceite_voz[i].data_validada)){
					let status =  proposta.aceite_voz[i].status.toLowerCase();
					arr_datas.push({
						message : "Aceite de voz "+status,
						autor : proposta.aceite_voz[i].validador.nome,
						data : proposta.aceite_voz[i].data_validada
					});
				}
			}
		}
		if(!this.functions.isEmpty(proposta.data_proposta_aprovacao)){
			arr_datas.push({
				message : "Proposta aprovada na data ",
				autor : proposta.validador.nome,
				data : proposta.data_proposta_aprovacao
			});
		}

		arr_datas.sort(function(a,b){
			if (a.data > b.data) {
				return 1;
			}
			if (a.data < b.data) {
				return -1;
			}
			return 0;
		});
		return arr_datas;
	}

	public showLogs(){
		let modal_config :MatDialogConfig = new MatDialogConfig();
		// window.open(this.proposta.comprovante.midia_url);
		modal_config.data = {
			logs : this.proposta.logs,
		};
		modal_config.panelClass = 'modal-proposta-log';
		let dialogRef:any = this.dialog.open(ModalLogHistoryComponent,modal_config);
	}

	public retirarValidacaoFormularioInclusao(retire:boolean = true){
		let arr =  [
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
			"cobranca_sexo",
		];
		//RETIRA AS VALIDAÇOES ANTERIORES
		arr.map(el => {
			if(retire){
				this.form.get(el).clearValidators();
				this.form.get(el).updateValueAndValidity();
			}else{
				// if(el != "titular_cpf"){
				// 	this.form.get(el).setValidators([Validators.required]);
				// }
			}
		});
		this.first_load = false;
	}

	public conferirProposta(){
		this.subs.add(
			this._http.put("proposta-conferir",{id: this.proposta.id,is_conferida:1}).subscribe((resp:any) =>{
				if(resp.success){
					this.functions.printSnackBar("Proposta conferida com sucesso.");
					this.is_update_proposta = true;
					this.show();
				}
			},(e) => {
				this.functions.printSnackBar("Não foi possivel conferir a proposta.");
			})
		);
	}

	public clickModalPayment(type:string){
		let modal_config :MatDialogConfig = new MatDialogConfig();
		let is_payment_online:boolean = false;
		let data:any = {};
		switch(type){
			case "adesao" : {
				is_payment_online = true;
				data.url_payment = this.proposta.url_payment;
				data.is_accession = true;
				break;
			}
			case "mensalidade" : {
				data.url_payment = this.proposta.url_payment_month;
				data.is_month = true;
				break;
			}
			case "inclusao" : {
				data.url_payment = this.proposta.url_payment_inclusion;
				data.is_inclusion = true;
				break;
			}
		}
		modal_config.data = data;
		let dialogRef:any = this.dialog.open(ModalAdesaoOnlineComponent,modal_config);
	}

	public clickPayment(){
		let modal_config :MatDialogConfig = new MatDialogConfig();
		let is_payment_online = this.adesao.pagamento_tipo_id != ADESAO_PAGAMENTO_ONLINE_ID
		modal_config.data = {
			id: this.proposta.id,
			url_payment : this.proposta.url_payment,
			url_payment_month : this.proposta.url_payment_month,
			is_payment_online: is_payment_online,
			url_payment_inclusion : this.proposta.url_payment_inclusion,
			is_inclusion : this.proposta.matricula_titular != null
		};
		let dialogRef:any = this.dialog.open(ModalAdesaoOnlineComponent,modal_config);
		// this.subs.add(
		// 	dialogRef.componentInstance.response.subscribe((value) =>{
		// 		if(!this.functions.isEmpty(value)){
		// 			this.show();
		// 		}
		// 	})
		// );
	}
	public handleTipoConta(type){
		if(this.functions.isEmpty(this.form.getRawValue()[type].banco)){
			return false;
		}
		if(this.form.getRawValue()[type].banco == "104 – Caixa Econômica Federal"){
			return true;
		}
		return false;
	}	

	public sideMenuActions(event:any){
		if(event.show){
			this.show();
		}
		if(event.update_proposta){
			this.is_update_proposta = true;
		}
		if(event.saveInTabela){
			this.saveInTabela();
		}
		if(event.show_pendencia){
			this.show_pendencia = true;
		}
		if(event.new_pendencia){
			this.proposta.pendencias.push(new Pendencia({status: "Pendente"}));
			this.cdr.detectChanges();
		}
	}

	ngOnDestroy(){
		this.subs.unsubscribe();
	}
}
