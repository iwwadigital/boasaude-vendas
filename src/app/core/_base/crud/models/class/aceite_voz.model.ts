import { Usuario } from './usuario.model';
export class AceiteVoz{
	public id:number = null;
	public proposta_id:number = null;
	public data_aceite_voz:string = null;
	public data_validada:string = null;
	public telefone:string = null;
	public status:string;
	public data_criacao:string;
	public criador_id:number;
	public validador_id:number;
	public criador:Usuario;
	public validador:Usuario;
	public is_modal_edit:boolean = false;
	public constructor(init?: Partial<AceiteVoz>) {
        Object.assign(this, init);
    }
}
