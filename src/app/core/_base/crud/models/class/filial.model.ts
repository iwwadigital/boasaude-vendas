import { Validators } from '@angular/forms';
import { TipoServico } from './tipo_servico.model';

export class Filial {
	public id:number = null;
	public nome:string = null;
	public slug:string = null;
	public logo:string = null;
	public clausulas_contratuais:string = null;
	public rua:string = null;
	public complemento:string = null;
	public cidade:string = null;
	public cep:string = null;
	public numero:string = null;
	public bairro:string = null;
	public estado:string = null;
	public telefone:string = null;
	public nome_site:string = null;
	
	public adesao_texto_pagamento:string = null;
	public mensalidade_texto_pagamento:string = null;
	public mensalidade_cartao_id:number = null;
	public mensalidade_boleto_id:number = null;
	public mensalidade_cobranca_repasse_id:number = null;
	public mensalidade_desconto_folha_id:number = null;
	public mensalidade_conta_id:number = null;
	public tipo_servico_desconto_folha_ids:string = null;
	public tipo_servico_universitario_id:number = null;
	public tipo_servico_telemedicina_id:number = null;
	public pode_importar:number = 0;

	public tipo_servico_universitario:TipoServico = null;
	public tipo_servico_telemedicina:TipoServico = null;
	public endereco:any = null;
	public regraNegocio:any = null;
	public metodoPagamento:any = null;

	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
	}
	public getValidators(){
		return [
			{
				key: "nome",
				validators : [
					Validators.required,
                    Validators.maxLength(60)
				]
			},
			{
				key: "slug",
				validators : [
					Validators.required,
                    Validators.maxLength(60)
				]
			},
		]
	}

	public getEndereco(){
		return {
				rua : this.rua,
				complemento : this.complemento,
				cidade : this.cidade,
				cep : this.cep,
				numero : this.numero,
				bairro : this.bairro,
				estado : this.estado,
			};
	}

	public getRegraNegocio(){
		return {
			adesao_texto_pagamento: this.adesao_texto_pagamento,
			mensalidade_texto_pagamento: this.mensalidade_texto_pagamento,
		}
	}

	public getPagamento(){
		return {
			mensalidade_cartao_id : this.mensalidade_cartao_id,
			mensalidade_boleto_id : this.mensalidade_boleto_id,
			mensalidade_cobranca_repasse_id : this.mensalidade_cobranca_repasse_id,
			mensalidade_conta_id : this.mensalidade_conta_id,
			mensalidade_desconto_folha_id : this.mensalidade_desconto_folha_id,
		}
	}
}
