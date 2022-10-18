import { Validators } from '@angular/forms';

export class Meta{
	public id:number = null;
	public qtd_vidas:number = null;
	public data_inicio:string = null;
	public data_fim:string = null;
	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
	}
	
	public getValidators(){
		return [
			{
				key: "qtd_vidas",
				validators : [
					Validators.required
				]
			},
			{
				key: "data_inicio",
				validators : [
					Validators.required
				]
			},
			{
				key: "data_fim",
				validators : [
					Validators.required
				]
			},
		]
	}
}
