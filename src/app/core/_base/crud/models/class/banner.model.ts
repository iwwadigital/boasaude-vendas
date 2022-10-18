import { Validators } from '@angular/forms';

export class Banner{
    public id:number;
	public equipe_id:number;
	public nome:string;
	public nome_arquivo:string;
	public nome_arquivo_mobile:string;
	public data_criacao:string;
	public data_expiracao:string;
	public status:string;
	public midia_url:string;
	public midia_url_mobile:string;
	public media:any;
	public constructor(init?: Partial<Banner>) {
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
				key: "equipe_id",
				validators : [
					Validators.required
				]
			},
		]
	}
}