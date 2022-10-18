import { Component, OnInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { TableGeral } from './../../../../../core/_base/crud/models/layout/table-geral.model';
import { TableActionsConfig } from './../../../../../core/_base/crud/models/layout/table-actions-config.model';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ModalBannerComponent } from '../modal-banner/modal-banner.component';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'kt-page-banner',
    templateUrl: './page-banner.component.html',
    styleUrls : ["page-banner.component.scss"]

})
export class PageBannerComponent implements OnInit , OnDestroy{
	private subs:Subscription = new Subscription();
    public table_config:TableGeral;
	public columns:string[] = ["nome","equipe.nome","equipe.cidade","edit"];
	public titles:string[] = ["Banner","Equipe","Região","Editar"];
	public actionConfig:TableActionsConfig;
	public search = {}
	public form:FormGroup = new FormGroup({
		filtro : new FormControl(null)
	})
	public is_refresh = false;
	constructor(
		public functions:FunctionsService,
		private dialog:MatDialog,
		private cdr:ChangeDetectorRef
	){}
    ngOnInit(){
        this.actionConfig = new TableActionsConfig();
		this.actionConfig.icon_view = "remove_red_eye";
		this.actionConfig.icon_edit = "edit";
		this.actionConfig.icon_delete = "cancel";
		this.actionConfig.has_modal_edit = true;
		this.actionConfig.modal_component_edit = ModalBannerComponent;
		this.actionConfig.modal_component_edit_class = "modal-banner-custom";
		

		this.table_config = new TableGeral({
			table_api: "banner",
			return_api: "banners",
			is_pagination : true,
			column : this.columns,
			has_search_filial : true,
			title: this.titles,
			actionsConfig :this.actionConfig,
			msg_error : "Nenhum banner encontrado.",
			filters : [
				{
					value :'nome',
					title: "Banner"
				},
				{
					value :'equipe_id',
					title: "Equipe"
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
		modal_config.minWidth = 1320;
		modal_config.minHeight = 250;
		modal_config.panelClass = "modal-banner-custom";

		if(!this.functions.isEmpty(equipe) && !this.functions.isEmptyObj(equipe)){
			modal_config.data = equipe;
		}else{
			modal_config.data = null;
		}

		let modal_ref:any = this.dialog.open(ModalBannerComponent,modal_config);
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