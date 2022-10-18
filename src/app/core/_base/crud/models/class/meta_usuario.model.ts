import { Usuario } from './usuario.model';
import { Meta } from './meta.model';
export class MetaUsuario extends Meta{
	public usuario_id:number = null;
	public usuario:Usuario;
	public constructor(init?: Partial<any>) {
		super();
		Object.assign(this, init);
    }
}
