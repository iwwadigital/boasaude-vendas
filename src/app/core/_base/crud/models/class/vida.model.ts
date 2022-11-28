import { Validators } from '@angular/forms';
import { DadoClinico } from './dado_clinico.model';
import { validateCpf } from '../../utils/validate_cpf.service';
import { SeguroSaude } from './seguro_saude.model';
import { FunctionsService } from '../../utils/functions.service';
export class Vida{
	public id:string = null;
	public proposta_id:number = null;
	public nome:string = null;
	public cpf:string = null;
	public valor:number = null;
	public sexo:string = null;
	public data_nascimento:any = null;
	public is_titular:any = null;
	public dados_clinicos:DadoClinico[] = null;
	public nome_preposto:string = null;
	public cpf_preposto:string = null;
	
	//Parte 2
	public estado_civil:string = null;
	public tel_comercial:string = null;
	public tel_celular:string = null;
	public tel_residencial:string = null;
	public email:string = null;
	public responsavel_tit:string = null;
	public tel_responsavel_tit:string = null;
	//Endereco
	public rua:string = null;
	public bairro:string = null;
	public cep:string = null;
	public complemento:string = null;
	public referencia:string = null;
	public numero:string = null;
	public cidade:string = null;
	public estado:string = null;
	public seguro_saude:SeguroSaude = null;
	public seguro_saude_id:number = null;
	
	public is_dado_clinicios_edited = false;
	public is_modal_edit = true;
	public is_cpf_webService = false;

	//
	public nome_mae:string = null;
	public grau_parentesco:string = null;
	public idade:number = null;
	public codigo_carencia:string = null;
	public carteira_sus:string = null;
	public e_endereco_titular:string = null;


	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
	}

	public getCamposModal(){
		return {
			rua : this.rua,
			bairro : this.bairro,
			cidade : this.cidade,
			cep : this.cep,
			complemento : this.complemento,
			referencia : this.referencia,
			estado : this.estado,
			numero : this.numero,
			estado_civil : this.estado_civil,
			tel_comercial : this.tel_comercial,
			tel_celular : this.tel_celular,
			tel_residencial : this.tel_residencial,
			email : this.email,
			responsavel_tit : this.responsavel_tit,
			tel_responsavel_tit : this.tel_responsavel_tit,
			e_endereco_titular : this.e_endereco_titular,
			nome_mae : this.nome_mae,
			idade : this.idade,
			grau_parentesco : this.grau_parentesco,
			codigo_carencia : this.codigo_carencia,
			carteira_sus : this.carteira_sus,
		};
	}

	public getValidators(){
		return [
			{
				key: "nome",
				validators : [
					Validators.required,
					Validators.maxLength(150)
				]
			},
			{
				key: "cpf",
				validators : [
					// Validators.required,
					validateCpf
				]
			},
			{
				key: "valor",
				validators : [
					Validators.required
				]
			},
			{
				key: "sexo",
				validators : [
					Validators.required
				]
			},
			{
				key: "data_nascimento",
				validators : [
					Validators.required
				]
			}
		]
	}

	public getValidatorsInfo(){
		return [
			{
				key: "rua",
				validators : [
					Validators.required,
					Validators.maxLength(150)
				]
			},
			{
				key: "bairro",
				validators : [
					Validators.required,
					Validators.maxLength(100)
				]
			},
			{
				key: "cep",
				validators : [
					Validators.required
				]
			},
			{
				key: "cidade",
				validators : [
					Validators.required,
					Validators.maxLength(100)
				]
			},
			{
				key: "estado",
				validators : [
					Validators.required,
					Validators.maxLength(60)
				]
			},
			{
				key: "tel_residencial",
				validators : [
					Validators.required
				]
			},
			{
				key: "estado_civil",
				validators : [
					Validators.required
				]
			},
			{
				key: "complemento",
				validators : [
					Validators.required,
					Validators.maxLength(20)
				]
			},
			{
				key: "referencia",
				validators : [
					Validators.required,
					Validators.maxLength(200)
				]
			},
			{
				key: "numero",
				validators : [
					Validators.required,
					Validators.maxLength(200)
				]
			},
			{
				key: "email",
				validators : [
					Validators.email,
					Validators.maxLength(150)
				]
			},
		]
	}

	public static returnVidaTitular(form:any):Vida{
		let functions = new FunctionsService(null,null);
		let vida = new Vida();
		vida.is_titular = 1;
		vida.id = functions.generateAlphaNumeric();
		vida.nome = form.value.titular_nome;
		vida.sexo = form.getRawValue().titular_sexo;
		vida.data_nascimento = form.getRawValue().titular_data_nascimento;
		vida.cpf = form.value.titular_cpf;
		vida.rua = form.value.titular_endereco_rua;
		vida.cep = form.value.titular_cep;
		vida.bairro = form.value.titular_endereco_bairro;
		vida.cidade = form.value.titular_cidade;
		vida.estado = form.value.titular_uf;
		vida.numero = form.value.titular_numero;
		vida.estado_civil = form.getRawValue().titular_estado_civil;
		vida.tel_residencial = form.value.titular_tel_residencial;
		vida.tel_comercial = form.value.titular_tel_comercial;
		vida.tel_celular = form.value.titular_tel_celular;
		vida.complemento = form.value.titular_endereco_complemento;
		vida.referencia = form.value.titular_endereco_referencia;
		vida.email = form.value.titular_urgencia_email;
		vida.tel_responsavel_tit = form.value.titular_urgencia_telefone;
		vida.responsavel_tit = form.value.titular_urgencia_contato_nome;
		vida.nome_preposto = form.value.nome_preposto;
		vida.cpf_preposto = form.value.cpf_preposto;
		if(!functions.isEmpty(form.value.seguro_saude)){
			vida.seguro_saude_id = form.value.seguro_saude.id;
		}
		return vida;
	}
}
