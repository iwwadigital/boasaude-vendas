import { TableGeral } from '../../../../../core/_base/crud/models/layout/table-geral.model';
import { Component,OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TableActionsConfig } from '../../../../../core/_base/crud/models/layout/table-actions-config.model';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { FunctionsService } from '../../../../../core/_base/crud/utils/functions.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalSeguroSaudeComponent } from '../modal-seguro-saude/modal-seguro-saude.component';

@Component({
    selector: 'kt-page-seguro-saude',
	templateUrl: './page-seguro-saude.component.html',
	styleUrls: ['./page-seguro-saude.component.scss']
})
export class PageSeguroSaudeComponent implements OnInit, OnDestroy{
	private subs:Subscription = new Subscription();
    public table_config:TableGeral;
	public columns:string[] = ["nome","codigo","edit","delete"];
	public titles:string[] = ["Nome","Código","Editar","Deletar"];
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
		this.actionConfig.modal_component_edit = ModalSeguroSaudeComponent;

		this.table_config = new TableGeral({
			table_api: "seguro-saude",
			return_api: "seguros_saude",
			is_pagination : true,
			column : this.columns,
			title: this.titles,
			actionsConfig :this.actionConfig,
			has_search_filial: true,
			msg_error : "Nenhum seguro saúde encontrado.",
			filters : [
				{
					value :'nome',
					title: "Nome"
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

    public openModal(usuario?:any){
		let modal_config:MatDialogConfig = new MatDialogConfig();
		// modal_config.minHeight = 200;
		// modal_config.minWidth = 200;
		modal_config.panelClass = "modal-custom";
		if(!this.functions.isEmpty(usuario) && !this.functions.isEmptyObj(usuario)){
			modal_config.data = usuario;
		}
		let modal_ref:any = this.functions.openModal(ModalSeguroSaudeComponent,modal_config);
		modal_ref.componentInstance.response.subscribe((resp:any) =>{
			this.dialog.closeAll();
			if(resp && resp.success){
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
