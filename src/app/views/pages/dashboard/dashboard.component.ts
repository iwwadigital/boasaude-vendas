import { FormGroup, FormControl } from '@angular/forms';
// Angular
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
// Services
// Widgets model
import { LayoutConfigService, SparklineChartOptions } from '../../../core/_base/layout';
import { Widget4Data } from '../../partials/content/widgets/widget4/widget4.component';
import { FunctionsService } from '../../../core/_base/crud/utils/functions.service';
import { Usuario } from '../../../core/_base/crud/models/class/usuario.model';
import {  STATUS_PROPOSTAS} from  '../../../api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ModalSelectFilialComponent } from '../shared/components/modal-select-filial/modal-select-filial.component';


@Component({
	selector: 'kt-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
	private subs:Subscription = new Subscription();
	public search:any = {order: "propostas.titular_nome"};
	public is_admin_geral:boolean = false;
	public is_admin_vendas:boolean = false;
	public is_supervisor:boolean = false;
	public is_validador:boolean = false;
	public is_contrato:boolean = false;
	public is_vendedor:boolean = false;
	public status_proposta = STATUS_PROPOSTAS;
	public usuario:Usuario;
	public form:FormGroup = new FormGroup({
		search : new FormControl()
	})
	constructor(
		private functions:FunctionsService,
		private router:Router,
		private cdr:ChangeDetectorRef,
		private dialog:MatDialog
	) {}

	ngOnInit(): void {
		this.usuario = this.functions.getUsuario();
		this.propostaPorTipoUsuario(this.usuario.usuario_tipo_id)
		if(!localStorage.getItem("selectFilial")){
			let modal_config :MatDialogConfig = new MatDialogConfig();
			modal_config.data = null;
			let dialogRef = this.dialog.open(ModalSelectFilialComponent,modal_config);
			dialogRef.afterClosed().subscribe((value) => {
				this.functions.setFilial(true);
			})
		}
	}

	public propostaPorTipoUsuario(tipo){
		let search:any = {
			order: "propostas.id", 
			sort: "DESC"
		};
		let equipes = this.functions.array_column(this.usuario.equipes,"id");
		let filial = localStorage.getItem("filial");
		switch(tipo){
			case 1 :{ // ADMIN GERAL
				this.is_admin_geral = true;
				break;
			}
			case 2 :{ // Supervisor
				this.is_supervisor = true;
				search = {
					vendedor_equipe_id : equipes.join(","),
					status : this.status_proposta[2]+","+this.status_proposta[3]+","+this.status_proposta[4]
					// vendedor_equipe_id : this.usuario.equipe_id
				}
				break;
			}
			case 3 :{ // Validador
				this.is_validador = true;
				search = {
					vendedor_equipe_id : equipes.join(","),
					// vendedor_equipe_id : this.usuario.equipe_id,
					// aceite_voz : 1,
					status : this.status_proposta[2]+","+this.status_proposta[3]+","+this.status_proposta[4]
				}
				break;
			}
			case 4 :{ // Vendedor
				this.is_vendedor = true;
				search = {
					vendedor_id : this.usuario.id,
					status : this.status_proposta[2]+","+this.status_proposta[3]+","+this.status_proposta[4]+","+this.status_proposta[5]
				}
				break;
			}
			case 5 : { // Admin vendas
				this.is_admin_vendas = true;
				search = {
					// vendedor_equipe_id : equipes.join(","),
					aceite_voz : 0,
					// status : this.status_proposta[2]+","+this.status_proposta[2],
					has_pendencia : 1
				}
				break;
			}
			case 6 : { // Contrato
				this.is_contrato = true;
				this.router.navigate(['/contrato'])
				return;
				break;
			}
			case 7 : { // Validador - Super
				this.is_validador = true;
				search = {
					// aceite_voz : 1,
					status : this.status_proposta[2]+","+this.status_proposta[3]+","+this.status_proposta[4]
				}
				break;
			}
			case 8 : {  // Coordenador
				this.is_supervisor = true;
				search = {
					vendedor_equipe_id : equipes.join(","),
					status : this.status_proposta[2]+","+this.status_proposta[3]+","+this.status_proposta[4]
				}
				break;
			}
			default :{
				break;
			}
		}
		search.filial = filial;
		this.search = search;
	}

	public clickSearch(){
		let form = this.form.value;
		let search:any = {};
		for(let s in this.search){
			search[s] = this.search[s];
		}
		search.q = form.search;
		this.search = search;
	}
	
	ngOnDestroy(){
		this.subs.unsubscribe();
	}
}
