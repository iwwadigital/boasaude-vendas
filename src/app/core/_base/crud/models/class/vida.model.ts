import { Validators } from '@angular/forms';
import { DadoClinico } from './dado_clinico.model';
import { validateCpf } from '../../utils/validate_cpf.service';
import { SeguroSaude } from './seguro_saude.model';
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


	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
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
			{
				key: "seguro_saude",
				validators : [
					Validators.required
				]
			},
		]
	}
}
