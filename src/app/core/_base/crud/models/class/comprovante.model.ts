export class Comprovante{
	public id:number;
	public proposta_id:number;
	public nome:string;
	public midia_url:string;
	public media:any;
	public is_anexo:number;
	public is_comprovante_universitario:number;
	public constructor(init?: Partial<Comprovante>) {
        Object.assign(this, init);
    }
}
