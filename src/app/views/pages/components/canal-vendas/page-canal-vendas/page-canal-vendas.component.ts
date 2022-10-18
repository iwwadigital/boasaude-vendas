import { TableGeral } from '../../../../../core/_base/crud/models/layout/table-geral.model';
import { Component,OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TableActionsConfig } from '../../../../../core/_base/crud/models/layout/table-actions-config.model';
import { ModalCanalVendasComponent } from '../modal-canal-vendas/modal-canal-vendas.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { FunctionsService } from '../../../../../core/_base/crud/utils/functions.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'kt-page-canal-vendas',
	templateUrl: './page-canal-vendas.component.html',
	styleUrls: ['./page-canal-vendas.component.scss']
})
export class PageCanalVendasComponent implements OnInit, OnDestroy{
	private subs:Subscription = new Subscription();
    public table_config:TableGeral;
	public columns:string[] = ["nome","edit","delete"];
	public titles:string[] = ["Nome","Editar","Deletar"];
	public search:any = {}
	public actionConfig:TableActionsConfig;
    public is_refresh = false;
	public form:FormGroup = new FormGroup({
		filtro: new FormControl(null)
	})
    constructor(
        public functions:FunctionsService,
        private dialog:MatDialog,
        private cdr: ChangeDetectorRef
    ){}
    ngOnInit(){
        this.actionConfig = new TableActionsConfig();
		this.actionConfig.icon_view = "remove_red_eye";
		this.actionConfig.icon_edit = "edit";
		this.actionConfig.icon_delete = "cancel";
		this.actionConfig.has_modal_edit = true;
		this.actionConfig.has_modal_delete = true;
		this.actionConfig.modal_component_edit = ModalCanalVendasComponent;

		this.table_config = new TableGeral({
			table_api: "canal-vendas",
			return_api: "canais_vendas",
			is_pagination : true,
			column : this.columns,
			title: this.titles,
			actionsConfig :this.actionConfig,
			msg_error : "Nenhum canal de vendas encontrado.",
			filters : [
				{
					value :'nome',
					title: "Nome"
				},
			]
		});
    }

    public openModal(usuario?:any){
		let modal_config:MatDialogConfig = new MatDialogConfig();
		// modal_config.minHeight = 200;
		// modal_config.minWidth = 200;
		modal_config.panelClass = "modal-custom";

		if(!this.functions.isEmpty(usuario) && !this.functions.isEmptyObj(usuario)){
			modal_config.data = usuario;
		}

		let modal_ref:any = this.functions.openModal(ModalCanalVendasComponent,modal_config);
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
