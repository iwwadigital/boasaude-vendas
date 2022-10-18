import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { Equipe } from './../../../../../core/_base/crud/models/class/equipe.model';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Usuario } from './../../../../../core/_base/crud/models/class/usuario.model';
import { TableActionsConfig } from './../../../../../core/_base/crud/models/layout/table-actions-config.model';
import { TableGeral } from './../../../../../core/_base/crud/models/layout/table-geral.model';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ModalGenerateRelatorioComponent } from '../../../shared/components/modal-generate-relatorio/modal-generate-relatorio.component';
import { URL_PDF } from './../../../../../api';
import { PRINT_SCREEN } from '@angular/cdk/keycodes';

@Component({
    selector : 'kt-page-relatorio',
    templateUrl: './page-relatorio.component.html',
    styleUrls : ['./page-relatorio.component.scss']
})
export class PageRelatorioComponent implements OnInit{
    public equipes:Equipe[];
    public usuario:Usuario;
    public usuarios:Usuario[];
    public statistics:any;
    public search:any = {};
    public columns:string[] = ["id","nome","propostas_count","vidas_count","valor_total"];
	public titles:string[] = ["Nº de inscrição","Vendedor","Propostas","Vidas","Valor"];
    public actionConfig:TableActionsConfig;
    public table_config:TableGeral;
    public is_refresh = false;

    public form:FormGroup = new FormGroup({
        data_inicio : new FormControl(null),
        data_fim : new FormControl(null),
        status : new FormControl("Aprovado"),
        equipe : new FormControl(null),
        usuario : new FormControl(null),
        adesao : new FormControl(null),
    });
    constructor(
        private _http:HttpService,
        private functions:FunctionsService,
        private dialog:MatDialog,
        private cdr:ChangeDetectorRef

    ){}
    ngOnInit(){
        
        this.setDates();
        this.usuario = this.functions.getUsuario();
        let equipes = this.functions.array_column(this.usuario.equipes,"id");
        let params:any = {
            filial: localStorage.getItem("filial")
        };
        if(this.usuario.usuario_tipo_id != 1 ){
            params.equipes_id = equipes.join(",");
            this.search.equipes_id = equipes.join(",");
        }
        
        this.getEstatistica(params);

        this._http.get("equipe",params).subscribe((response:any) =>{
			this.equipes = response.equipes;
		});

		this.form.get("equipe").valueChanges.pipe(
			debounceTime(500),
			switchMap(value =>{
				if(value !== null && typeof value !== 'object'){
					this._http.get("equipe",{q:value}).pipe(
						catchError((err,caught)=>{
							this.functions.printSnackBar(`Não tem equipe cadastrado com esse nome.`);
							return of(err);
						})
					).subscribe((resp:any)=>{
						this.equipes = resp.equipes;
						this.cdr.detectChanges();
					},(erro:any)=>{
						this.equipes = [];
					})
				}
				return of(null);
			})
        ).subscribe();
        
        this._http.get("usuario",params).subscribe((response:any) =>{
			this.usuarios = response.usuarios;
		});

		this.form.get("usuario").valueChanges.pipe(
			debounceTime(500),
			switchMap(value =>{
				if(value !== null && typeof value !== 'object'){
                    params.q = value;
					this._http.get("usuario",params).pipe(
						catchError((err,caught)=>{
							this.functions.printSnackBar(`Não tem usuario cadastrado com esse nome.`);
							return of(err);
						})
					).subscribe((resp:any)=>{
						this.usuarios = resp.usuarios;
						this.cdr.detectChanges();
					},(erro:any)=>{
						this.usuarios = [];
					})
				}
				return of(null);
			})
        ).subscribe();
        
        this.functions.$filial.subscribe((value:any) =>{
            if(typeof value == "string"){
                this.getEstatistica({filial:value});
            }
        })
    }

