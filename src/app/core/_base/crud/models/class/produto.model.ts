import { Tabela } from './tabela.model';
import { Validators } from '@angular/forms';
export class Produto{
	public id:number = null;
	public nome:string = null;
	public valor:number = null;
	public codigo_web_service:string = null;
	public codigo_int_web_service:string = null;
	public idade_inicial:number = null;
	public idade_final:number = null;
	public tabela_id:number;
	public tabela:Tabela = null;
	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
	}
	
	public getValidators(){
		return [
			{
				key: "nome",
				validators : [
					Validators.required
				]
			},
			{
				key: "valor",
				validators : [
					Validators.required
				]
			},
			{
				key: "tabela",
				validators : [
					Validators.required
				]
			}
		]
	}
}
