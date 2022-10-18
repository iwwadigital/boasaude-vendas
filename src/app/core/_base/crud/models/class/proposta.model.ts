import { Validators } from '@angular/forms';
import { Comprovante } from './comprovante.model';
import { Pendencia } from './pendencia.model';
import { Vida } from './vida.model';
import { Usuario } from './usuario.model';
import { Produto } from './produto.model';
import { Pagamento } from './pagamento.model';
import { AceiteVoz } from './aceite_voz.model';
import { Tabela } from './tabela.model';
import { validateCpf, validateAutocomplete } from '../../utils/validate_cpf.service';
import { TipoServico } from './tipo_servico.model';
import { CanalVendas } from './canal_vendas.model';
import { FichaVisita } from './ficha_visita.model';
import { SeguroSaude } from './seguro_saude.model';
export class Proposta{
	public numero_serie:number = null;
	public matricula_titular:string = null; //Caso seja uma titular ja existente no banco da vitlamed
	public canal_venda_id:number = null;

	public id:number = null;
	public is_conferida:number = null;
	public filial:string = null;
	public canal_venda:string = null;

	public proposta_data:string = null;
	public titular_nome:string = null;
	public titular_sexo:string = null;
	public titular_data_nascimento:string = null;
	public titular_cpf:string = null;
	public titular_rg:string = null;
	public titular_estado_civil:string = null;
	public titular_endereco_rua:string = null;
	public titular_endereco_bairro:string = null;
	public titular_numero:string = null;
	public titular_endereco_complemento:string = null;
	public titular_endereco_referencia:string = null;
	public titular_cidade:string = null;
	public titular_uf:string = null;
	public titular_cep:string = null;
	public titular_tel_residencial:string = null;
	public titular_tel_comercial:string = null;
	public titular_tel_celular:string = null;
	public titular_seguro_saude:any = null;
	public titular_urgencia_contato_nome:string = null;
	public titular_urgencia_telefone:string = null;
	public titular_urgencia_email:string = null;
	public cobranca_responsavel_nome:string = null;
	public cobranca_tipo_pessoa:string = null;
	public cobranca_cpf:string = null;
	public cobranca_cnpj:string = null;
	public cobranca_rg:string = null;
	public cobranca_sexo:string = null;
	public cobranca_nascimento:string = null;
	public cobranca_tel_comercial:string = null;
	public cobranca_tel_residencial:string = null;
	public cobranca_tel_celular:string = null;
	public cobranca_endereco_rua:string = null;
	public cobranca_endereco_bairro:string = null;
	public cobranca_endereco_numero:string = null;
	public cobranca_endereco_complemento:string = null;
	public cobranca_endereco_referencia:string = null;
	public cobranca_cidade:string = null;
	public cobranca_uf:string = null;
	public cobranca_cep:string = null;
	public cobranca_email:string = null;
	public pagamento_data_vencimento:string = null;
	public correspondencia:string = null;
	public pagamento_forma:string = null;
	public nome_preposto:string = null;
	public cpf_preposto:string = null;
	public status:string;
	public vendedor_id:number;
	public is_assinatura_presencial:number;
	public observacoes:string = null;
	public matricula_empresa:string = null;
	public data_proposta_aprovacao:string = null;
	public proposta_data_original:string = null;
	public ip_usuario:string;
	public data_usuario:string;
	public codigo_proposta:number;

	public produto_id:number;
	public tabela_id:number;
	public tipo_servico_id:number;
	public seguro_saude_id:any = null;

	public tipo_servico:TipoServico;
	public produto:Produto;
	public tabela:Tabela;
	public vendedor:Usuario;
	public validador:Usuario;
	public seguro_saude:SeguroSaude = null;
	public aceite_voz:AceiteVoz[];
	public pagamentos:Pagamento[];
	public vidas:Vida[];
	public pendencias:Pendencia[];
	public comprovante:Comprovante;
	public comprovante_universitario:Comprovante;
	public canal_vendas:CanalVendas;
	public ficha_visitas:FichaVisita[];

	public url_payment:string;
	public url_payment_month:string;
	public url_payment_runs:string;
	public url_payment_inclusion:string;

	public logs:any[];

