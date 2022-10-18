import { Observacao } from './observacao.model';
import { Usuario } from './usuario.model';
export class Pendencia{
	public id:number = null;
	public proposta_id:number  = null;
	public status:string = null;
	public criador_id:number = null;
	public validado_por_id:number = null;
	public data_criacao:string = null;
	public data_resolvido:string = null;
	public observacao:Observacao[];
	public observacoes:Observacao[];
	public criador:Usuario;
	public validado_por:Usuario;
	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
    }
}
