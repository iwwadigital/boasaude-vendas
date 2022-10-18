import { TableGeral } from '../../../../../core/_base/crud/models/layout/table-geral.model';
import { Component,OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TableActionsConfig } from './../../../../../core/_base/crud/models/layout/table-actions-config.model';
import { ModalTabelaComponent } from '../modal-tabela/modal-tabela.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'kt-page-tabela',
	templateUrl: './page-tabela.component.html',
	styleUrls: ['./page-tabela.component.scss']
})
export class PageTabelaComponent implements OnInit,OnDestroy{
	private subs:Subscription = new Subscription();
    public table_config:TableGeral;
	public columns:string[] = ["nome","desreduzida","cidade","ano","status_name","edit","delete"];
	public titles:string[] = ["Nome","Nome Reduzido","Filial","Ano","Status","Editar","Deletar"];
	public actionConfig:TableActionsConfig;
	public is_refresh = false;
	public search:any = {
		status : 2
	}
	public form:FormGroup = new FormGroup({
		filtro : new FormControl(null)
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
		this.actionConfig.modal_component_edit = ModalTabelaComponent;

		this.table_config = new TableGeral({
			table_api: "tabela",
			return_api: "tabelas",
			is_pagination : true,
			column : this.columns,
			title: this.titles,
			actionsConfig :this.actionConfig,
			has_search_filial: true,
			msg_error : "Nenhuma tabela encontrada.",
			filters : [
				{
					value :'nome',
					title: "Nome"
				},
				{
					value :'cidade',
					title: "Cidade"
				},
				{
					value :'ano',
					title: "Ano"
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

    public openModal(tabela?:any){
		let modal_config:MatDialogConfig = new MatDialogConfig();
		// modal_config.minHeight = 200;
		// modal_config.minWidth = 200;
		modal_config.panelClass = "modal-custom";

		if(!this.functions.isEmpty(tabela) && !this.functions.isEmptyObj(tabela)){
			modal_config.data = tabela;
		}

		let modal_ref:any = this.functions.openModal(ModalTabelaComponent,modal_config);
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
		this.is_refresh = !this.is_refresh;
	}

	ngOnDestroy(){
		this.subs.unsubscribe();
	}
}