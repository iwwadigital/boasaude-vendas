import { Pergunta } from './pergunta.model';
export class DadoClinico{
	public id:number = null;
	public vida_id:number = null;
	public pergunta_id:number = null;
	public resposta:string = null;
	public qual:string = null;
	public pergunta:Pergunta;
	public constructor(init?: Partial<DadoClinico>) {
        Object.assign(this, init);
    }
}
