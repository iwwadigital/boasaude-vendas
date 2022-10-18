import { Permissao } from './permissao.model';
export class UsuarioTipo{
	public id:number;
	public nome:string;
	public permissoes_id:number[];
	public permissoes:Permissao[];
	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
    }
}
