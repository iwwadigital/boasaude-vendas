import { Validators } from '@angular/forms';
import { Comprovante } from './comprovante.model';
import { Pendencia } from './pendencia.model';
import { Vida } from './vida.model';
import { Usuario } from './usuario.model';
import { Produto } from './produto.model';
import { Pagamento } from './pagamento.model';
import { AceiteVoz } from './aceite_voz.model';
import { Tabela } from './tabela.model';
import { validateCpf, validateAutocomplete, validateCnpj } from '../../utils/validate_cpf.service';
import { TipoServico } from './tipo_servico.model';
import { CanalVendas } from './canal_vendas.model';
import { FichaVisita } from './ficha_visita.model';
import { SeguroSaude } from './seguro_saude.model';
export class Proposta{
	public numero_serie:number = null;
	public matricula_titular:string = null; //Caso seja uma titular ja existente no banco da vitlamed
	public canal_venda_id:number = null;

	public id:number = null;
	public e_conferida:number = null;
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
	public e_assinatura_presencial:number;
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

	//Paginacao
	public titular:any = null;


	//MOBILE 
	public is_mobile_dropdown:boolean = false;

	//BoaSaude
	public titular_nome_mae:string = null;
	public carteira_sus:string = null;
	public codigo_carencia:string = null;
	public ramal:string = null;
	public idade:number = null;
	public pj_cnpj:string = null;
	public pj_razao_social:string = null;
	public pj_ramo_atividade:string = null;
	public pj_nome_fantasia:string = null;
	public pj_inscricao_municipal:string = null;
	public pj_endereco_rua:string = null;
	public pj_endereco_complemento:string = null;
	public pj_endereco_bairro:string = null;
	public pj_endereco_cep:string = null;
	public pj_endereco_cidade:string = null;
	public pj_endereco_referencia:string = null;
	public pj_endereco_uf:string = null;
	public pj_fax:string = null;
	public pj_telefone:string = null;
	public pj_cobranca_endereco_mesmo_endereco:string = "0";
	public pj_cobranca_endereco_cep:string = null;
	public pj_cobranca_endereco_rua:string = null;
	public pj_cobranca_endereco_bairro:string = null;
	public pj_cobranca_endereco_cidade:string = null;
	public pj_cobranca_endereco_uf:string = null;
	public pj_cobranca_endereco_complemento:string = null;
	public pj_cobranca_telefone:string = null;
	public pj_cobranca_fax:string = null;
	public pj_outra_pessoa_cobranca:number = 0;
	public titular_urgencia_cpf:string = null;
	public titular_urgencia_rg:string = null;
	public titular_email:string = null;
	public tipo_pessoa:number = null;
	public pj_reponsavel_nome:string = null;
	public pj_responsavel_cpf:string = null;
	public pj_responsavel_cargo:string = null;
	public pj_responsavel_telefone:string = null;
	public pj_responsavel_email:string = null;


	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
	}

	public getTitular(){
		return {
			titular_nome: this.titular_nome,
			titular_sexo: this.titular_sexo,
			titular_data_nascimento: this.titular_data_nascimento,
			titular_cpf: this.titular_cpf,
			titular_rg: this.titular_rg,
			titular_estado_civil: this.titular_estado_civil,
			titular_endereco_rua: this.titular_endereco_rua,
			titular_endereco_bairro: this.titular_endereco_bairro,
			titular_numero: this.titular_numero,
			titular_endereco_complemento: this.titular_endereco_complemento,
			titular_endereco_referencia: this.titular_endereco_referencia,
			titular_cidade: this.titular_cidade,
			titular_uf: this.titular_uf,
			titular_cep: this.titular_cep,
			titular_tel_residencial: this.titular_tel_residencial,
			titular_tel_comercial: this.titular_tel_comercial,
			titular_tel_celular: this.titular_tel_celular,
			titular_seguro_saude: this.titular_seguro_saude,
			titular_urgencia_contato_nome: this.titular_urgencia_contato_nome,
			titular_urgencia_telefone: this.titular_urgencia_telefone,
			titular_urgencia_email: this.titular_urgencia_email,
			titular_urgencia_cpf : this.titular_urgencia_cpf,
			titular_urgencia_rg : this.titular_urgencia_rg,
			titular_email : this.titular_email,
			nome_preposto: this.nome_preposto,
			cpf_preposto: this.cpf_preposto,
			titular_nome_mae: this.titular_nome_mae,
			carteira_sus: this.carteira_sus,
			codigo_carencia: this.codigo_carencia,
			ramal: this.ramal,
			idade: this.idade,
		};
	}

	public getEmpresa(){
		return {
			pj_cnpj:this.pj_cnpj,
			pj_razao_social:this.pj_razao_social,
			pj_ramo_atividade:this.pj_ramo_atividade,
			pj_nome_fantasia:this.pj_nome_fantasia,
			pj_inscricao_municipal:this.pj_inscricao_municipal,
			pj_endereco_rua:this.pj_endereco_rua,
			pj_endereco_complemento:this.pj_endereco_complemento,
			pj_endereco_bairro:this.pj_endereco_bairro,
			pj_endereco_cep:this.pj_endereco_cep,
			pj_endereco_cidade:this.pj_endereco_cidade,
			pj_endereco_uf:this.pj_endereco_uf,
			pj_fax:this.pj_fax,
			pj_telefone:this.pj_telefone,
			pj_endereco_referencia:this.pj_endereco_referencia,
			pj_reponsavel_nome: this.pj_reponsavel_nome,
			pj_responsavel_cpf: this.pj_responsavel_cpf,
			pj_responsavel_cargo: this.pj_responsavel_cargo,
			pj_responsavel_telefone: this.pj_responsavel_telefone,
			pj_responsavel_email: this.pj_responsavel_email,
			pj_cobranca_endereco_mesmo_endereco:this.pj_cobranca_endereco_mesmo_endereco,
			pj_cobranca_endereco_cep:this.pj_cobranca_endereco_cep,
			pj_cobranca_endereco_rua:this.pj_cobranca_endereco_rua,
			pj_cobranca_endereco_bairro:this.pj_cobranca_endereco_bairro,
			pj_cobranca_endereco_cidade:this.pj_cobranca_endereco_cidade,
			pj_cobranca_endereco_uf:this.pj_cobranca_endereco_uf,
			pj_cobranca_endereco_complemento:this.pj_cobranca_endereco_complemento,
			pj_cobranca_telefone:this.pj_cobranca_telefone,
			pj_cobranca_fax:this.pj_cobranca_fax,
		};
	}

	public getValidatorsTitular(){
		return [
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
		]
	}

	public getValidatorsEmpresa(){
		return [
			{
				key: "pj_cnpj",
				validators : [
					Validators.required,
					validateCnpj
				]
			},
			{
				key: "pj_nome_fantasia",
				validators : [
					Validators.required,
				]
			},
			{
				key: "pj_endereco_rua",
				validators : [
					Validators.required,
					Validators.maxLength(150)
				]
			},
			{
				key: "pj_endereco_complemento",
				validators : [
					Validators.required,
					Validators.maxLength(20)
				]
			},
			{
				key: "pj_endereco_referencia",
				validators : [
					Validators.required,
					Validators.maxLength(120)
				]
			},
			{
				key: "pj_endereco_bairro",
				validators : [
					Validators.required,
					Validators.maxLength(50)
				]
			},
			{
				key: "pj_endereco_cidade",
				validators : [
					Validators.required,
					Validators.maxLength(50)
				]
			},
			{
				key: "pj_endereco_uf",
				validators : [
					Validators.required,
					Validators.maxLength(20)
				]
			},
			{
				key: "pj_endereco_cep",
				validators : [
					Validators.required
				]
			},
			{
				key: "pj_cobranca_endereco_complemento",
				validators : [
					Validators.required,
					Validators.maxLength(20)
				]
			},
			{
				key: "pj_cobranca_endereco_bairro",
				validators : [
					Validators.required,
					Validators.maxLength(50)
				]
			},
			{
				key: "pj_endereco_cidade",
				validators : [
					Validators.required,
					Validators.maxLength(50)
				]
			},
			{
				key: "pj_cobranca_endereco_uf",
				validators : [
					Validators.required,
					Validators.maxLength(20)
				]
			},
			{
				key: "pj_cobranca_endereco_rua",
				validators : [
					Validators.required
				]
			},
			{
				key: "pj_cobranca_endereco_cidade",
				validators : [
					Validators.required
				]
			},
			{
				key: "pj_cobranca_endereco_cep",
				validators : [
					Validators.required
				]
			},
			{
				key: "pj_responsavel_cpf",
				validators : [
					Validators.required,
					validateCpf
				]
			},
			{
				key: "pj_reponsavel_nome",
				validators : [
					Validators.required
				]
			},
			{
				key: "pj_responsavel_cargo",
				validators : [
					Validators.required
				]
			},
			{
				key: "pj_responsavel_telefone",
				validators : [
					Validators.required
				]
			},
			{
				key: "pj_responsavel_email",
				validators : [
					Validators.required
				]
			},
		];
	}
	public getValidators(){
		return [
			{
				key: "tipo_pessoa",
				validators : [
					Validators.required,
				]
			},
			{
				key: "tabela",
				validators : [
					Validators.required,
					validateAutocomplete
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
			"e_exportado" : 0,
			"e_assinatura_presencial" : 0,
			"e_repasse" : 0,
			"e_conferida" : 0,
			"tipo_servico_id" : 556
		});

		proposta.vidas.push(new Vida({
			"proposta_id": 6340,
			"nome": "Teste iwwa",
			"cpf": "17450578549",
			"valor": 148,
			"sexo": "Masculino",
			"data_nascimento": "1958-07-08",
			"e_titular": "1",
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