    public search_proposta(){
        let form:any = this.form.value;
        let search:any = {
            is_relatorio : 1
        };
        let data_inicial,data_fim;
        data_fim = new Date();
        data_inicial = this.functions.formatData(data_fim,"YYYY-mm-01");
        data_fim = this.functions.formatData(data_fim,"YYYY-mm-dd");

        if(!this.functions.isEmpty(form.data_inicio)){
            search.data_inicio = this.functions.formatData(form.data_inicio,"YYYY-mm-dd");
        }else{
            search.data_inicio =data_inicial;
        }
        if(!this.functions.isEmpty(form.data_fim)){
            search.data_fim = this.functions.formatData(form.data_fim,"YYYY-mm-dd");
        }else{
            search.data_fim = data_fim;
        }
        if(!this.functions.isEmpty(form.status)){
            search.status = form.status;
        }
        if(!this.functions.isEmpty(form.equipe)){
            search.equipe_id = form.equipe.id;
        }
        if(!this.functions.isEmpty(form.usuario)){
            search.usuario_id = form.usuario.id;
        }
        if(!this.functions.isEmpty(form.adesao)){
            if(form.adesao == 1){
                search.pagamento_tipo_adesao_id = 0;
            }else{
                search.pagamento_tipo_adesao_id = 2;
            }
            // search.adesao = form.adesao;
        }
        search.filial = localStorage.getItem("filial");
        this.search = search;
        this.getEstatistica(this.search)
    }

    public openModal(type:string){
		let modal_config:MatDialogConfig = new MatDialogConfig();
		modal_config.minWidth = 1320;
		modal_config.minHeight = 250;
        modal_config.panelClass = "modal-banner-custom";
        modal_config.data = {type:type};
		let modal_ref:any = this.dialog.open(ModalGenerateRelatorioComponent,modal_config);
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

    public print(){
        let form:any = this.form.value;
        let data_inicio,data_fim,token,href = "";
        let filial = localStorage.getItem("filial");
        if(this.functions.isEmpty(form.data_inicio) || this.functions.isEmpty(form.data_fim)){
            this.functions.printSnackBar("Escolha uma data inicial e uma data final para poder imprimir.");
            return
        }

        data_inicio = this.functions.formatData(form.data_inicio,"YYYY-mm-dd");
        data_fim = this.functions.formatData(form.data_fim,"YYYY-mm-dd");

        token = localStorage.getItem("accessToken");
        href = `${URL_PDF}proposta-status?data-inicio=${data_inicio}&data-fim=${data_fim}`;
        if(!this.functions.isEmpty(form.status)){
            if(form.status == "Em Aprovação"){
                href += "&status=aprovacao";        
            }else{
                href += "&status="+form.status;
            }
        }
        if(!this.functions.isEmpty(form.usuario)){
            href += "&usuario_id="+form.usuario.id;
        }
        if(!this.functions.isEmpty(form.equipe)){
            href += "&equipe_id="+form.equipe.id;
        }
        if(!this.functions.isEmpty(form.adesao)){
            href += "&adesao="+form.adesao;
        }
        href += "&filial="+filial;
        href += "&token="+token;
        window.open(href,"_blank");
    }

    public displayFn(data?:any){
		return data ? data.nome : undefined;
    }
    
    public changeRefresh(event){
		this.is_refresh = false;
    }
    
    public setDates(){
        let data_inicial,data_fim;
        
        data_fim = new Date();
        data_inicial = this.functions.formatData(data_fim,"YYYY-mm-01");
        data_fim = this.functions.formatData(data_fim,"YYYY-mm-dd");
        status = this.form.value.status;
    
        this.search = {
            data_inicio : data_inicial,
            data_fim : data_fim,
            status : status,
            is_relatorio : 1,
            filial: localStorage.getItem("filial")
        }        
    }

    public getEstatistica(params?:any){
        this._http.get("proposta-statistics",params).subscribe((response:any) =>{
            this.statistics = response.estatistica;
            this.cdr.detectChanges();
        })
    }
}