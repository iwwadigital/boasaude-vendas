import { Validators } from "@angular/forms";

export class FichaVisita{
    public endereco:string = null;
	public id:number = null;
    public rua:string = null;
	public bairro:string = null;
	public numero:string = null;
	public complemento:string = null;
	public referencia:string = null;
	public cidade:string = null;
	public uf:string = null;
    public cep:string = null;
    public nome:string = null;
    public telefone:string = null;
    public telefone_contato:string = null;
    
    public turno:string = null;
    public data:string = null;
    public data_criacao:string = null;
    public oque_fazer:any = null;
    public proposta_id:number = null;
    public usuario_id:number = null;

    public constructor(init?: Partial<any>) {
        Object.assign(this, init);
    }
    
    public getValidators(){
		return [
			{
				key: "data",
				validators : [
					Validators.required
				]
			},
			{
				key: "turno",
				validators : [
					Validators.required
				]
			},
			// {
			// 	key: "oque_fazer",
			// 	validators : [
			// 		Validators.required
			// 	]
			// },
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
				key: "nome",
				validators : [
					Validators.required,
					Validators.maxLength(150)
				]
			},
			{
				key: "telefone",
				validators : [
					Validators.required,
					Validators.maxLength(15)
				]
			},
			{
				key: "telefone_contato",
				validators : [
					Validators.maxLength(15)
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