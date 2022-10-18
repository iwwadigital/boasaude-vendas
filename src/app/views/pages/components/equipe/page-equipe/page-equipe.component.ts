import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TableGeral } from '../../../../../core/_base/crud/models/layout/table-geral.model';
import { TableActionsConfig } from '../../../../../core/_base/crud/models/layout/table-actions-config.model';
import { FunctionsService } from '../../../../../core/_base/crud/utils/functions.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ModalEquipeComponent } from './../modal-equipe/modal-equipe.component';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Usuario } from '../../../../../core/_base/crud/models/class/usuario.model';

@Component({
	selector: 'kt-page-equipe',
	styleUrls : ['./page-equipe.component.scss'],
	templateUrl : './page-equipe.component.html',
	
})
export class PageEquipeComponent implements OnInit, OnDestroy{
	private subs:Subscription = new Subscription();
    public table_config:TableGeral;
	public columns:string[] = ["nome","cidade","percent","usuarios_count","edit","view"];
	public titles:string[] = ["Equipe","Região","Vidas","Nº Vendedores","Editar","Visualizar"];
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
		this.actionConfig.modal_component_edit = ModalEquipeComponent;
		this.actionConfig.has_modal_view = false;
		this.actionConfig.path_view = "/equipe/view";
		
		let equipes_id = this.functions.array_column(this.usuario.equipes,"id");
		this.table_config = new TableGeral({
			table_api: "equipe",
			return_api: "equipes",
			is_pagination : true,
			column : this.columns,
			title: this.titles,
			actionsConfig :this.actionConfig,
			has_search_filial : true,
			msg_error : "Nenhuma equipe encontrada.",
			page : this.usuario.usuario_tipo_id != 1 ? {equipes_id: equipes_id.join(",")} : null,
			filters : [
				{
					value :'nome',
					title: "Nome"
				},
				{
					value :'cidade',
					title: "Região"
				},
			]
		});
		this.subs.add(
			this.functions.$filial.subscribe((value:any) =>{
				if(typeof value == "string"){
					this.search = {
						filial : value
					};
				}
			})
		);
	}
	
	public openModal(equipe?:any){
		let modal_config:MatDialogConfig = new MatDialogConfig();
		// modal_config.minHeight = 200;
		// modal_config.minWidth = 200;
		modal_config.panelClass = "modal-custom";

		if(!this.functions.isEmpty(equipe) && !this.functions.isEmptyObj(equipe)){
			modal_config.data = equipe;
		}else{
			modal_config.data = null;
		}

		let modal_ref:any = this.dialog.open(ModalEquipeComponent,modal_config);
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