import { Validators } from '@angular/forms';
import { Produto } from './produto.model';

export class Tabela{
	public id:number = null;
	public nome:string = null;
	public status:any = null;

	public codigo_web_service:string = null;
	public codigo_int_web_service:string = null;
	public desreduzida:string = null;
	public cidade:string = null;
	public produtos:Produto[] = [];
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
			}
		]
	}
}
