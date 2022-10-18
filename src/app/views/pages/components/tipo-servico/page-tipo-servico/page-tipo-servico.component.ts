import { TableGeral } from '../../../../../core/_base/crud/models/layout/table-geral.model';
import { Component,OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TableActionsConfig } from '../../../../../core/_base/crud/models/layout/table-actions-config.model';
import { ModalTipoServicoComponent } from '../modal-tipo-servico/modal-tipo-servico.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { FunctionsService } from '../../../../../core/_base/crud/utils/functions.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'kt-page-tipo-servico',
	templateUrl: './page-tipo-servico.component.html',
	styleUrls: ['./page-tipo-servico.component.scss']
})
export class PageTipoServicoComponent implements OnInit, OnDestroy{
	private subs:Subscription = new Subscription();
    public table_config:TableGeral;
	public columns:string[] = ["nome","grupo_empresa","numero_contrato","versao_contrato","sub_contrato","versao_subcontrato","edit","delete"];
	public titles:string[] = ["Nome","Grupo de Empresa","Número do contrato","Versão do contrato","sub-contrato","Versão sub-contrato","Editar","Deletar"];
	public search:any = {}
	public actionConfig:TableActionsConfig;
    public is_refresh = false;
	public form:FormGroup = new FormGroup({
		field: new FormControl(null),
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
		this.actionConfig.modal_component_edit = ModalTipoServicoComponent;

		this.table_config = new TableGeral({
			table_api: "tipo-servico",
			return_api: "tipos_servico",
			is_pagination : true,
			column : this.columns,
			title: this.titles,
			actionsConfig :this.actionConfig,
			has_search_filial: true,
			msg_error : "Nenhum tipo de serviço encontrado.",
			filters : [
				{
					value :'nome',
					title: "Nome"
				},
				{
					value :'grupo_empresa',
					title: "Grupo de Empresa"
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

		let modal_ref:any = this.functions.openModal(ModalTipoServicoComponent,modal_config);
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

	public searchClick(){
		let form = this.form.value;
		let search:any = {}
		search.q = form.field;
		this.search = search;
	}

	ngOnDestroy(){
		this.subs.unsubscribe();
	}
}
