import { FormGroup, Validators } from '@angular/forms';
import { Transacao } from './transacao.model';
import { PagamentoTipo } from './pagamento_tipo.model';
import { validateCpf } from '../../utils/validate_cpf.service';
export class Pagamento{
	public id:number = null;
	public proposta_id:number  = null;
	public pagamento_tipo_id:any = null;
	public transacao_id:any = null;
	public valor:number = null;
	public pagamento_online:any = 0;
	//CONTA
	public banco:string = null;
	public numero_agencia:string = null;
	public numero_conta:string = null;
	public conta_tipo:string = null;
	//CARTAO
	public cartao_numero:string = null;
	public cartao_validade:string = null;
	public cartao_nome:string = null;
	public cartao_bandeira:string = null;
	public cartao_cvv:string = null;
	//REPASE
	public n_matricula_empresa:string = null;
	// DINHEIRO
	public fiador:string = null;
	public nome_pagador:string = null;
	public rua_pagador:string = null;
	public bairro_pagador:string = null;
	public complemento_pagador:string = null;
	public numero_endereco_pagador:string = null;
	public cidade_pagador:string = null;
	public estado_pagador:string = null;
	public cep_pagador:string = null;
	public telefone_pagador:string = null;
	//
	public pagamento_tipo:PagamentoTipo = null;
	public transacao:Transacao;
	

