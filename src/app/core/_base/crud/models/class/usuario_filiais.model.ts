import { Validators } from '@angular/forms';

export class UsuarioFilial{
	public id:number = null;
	public cidade:string = null;
	public inscricao:string = null;
	public usuario_id:string = null;
	public filial:any = null;
	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
    }

    public getValidators(){
		return [
			{
				key: "filial",
				validators : [
					Validators.required
				]
			},
		]
	}
}
