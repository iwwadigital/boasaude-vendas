import { TableGeral } from '../../../../../core/_base/crud/models/layout/table-geral.model';
import { Component,OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TableActionsConfig } from './../../../../../core/_base/crud/models/layout/table-actions-config.model';
import { ModalProdutoComponent } from '../modal-produto/modal-produto.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'kt-page-produto',
	templateUrl: './page-produto.component.html',
	styleUrls: ['./page-produto.component.scss']
})
export class PageProdutoComponent implements OnInit, OnDestroy{
	private subs:Subscription = new Subscription();
    public table_config:TableGeral;
	public columns:string[] = ["nome","valor","tabela.nome","edit","delete"];
	public titles:string[] = ["Nome","Valor","Tabela","Editar","Deletar"];
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
		this.actionConfig.modal_component_edit = ModalProdutoComponent;

		this.table_config = new TableGeral({
			table_api: "produto",
			return_api: "produtos",
			is_pagination : true,
			column : this.columns,
			title: this.titles,
			actionsConfig :this.actionConfig,
			msg_error : "Nenhum produto encontrado.",
			filters : [
				{
					value :'nome',
					title: "Nome"
				},
				{
					value :'valor',
					title: "Valor"
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

		let modal_ref:any = this.functions.openModal(ModalProdutoComponent,modal_config);
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
