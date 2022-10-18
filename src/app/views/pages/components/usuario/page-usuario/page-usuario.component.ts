import { TableActionsConfig } from './../../../../../core/_base/crud/models/layout/table-actions-config.model';
import { ModalDeleteComponent } from './../../../shared/components/modal-delete/modal-delete.component';
import { Usuario } from './../../../../../core/_base/crud/models/class/usuario.model';
import { PageEvent, MatDialogConfig, MatDialog } from '@angular/material';
import { FunctionsService } from '../../../../../core/_base/crud/utils/functions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TableGeral } from '../../../../../core/_base/crud/models/layout/table-geral.model';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalUsuario } from '../modal-usuario/modal-usuario.component';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpService } from '../../../../../core/_base/crud/services/http.service';

@Component({
	selector: 'kt-page-usuario',
	templateUrl: './page-usuario.component.html',
	styleUrls: ['./page-usuario.component.scss']
})
export class PageUsuarioComponent implements OnInit{
	private subs:Subscription = new Subscription();
	public typeSearch:any = {};
	public table_config:TableGeral;
	public columns:string[] = [
		"nome",
		"email",
		"usuario_tipo.nome",
		// "equipe.nome",
		// "equipe.cidade",
		"edit","view"
	];
	public titles:string[] = [
		"Nome",
		"E-mail",
		"Tipo de usuário",
		// "Equipe",
		// "Região",
		"Editar","Visualizar"];
	public actionConfig:TableActionsConfig;
	public is_refresh = false;

	public usuario_logado:Usuario;

	public search:any = {};
	public form:FormGroup = new FormGroup({
		field : new FormControl(null),
		filtro : new FormControl(null),
	});
	public form_order:FormGroup = new FormGroup({
		filtro : new FormControl(null),
	});

	constructor(
		private route:ActivatedRoute,
		private router:Router,
		public functions:FunctionsService,
		private _http:HttpService,
		private cdr:ChangeDetectorRef,
		private dialog:MatDialog
	){}
	ngOnInit(){
		this.usuario_logado = this.functions.getUsuario();
		let equipes = this.functions.array_column(this.usuario_logado.equipes,"id");
		// this.pagination();
		this.actionConfig = new TableActionsConfig();
		this.actionConfig.icon_view = "remove_red_eye";
		this.actionConfig.icon_edit = "edit";
		this.actionConfig.icon_delete = "cancel";
		this.actionConfig.has_modal_edit = true;
		this.actionConfig.has_modal_view = false;
		this.actionConfig.modal_component_edit = ModalUsuario;
		this.actionConfig.path_view = "/usuario/view";

		this.table_config = new TableGeral({
			table_api: "usuario",
			return_api: "usuarios",
			is_pagination : true,
			column : this.columns,
			title: this.titles,
			actionsConfig :this.actionConfig,
			msg_error : "Nenhum usuário encontrado.",
			page : this.usuario_logado.usuario_tipo_id != 1 ? {equipes_id: equipes.join(","),is_supervisor : 1} : null,
			filters : [
				{
					value :'nome',
					title: "Nome"
				},
				{
					value :'id',
					title: "Nº de inscrição"
				},
				{
					value :'equipe_id',
					title: "Equipe"
				}
			]
		});

		this.route.queryParams.subscribe((params:any) =>{
			if(!this.functions.isEmpty(params) && !this.functions.isEmpty(params.usuario_id)){
				this._http.show("usuario",params.usuario_id).subscribe((response:any)=>{
					this.openModal(response.usuario);
				})
			}
		})
	}
	
	public openModal(usuario?:any){
		let modal_config:MatDialogConfig = new MatDialogConfig();
		modal_config.minHeight = 400;
		modal_config.minWidth = 400;
		modal_config.panelClass = "modal-custom";

		if(!this.functions.isEmpty(usuario) && !this.functions.isEmptyObj(usuario)){
			modal_config.data = usuario;
		}

		let modal_ref:any = this.functions.openModal(ModalUsuario,modal_config);
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
		search.q =form.field;
		this.search = search;
		
	}
}
