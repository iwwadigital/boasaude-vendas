export class Transacao{
	public id:number;
	public nome:string;
	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
    }
}
