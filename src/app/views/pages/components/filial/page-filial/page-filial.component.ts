import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TableGeral } from '../../../../../core/_base/crud/models/layout/table-geral.model';
import { TableActionsConfig } from '../../../../../core/_base/crud/models/layout/table-actions-config.model';
import { FunctionsService } from '../../../../../core/_base/crud/utils/functions.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Usuario } from '../../../../../core/_base/crud/models/class/usuario.model';
import { ModalFilialComponent } from '../modal-filial/modal-filial.component';

@Component({
	selector: 'kt-page-filial',
	styleUrls : ['./page-filial.component.scss'],
	templateUrl : './page-filial.component.html',
	
})
export class PageFilialComponent implements OnInit, OnDestroy{
	private subs:Subscription = new Subscription();
    public table_config:TableGeral;
	public columns:string[] = ["nome","slug","edit"];
	public titles:string[] = ["Filial","Slug","Editar"];
	public actionConfig:TableActionsConfig;
	public search:any = {};
	public is_refresh = false;
	public usuario:Usuario;
	public form = new FormGroup({
		filtro : new FormControl(null)
	})
	constructor(
		public functions:FunctionsService,
		private dialog:MatDialog,
		private cdr:ChangeDetectorRef
	){}
    ngOnInit(){
		this.usuario = this.functions.getUsuario();
	
        this.actionConfig = new TableActionsConfig();
		this.actionConfig.icon_view = "remove_red_eye";
		this.actionConfig.icon_edit = "edit";
		this.actionConfig.icon_delete = "cancel";
		this.actionConfig.has_modal_edit = true;
		this.actionConfig.has_modal_delete = true;
		this.actionConfig.modal_component_edit = ModalFilialComponent;
		
		this.table_config = new TableGeral({
			table_api: "filial",
			return_api: "filiais",
			is_pagination : true,
			column : this.columns,
			title: this.titles,
			actionsConfig :this.actionConfig,
			has_search_filial : true,
			msg_error : "Nenhuma filial encontrada.",
			filters : [
				{
					value :'nome',
					title: "Nome"
				},
			]
		});
	}
	
	public openModal(){
		let modal_config:MatDialogConfig = new MatDialogConfig();
		// modal_config.panelClass = "modal-filial";
		modal_config.panelClass = "modal-custom";

		let modal_ref:any = this.dialog.open(ModalFilialComponent,modal_config);
		modal_ref.componentInstance.response.subscribe((resp:any) =>{
			this.dialog.closeAll();
			if(resp.success){
				this.functions.printSnackBar(resp.message);
				this.is_refresh = true;
				this.cdr.detectChanges();
			}else{
				this.functions.printSnackBar(resp.message);
			}
		});
    }

	public changeRefresh(event){
		this.is_refresh = false;
	}
	ngOnDestroy(){
		this.subs.unsubscribe();
	}
}