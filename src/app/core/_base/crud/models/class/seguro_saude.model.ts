import { Validators } from "@angular/forms";

export class SeguroSaude{
	public id:number = null;
	public nome:string = null;
	public codigo:string =null;
	public cidade:any =null;
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
				key: "codigo",
				validators : [
					Validators.required,
					Validators.maxLength(3),
				]
			},
		]
	}
}