	//Usado na tabela proposta
	public periodicidade:string; // LEmbrar de criar no banco
	public observacao:string = null;
	// Pagamento
	public correspondencia:string;
	public cobranca_responsavel_nome:string = null;
	public pagamento_data_vencimento:string = null;
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
	public cobranca_endereco_complemento:string = null;
	public cobranca_cidade:string = null;
	public cobranca_uf:string = null;
	public cobranca_cep:string = null;
	public cobranca_email:string = null;
	public cobranca_endereco_numero:string = null;
	public cobranca_endereco_referencia:string = null;
	

	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
	}
	public getCobranca(){
		return {
			periodicidade : this.periodicidade,
			correspondencia : this.correspondencia,
			cobranca_responsavel_nome : this.cobranca_responsavel_nome,
			cobranca_cpf : this.cobranca_cpf,
			cobranca_cnpj : this.cobranca_cnpj,
			cobranca_rg : this.cobranca_rg,
			cobranca_sexo : this.cobranca_sexo,
			cobranca_nascimento : this.cobranca_nascimento,
			cobranca_tel_comercial : this.cobranca_tel_comercial,
			cobranca_tel_residencial : this.cobranca_tel_residencial,
			cobranca_tel_celular : this.cobranca_tel_celular,
			cobranca_endereco_rua : this.cobranca_endereco_rua,
			cobranca_endereco_bairro : this.cobranca_endereco_bairro,
			cobranca_endereco_numero : this.cobranca_endereco_numero,
			cobranca_cidade : this.cobranca_cidade,
			cobranca_uf : this.cobranca_uf,
			cobranca_cep : this.cobranca_cep,
			cobranca_email : this.cobranca_email,
			cobranca_endereco_referencia : this.cobranca_endereco_referencia,
		}
	}

	public getValidators(){
		return [
			{
				key: "valor",
				validators : [
					Validators.required
				]
			},
			{
				key: "pagamento_tipo",
				validators : [
					Validators.required
				]
			},
		]
	}

	public getValitatorsRepasse(){
		return [
			{
				key: "n_matricula_empresa",
				validators : [
					Validators.required,
					Validators.maxLength(20)
				]
			}
		]
	}
	public getValitatorsDinheiroFiador(){
		return [
			{
				key: "fiador",
				validators : [
					Validators.required
				]
			},
		]
	}
	public getValitatorsDinheiro(){
		return [
			{
				key: "nome_pagador",
				validators : [
					Validators.required,
					Validators.maxLength(120)
				]
			},
			{
				key: "cep_pagador",
				validators : [
					Validators.required
				]
			},
			{
				key: "rua_pagador",
				validators : [
					Validators.required,
					Validators.maxLength(200)
				]
			},
			{
				key: "bairro_pagador",
				validators : [
					Validators.required,
					Validators.maxLength(60)
				]
			},
			{
				key: "numero_endereco_pagador",
				validators : [
					Validators.required,
					Validators.maxLength(30)
				]
			},
			{
				key: "cidade_pagador",
				validators : [
					Validators.required,
					Validators.maxLength(60)
				]
			},
			{
				key: "complemento_pagador",
				validators : [
					Validators.maxLength(20)
				]
			},
			{
				key: "estado_pagador",
				validators : [
					Validators.required,
					Validators.maxLength(60)
				]
			},
			{
				key: "telefone_pagador",
				validators : [
					Validators.required
				]
			},
		]
	}

	public getValidatorsCartao(){
		return [
			{
				key: "cartao_numero",
				validators : [
					Validators.required,
					Validators.maxLength(120)
				]
			},
			{
				key: "cartao_validade",
				validators : [
					Validators.required
				]
			},
			{
				key: "cartao_nome",
				validators : [
					Validators.maxLength(120)
				]
			},
			{
				key: "cartao_bandeira",
				validators : [
					Validators.required
				]
			},
			{
				key: "cartao_cvv",
				validators : []
			},
		];
	}
	public getValidatorsCartaoDeb(){
		return [
			{
				key: "cartao_numero",
				validators : [
					Validators.required,
					Validators.maxLength(120)
				]
			},
			{
				key: "cartao_validade",
				validators : [
					Validators.required
				]
			},
			{
				key: "cartao_nome",
				validators : [
					Validators.maxLength(120)
				]
			},
			{
				key: "cartao_bandeira",
				validators : [
					Validators.required
				]
			},
		];
	}
	public getValidatorsConta(){
		return [
			{
				key: "banco",
				validators : [
					Validators.required
				]
			},
			{
				key: "numero_agencia",
				validators : [
					Validators.required,
					Validators.maxLength(50)
				]
			},
			{
				key: "numero_conta",
				validators : [
					Validators.required,
					Validators.maxLength(50)
				]
			},
			// {
			// 	key: "conta_tipo",
			// 	validators : [
			// 		// Validators.required,
			// 		Validators.maxLength(50)
			// 	]
			// },
		];
	}

	public getValidatorsCobranca(){
		return [
			{
				key: "cobranca_responsavel_nome",
				validators : [
					Validators.required,
					Validators.maxLength(120)
				]
			},
			{
				key: "pagamento_data_vencimento",
				validators : [
					Validators.required
				]
			},
			{
				key: "cobranca_nascimento",
				validators : [
					Validators.required
				]
			},
			{
				key: "cobranca_sexo",
				validators : [
					Validators.required
				]
			},
			{
				key: "cobranca_tel_residencial",
				validators : [
					Validators.required
				]
			},
			{
				key: "cobranca_endereco_rua",
				validators : [
					Validators.required,
					Validators.maxLength(150)
				]
			},
			{
				key: "cobranca_endereco_complemento",
				validators : [
					Validators.required,
					Validators.maxLength(20)
				]
			},
			{
				key: "cobranca_endereco_numero",
				validators : [
					Validators.required,
					Validators.maxLength(20)
				]
			},
			{
				key: "cobranca_endereco_referencia",
				validators : [
					Validators.required,
					Validators.maxLength(120)
				]
			},
			{
				key: "cobranca_endereco_bairro",
				validators : [
					Validators.required,
					Validators.maxLength(50)
				]
			},
			{
				key: "cobranca_cidade",
				validators : [
					Validators.required,
					Validators.maxLength(50)
				]
			},
			{
				key: "cobranca_uf",
				validators : [
					Validators.required,
					Validators.maxLength(20)
				]
			},
			{
				key: "cobranca_cep",
				validators : [
					Validators.required
				]
			},
		]
	}

	public static changeTipoPessoaCobranca(event:any,form:FormGroup){
		if(event.value == "2"){
			form.get("mensalidade").get("cobranca_nascimento").clearValidators();
			form.get("mensalidade").get("cobranca_nascimento").updateValueAndValidity();
		}else{
			form.get("mensalidade").get("cobranca_nascimento").setValidators(Validators.required);
		}
	}
}
