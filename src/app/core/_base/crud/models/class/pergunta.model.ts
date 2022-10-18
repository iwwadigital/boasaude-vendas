export class Pergunta{
	public id:number = null;
	public nome:string = null;
	public tipo_campo:string =null;
	public opcoes:string =null;
	public has_qual:number =null;

	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
    }
}
