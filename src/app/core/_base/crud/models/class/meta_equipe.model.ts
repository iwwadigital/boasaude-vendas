import { Equipe } from './equipe.model';
import { Meta } from './meta.model';
export class MetaEquipe extends Meta{
	public equipe_id:number;
	public equipe:Equipe;
	public constructor(init?: Partial<any>) {
		super();
		Object.assign(this, init);
    }
}
