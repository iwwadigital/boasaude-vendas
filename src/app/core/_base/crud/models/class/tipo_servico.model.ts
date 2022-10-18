import { Validators } from '@angular/forms';

export class TipoServico{
	public id:number = null;
	public nome:string = null;
	public grupo_empresa:string = null;
	public numero_contrato:string = null;
	public versao_contrato:string = null;
	public sub_contrato:string = null;
	public versao_subcontrato:string = null;
	public cidade:string = null;
	public clausulas_contratuais:string = null;
	public usuario_vendedor_id:number = null;
	public usuario_vendedor:any = null;
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
				key: "grupo_empresa",
				validators : [
					Validators.required
				]
			}
		]
	}
}
