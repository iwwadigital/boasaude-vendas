import { Validators } from '@angular/forms';

export class Endereco {
	public id:number = null;
	public rua:string = null;
	public cidade:string = null;
	public cep:string = null;
	public bairro:string = null;
	public uf:string = null;
	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
	}
	public getValidators(){
		return [
			{
				key: "rua",
				validators : [
					Validators.required
				]
			},
			{
				key: "cidade",
				validators : [
					Validators.required
				]
			},
			{
				key: "cep",
				validators : [
					Validators.required
				]
			},
			{
				key: "bairro",
				validators : [
					Validators.required
				]
			},
			{
				key: "uf",
				validators : [
					Validators.required,
					Validators.maxLength(2)
				]
			},
		]
	}
}
