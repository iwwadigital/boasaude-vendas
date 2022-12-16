import { ModalDeleteComponent } from './../../modal-delete/modal-delete.component';
import { FunctionsService } from './../../../../../../core/_base/crud/utils/functions.service';
import { Component, OnInit, Input, ChangeDetectorRef, Output,EventEmitter } from "@angular/core";
import { MatDialogConfig, MatDialog } from '@angular/material';

@Component({
	selector: 'kt-column-action',
	templateUrl : './column-action.component.html',
	styleUrls : ['./column-action.component.scss'],
})
export class ColumnActionComponent implements OnInit{
	@Input() config;
	@Input() dados;
	@Input() type;
	@Input() table_api;
	@Output() refreshTable = new EventEmitter();
	public icon:string;
	public is_modal:boolean = false;
	public url:string ="";
	public permissao:string = "";
	public class:string = '';
	public modal_class:string = "";
	constructor(
		public functions:FunctionsService,
		private dialog:MatDialog,
		private cdr:ChangeDetectorRef
	){}
 	ngOnInit(){
		console.log(this.config)
		switch(this.type){
			case "view":{
				this.icon = 'remove_red_eye';
				if(this.config.has_modal_view){
					this.is_modal = true;
				}else{
					this.url = `${this.config.path_view}/${this.dados.id}`;
				}
				this.permissao = `${this.table_api}-ver`;
				this.class = "btn-action-view";
				if(this.config.modal_component_view_class){
					this.modal_class = this.config.modal_component_view_class;
				}
				
				break;
			}
			case "edit":{
				this.icon = 'edit';
				if(this.config.has_modal_edit){
					this.is_modal = true;
				}else{
					this.url = `${this.config.path_view}/${this.dados.id}`;
				}
				this.permissao = `${this.table_api}-editar`;
				this.class = "btn-action-edit";
				if(this.config.modal_component_edit_class){
					this.modal_class = this.config.modal_component_edit_class;
				}
				
				break;
			}
			case "delete":{
				this.icon = 'remove_circle';
				
				if(this.config.has_modal_delete){
					this.is_modal = true;
				}
				this.permissao = `${this.table_api}-deletar`;
				this.class = "btn-action-delete";
				if(this.config.modal_component_delete_class){
					this.modal_class = this.config.modal_component_delete_class;
				}
				break;
			}
		}
	}

	

	public openModal(class_panel?:any){
		let modal_config:MatDialogConfig = new MatDialogConfig();
		if(this.type !== "delete"){
			modal_config.panelClass = !class_panel ? "modal-custom" : class_panel;
		}else{
			modal_config.panelClass = "modal-delete"
		}
		modal_config.minWidth = 1320;
		// modal_config.minHeight = 400;
		switch(this.type){
			case "view":{
				this.functions.openModal(this.config.modal_component_view);
				break;
			}
			case "edit":{
				modal_config.data = this.dados;
				let dialogRef:any = this.functions.openModal(this.config.modal_component_edit,modal_config);
				dialogRef.componentInstance.response.subscribe((resp:any) =>{
					this.dialog.closeAll();
					if(resp.success){
						this.functions.printSnackBar(resp.message);
						this.cdr.detectChanges();
					}else{
						this.functions.printSnackBar(resp.message);
					}
					this.emitResponse(resp);
				},(erro:any)=>{
					this.functions.printMsgError(erro);
				});
				break;
			}
			case "delete":{
				modal_config.minHeight = 200;
				modal_config.minWidth = 200;
				modal_config.data = {
					id: this.dados.id,
					tabela: this.table_api,
					msg: "Tem certeza que deseja deletar?"
				};
				let dialogRef:any = this.functions.openModal(ModalDeleteComponent,modal_config);
				dialogRef.componentInstance.response.subscribe((resp:any) =>{
					this.dialog.closeAll();
					if(resp.success){
						this.functions.printSnackBar(resp.message);
						this.cdr.detectChanges();
					}else{
						this.functions.printSnackBar(resp.message);
					}
					this.emitResponse(resp);
				},(erro:any)=>{
					this.functions.printMsgError(erro);
				});
				break;
			}
		}
		this.cdr.detectChanges();
	}

	public emitResponse(response){
		this.refreshTable.emit(response);
	}
}
