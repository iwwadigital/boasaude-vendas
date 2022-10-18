export class Permissao{
	public id:number;
	public nome:string;
	public permissao:string;
	public descricao:string;

	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
    }
}