	//MOBILE 
	public is_mobile_dropdown:boolean = false;
	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
	}

	public getValidators(){
		return [
			{
				key: "filial",
				validators : [
					Validators.required,
				]
			},
			{
				key: "titular_nome",
				validators : [
					Validators.required,
					Validators.maxLength(120)
				]
			},
			{
				key: "titular_sexo",
				validators : [
					Validators.required
				]
			},
			{
				key: "titular_data_nascimento",
				validators : [
					Validators.required
				]
			},
			{
				key: "titular_cpf",
				validators : [
					// Validators.required,
					validateCpf
				]
			},
			{
				key: "titular_estado_civil",
				validators : [
					Validators.required
				]
			},
			// {
			// 	key: "titular_rg",
			// 	validators : [
			// 		Validators.required
			// 	]
			// },
			{
				key: "titular_endereco_rua",
				validators : [
					Validators.required,
					Validators.maxLength(150)
				]
			},
			{
				key: "titular_numero",
				validators : [
					Validators.required,
					Validators.maxLength(20)
				]
			},
			{
				key: "titular_endereco_complemento",
				validators : [
					Validators.required,
					Validators.maxLength(20)
				]
			},
			{
				key: "titular_endereco_referencia",
				validators : [
					Validators.required,
					Validators.maxLength(120)
				]
			},
			{
				key: "titular_endereco_bairro",
				validators : [
					Validators.required,
					Validators.maxLength(50)
				]
			},
			{
				key: "titular_cidade",
				validators : [
					Validators.required,
					Validators.maxLength(50)
				]
			},
			{
				key: "titular_uf",
				validators : [
					Validators.required,
					Validators.maxLength(20)
				]
			},
			{
				key: "titular_cep",
				validators : [
					Validators.required
				]
			},
			// {
			// 	key: "titular_urgencia_contato_nome",
			// 	validators : [
			// 		Validators.required
			// 	]
			// },
			// {
			// 	key: "titular_urgencia_telefone",
			// 	validators : [
			// 		Validators.required
			// 	]
			// },
			{
				key: "tabela",
				validators : [
					Validators.required,
					validateAutocomplete
				]
			},
			{
				key: "seguro_saude",
				validators : [
					Validators.required,
					validateAutocomplete
				]
			},
			{
				key: "titular_urgencia_email",
				validators : [
					Validators.email,
					Validators.maxLength(100)
				]
			},
			{
				key: "titular_tel_residencial",
				validators : [
					Validators.required,
					Validators.maxLength(15)
				]
			},
			{
				key: "cobranca_endereco_complemento",
				validators : [
					Validators.maxLength(20)
				]
			},

		]
	}

	public getValidatorsInclusao(){
		return [
			// {
			// 	key: "filial",
			// 	validators : [
			// 		Validators.required,
			// 	]
			// },
			// {
			// 	key: "titular_nome",
			// 	validators : [
			// 		Validators.required
			// 	]
			// },
			// {
			// 	key: "titular_sexo",
			// 	validators : [
			// 		Validators.required
			// 	]
			// },
			// {
			// 	key: "titular_data_nascimento",
			// 	validators : [
			// 		Validators.required
			// 	]
			// },
			// {
			// 	key: "titular_cpf",
			// 	validators : [
			// 		// Validators.required,
			// 		validateCpf
			// 	]
			// },
			// {
			// 	key: "titular_estado_civil",
			// 	validators : [
			// 		Validators.required
			// 	]
			// },
			// {
			// 	key: "titular_endereco_rua",
			// 	validators : [
			// 		Validators.required
			// 	]
			// },
			// {
			// 	key: "titular_numero",
			// 	validators : [
			// 		Validators.required
			// 	]
			// },
			// {
			// 	key: "titular_endereco_complemento",
			// 	validators : [
			// 		Validators.required
			// 	]
			// },
			// {
			// 	key: "titular_endereco_referencia",
			// 	validators : [
			// 		Validators.required
			// 	]
			// },
			// {
			// 	key: "titular_endereco_bairro",
			// 	validators : [
			// 		Validators.required
			// 	]
			// },
			// {
			// 	key: "titular_cidade",
			// 	validators : [
			// 		Validators.required
			// 	]
			// },
			// {
			// 	key: "titular_uf",
			// 	validators : [
			// 		Validators.required
			// 	]
			// },
			// {
			// 	key: "titular_cep",
			// 	validators : [
			// 		Validators.required
			// 	]
			// },
			// {
			// 	key: "tabela",
			// 	validators : [
			// 		Validators.required,
			// 		validateAutocomplete
			// 	]
			// },
			// {
			// 	key: "titular_urgencia_email",
			// 	validators : [
			// 		Validators.email
			// 	]
			// },
			// {
			// 	key: "titular_tel_residencial",
			// 	validators : [
			// 		Validators.required
			// 	]
			// },
		]
	}

	public getPropostaTeste(){
		let proposta:Proposta = new Proposta({
			"id" : 11450,
			"filial" : "Salvador",
			"canal_venda_id" : 12,
			"canal_venda" : "presencial",
			"proposta_data" : "2021-05-24 10:53:02",
			"titular_nome" : "Teste iwwa",
			"titular_sexo" : "Masculino",
			"titular_data_nascimento" : "1998-07-08",
			"titular_cpf" : "50200637037",
			"titular_estado_civil" : "C",
			"titular_endereco_rua" : "RUA IRARÁ",
			"titular_endereco_bairro" : "RIO VERMELHO",
			"titular_numero" : "47",
			"titular_endereco_complemento" : "Nenhum",
			"titular_endereco_referencia" : "Nenhum",
			"titular_cidade" : "Salvador",
			"titular_uf" : "Bahia",
			"titular_cep" : "41940630",
			"titular_tel_residencial" : "7199999999",
			"titular_tel_celular" : "71999999999",
			"titular_seguro_saude" : "Não",
			"titular_urgencia_contato_nome" : "Jaqueline",
			"titular_urgencia_telefone" : "71999999999",
			"titular_urgencia_email" : "teste@iwwa.com.br",
			"cobranca_responsavel_nome" : "Teste iwwa",
			"cobranca_cpf" : "50200637037",
			"cobranca_nascimento" : "1958-07-08",
			"cobranca_tel_comercial" : "7199999999",
			"cobranca_tel_residencial" : "7199999999",
			"cobranca_tel_celular" : "71999999999",
			"cobranca_endereco_rua" : "RUA IRARÁ",
			"cobranca_endereco_bairro" : "RIO VERMELHO",
			"cobranca_endereco_complemento" : "Nenhum",
			"cobranca_endereco_referencia" : "Nenhum",
			"cobranca_cidade" : "Salvador",
			"cobranca_uf" : "Bahia",
			"cobranca_cep" : "41940630",
			"cobranca_email" : "teste@iwwa.com.br",
			"cobranca_sexo" : "Masculino",
			"pagamento_data_vencimento" : "20",
			"correspondencia" : "titular",
			"pagamento_forma" : "mensal",
			"status" : "Em aprovação",
			"tabela_id" : 228,
			"vendedor_id" : 1,
			"is_exportado" : 0,
			"is_assinatura_presencial" : 0,
			"is_repasse" : 0,
			"is_conferida" : 0,
			"tipo_servico_id" : 556
		});

		proposta.vidas.push(new Vida({
			"proposta_id": 6340,
			"nome": "Teste iwwa",
			"cpf": "17450578549",
			"valor": 148,
			"sexo": "Masculino",
			"data_nascimento": "1958-07-08",
			"is_titular": "1",
			"rua": "RUA IRARÁ",
			"bairro": "RIO VERMELHO",
			"cep": "41940630",
			"complemento": "Nenhum",
			"referencia": "Nenhum",
			"cidade": "Salvador",
			"estado": "Bahia",
			"numero": "47",
			"estado_civil": "C",
			"tel_celular": "71999999999",
			"tel_residencial": "7133550970",
			"email": "jaqueblagojevec@gmail.com",
			"responsavel_tit": "Jaqueline",
			"tel_responsavel_tit": "71999999999"
		}));

		proposta.pagamentos.push(new Pagamento(
			{
				"proposta_id" : 6340,
				"pagamento_tipo_id" : 1,
				"transacao_id" : 1,
				"valor" : 148,
				"nome_pagador" : "Teste iwwa",
				"rua_pagador" : "RUA IRARÁ",
				"bairro_pagador" : "RIO VERMELHO",
				"complemento_pagador" : "Nenhum",
				"numero_endereco_pagador" : "47",
				"cidade_pagador" : "Salvador",
				"estado_pagador" : "Bahia",
				"cep_pagador" : "40296230",
				"telefone_pagador" : "71999999999",
				"status" : 0
			}
		));
		proposta.pagamentos.push(new Pagamento(
			{
				"proposta_id" : 6340,
				"pagamento_tipo_id" : 91,
				"transacao_id" : 2,
				"valor" : 148,
				"banco" : "237 – Banco Bradesco S.A.",
				"numero_agencia" : "3679",
				"numero_conta" : "50330-4",
				"conta_tipo" : "001",
				"status" : 0
			}
		));
		return proposta;
	}

}
