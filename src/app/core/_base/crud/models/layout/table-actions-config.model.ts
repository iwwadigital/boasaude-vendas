export class TableActionsConfig{
	public icon_view:string;
	public icon_edit:string;
	public icon_delete:string;

	public exibir_btn:any = {
		view: true,
		edit: true,
		delete: true
	}

	//Class
	public class_view:string[];
	public class_edit:string[];
	public class_delete:string[];

	// Tem modal?
	public has_modal_view:boolean = false;
	public has_modal_edit:boolean = false;
	public has_modal_delete:boolean = false;
	// Qual modal
	public modal_component_view:any;
	public modal_component_edit:any;
	public modal_component_delete:any;

	//Class modal
	public modal_component_view_class:string;
	public modal_component_edit_class:string;
	public modal_component_delete_class:string;

	//Else modal
	public path_view:string;
	public path_edit:string;
	public path_delete:string;

}
