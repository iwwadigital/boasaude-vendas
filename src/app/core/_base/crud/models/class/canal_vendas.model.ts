import { Validators } from '@angular/forms';

export class CanalVendas{
    public id:number = null;
    public nome:string = null;
    public constructor(init?: Partial<CanalVendas>) {
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
		]
	}
}