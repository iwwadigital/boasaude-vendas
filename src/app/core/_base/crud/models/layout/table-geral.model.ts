import { TableActionsConfig } from './table-actions-config.model';
export class TableGeral{
	public table_api:string;
	public return_api:string;
	public table:any[];
	public is_pagination:boolean = false;
	public pagination:any[];
	public column:string[];
	public title:string[];
	public has_class:boolean = false;
	public class:string[];
	public is_mobile:boolean = false;
	public is_sizes:boolean = false; // Edita o tamanho de cada coluna
	public sizes:any[]; // Edita o tamanho de cada coluna
	public actionsConfig:TableActionsConfig;
	public msg_error:string; // CASO N ENCONTRE NADA
	public is_filter:boolean = true;
	public is_pagination_length:boolean = true;
	public has_search_filial:boolean = false;
	public has_search_filial_id:boolean = false;
	public page:any;

	public filters:any[];

	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
    }
}
