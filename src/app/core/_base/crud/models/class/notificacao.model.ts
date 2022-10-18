export class Notificacao{
	public id:number;
	public usuario_id:number;
	public visto:number;
	public mensagem:string;
	public url:string;
	public data_entregue:string;
	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
    }
}
