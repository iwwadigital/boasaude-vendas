import { Usuario } from './usuario.model';
import { MetaEquipe } from './meta_equipe.model';
import { MetaUsuario } from './meta_usuario.model';

export class Equipe{
	public id:number = null;
	public nome:string = null;
	public cidade:string = null;
	public usuarios:Usuario[];

	public metas_equipe:MetaEquipe[];
	public metas_usuarios:MetaUsuario[];

	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
    }
}
