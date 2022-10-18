import { TableGeral } from '../../../../../core/_base/crud/models/layout/table-geral.model';
import { Component,OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TableActionsConfig } from './../../../../../core/_base/crud/models/layout/table-actions-config.model';
import { ModalEnderecoComponent } from '../modal-endereco/modal-endereco.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalDeleteComponent } from '../../../shared/components/modal-delete/modal-delete.component';

@Component({
    selector: 'kt-page-endereco',
	templateUrl: './page-endereco.component.html',
	styleUrls: ['./page-endereco.component.scss']
})
export class PageEnderecoComponent implements OnInit , OnDestroy{
	public table_config:TableGeral;
	private subs:Subscription = new Subscription();
	public columns:string[] = ["cep","rua","bairro","cidade","uf","delete","edit"];
	public titles:string[] = ["Cep","Rua","Bairro","Cidade","UF","Remover","Editar"];
	public actionConfig:TableActionsConfig;
	public is_refresh = false;

	public search:any = {}
	public form:FormGroup = new FormGroup({
		q : new FormControl(null),
		filtro : new FormControl(null)
	});

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
		this.actionConfig.modal_component_edit = ModalEnderecoComponent;
		this.actionConfig.modal_component_delete = ModalDeleteComponent;

		this.table_config = new TableGeral({
			table_api: "endereco",
			return_api: "enderecos",
			is_pagination : true,
			column : this.columns,
			title: this.titles,
			actionsConfig :this.actionConfig,
			has_search_filial : true,
			msg_error : "Nenhum endereço encontrado.",
			filters : [
				{
					value :'rua',
					title: "Rua"
				},
				{
					value :'bairro',
					title: "Bairro"
				},
				{
					value :'cidade',
					title: "Cidade"
				},
				{
					value :'uf',
					title: "UF"
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

		let modal_ref:any = this.functions.openModal(ModalEnderecoComponent,modal_config);
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

	public searchClick(){
		let form = this.form.value;
		let search:any = {};
		if(!this.functions.isEmpty(form.q)){
			search.q =form.q;
		}else{
			search.q = '';
		}
		this.search = search;
	}

    public changeRefresh(event){
		this.is_refresh = false;
	}

	ngOnDestroy(){
		this.subs.unsubscribe();
	}
}
