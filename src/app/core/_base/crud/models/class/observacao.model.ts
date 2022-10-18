export class Observacao{
	public id:number = null;
	public pendencia_id:number ;
	public usuario_id:number;
	public observacao:string = null;
	public data_criacao:string;
	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
    }
}
