import { Component,OnInit,OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Subscription } from 'rxjs';
import { Proposta } from './../../../../../core/_base/crud/models/class/proposta.model';
import { BtnConfig } from './../../../../../core/_base/crud/models/layout/btn-config.model';
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { ModalAceiteVozComponent } from '../../../shared/components/modal-aceite-voz/modal-aceite-voz.component';
import { ModalAssinaturaComponent } from '../../../shared/components/modal-assinatura/modal-assinatura.component';
import { ModalCreateAceiteVozComponent } from '../../../shared/components/modal-create-aceite-voz/modal-create-aceite-voz.component';
import { ModalFichaVisitaComponent } from '../../../shared/components/modal-ficha-visita/modal-ficha-visita.component';
import { ModalMessageComponent } from '../../create-proposta/modal-message/modal-message.component';
import { ModalValidatePropostaComponent } from '../../modal-validate-proposta/modal-validate-proposta.component';
import { Filial } from './../../../../../core/_base/crud/models/class/filial.model';
import { Usuario } from './../../../../../core/_base/crud/models/class/usuario.model';
import { ModalRegridirDataComponent } from '../../../shared/components/modal-regridir-data/modal-regridir-data.component';

@Component({
    selector: 'm-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit, OnDestroy{
    @Input() set setProposta(value){
        this.proposta = value;
        this.handleBtn();
    }
    @Input() set setForm(value){
        this.form = value;
    }
    @Input() disable_btn_without_value:boolean = false;
    @Output() response = new EventEmitter();
    private subs:Subscription = new Subscription();
    public proposta:Proposta|undefined;
	public usuario:Usuario|null;
    public filial:Filial;
    public form:any;
    //BTN
    public btn_aceite_voz:BtnConfig;
	public btn_aceite_voz_create:BtnConfig = new BtnConfig( {
        title: "Cadastrar Aceite de Voz",
        has_class: true,
        class: 'button-page-large button-page-default',
        is_icon:false,
        is_disabled: false,		
    });
	public btn_assinatura_create:BtnConfig;
	public btn_assinatura:BtnConfig = new BtnConfig( {
		title:'Ver Assinatura',
		has_class: true,
		class: 'button-page-large button-page-default',
		is_icon:false,
		is_disabled: false
	});
	public btn_pendencia:BtnConfig = new BtnConfig({
		title:'Criar Pendência',
		has_class: true,
		class: 'button-page-large button-page-default',
		is_icon:false,
		is_disabled: false
	});
	public btn_proposta:BtnConfig = new BtnConfig({
		title:'Autorizar Proposta',
		has_class: true,
		class: 'button-page-large button-page-default',
		is_icon:false
	});
	public btn_recusar:BtnConfig = new BtnConfig({
		title:'Recusar Proposta',
		has_class: true,
		class: 'button-page-large button-page-default',
		is_icon:false
	});
	public btn_rascunho:BtnConfig = new BtnConfig({
		title:'Liberar para Análise',
		has_class: true,
		class: 'button-page-large button-page-default',
		is_icon:false
	});
	public btn_reabrir:BtnConfig = new BtnConfig({
		title:'Reabrir Proposta',
		has_class: true,
		class: 'button-page-large button-page-default',
		is_icon:false
	});

	public btn_ficha_visita:BtnConfig;
	public btn_is_conferida:BtnConfig = new BtnConfig({
		title:'Proposta Conferida',
		has_class: true,
		class: 'button-page-large button-page-default',
		is_icon:false
	});
	public btn_is_conferida_success:BtnConfig = new BtnConfig({
		title:'Proposta Conferida',
		has_class: true,
		class: 'button-page-large button-page-success',
		is_icon:false
	});

    public btn_comprovante_univiersitario:BtnConfig = new BtnConfig({
		title:'Ver Comprovante',
		has_class: true,
		class: 'button-page-large button-page-default',
		is_icon:false,
		is_disabled: false
	});
    public btn_retroagir_data:BtnConfig = new BtnConfig({
		title:'Retroagir',
		has_class: true,
		class: 'button-page-large button-page-default',
		is_icon:false,
	});
    public btn_comprovante_univiersitario_create:BtnConfig = new BtnConfig({
		title:'Cadastrar comprovante',
		has_class: true,
		class: 'button-page-large button-page-default',
		is_icon:false,
		is_disabled: false
	});

    constructor(
        public functions:FunctionsService,
        private dialog:MatDialog,
        private cdr:ChangeDetectorRef,
        private _http:HttpService
    ){}

    public ngOnInit():void{
        this.getFilialStorage();
		this.getUsuario();
    }

    private getFilialStorage(){
        let filial:any = localStorage.getItem("filialObj");
        if(!this.functions.isEmpty(filial)){
            filial = JSON.parse(filial);
            this.filial = new Filial(filial);
        }
    }

	private getUsuario(){
		let usuario:any = localStorage.getItem("usuario");
		if(!this.functions.isEmpty(usuario)){
			usuario =  JSON.parse(usuario);
			this.usuario = new Usuario(usuario);
		}
		
	}

    private handleBtn(){
        let title_aceite = 'Validar Aceite de Voz';
        let title_comprovante = "Cadastrar Assinatura";
        if(this.functions.verificarTipoUsuario([4])){
            title_aceite = 'Ver Aceite de Voz';
        }
        if(this.proposta.aceite_voz.length  < 1){
            this.btn_aceite_voz = new BtnConfig( {
                title: title_aceite,
                has_class: true,
                class: "button-page-large button-page-default disabled",
                is_icon:false,
                is_disabled: true
            });
        }else{
            if(this.proposta.aceite_voz[this.proposta.aceite_voz.length - 1].status === "Validado"){
                this.btn_aceite_voz = new BtnConfig( {
                    title: "Aceite de voz validado",
                    has_class: true,
                    is_icon : true,
                    icon : "done",
                    class: "button-page-large button-page-success",
                    is_disabled: false
                });
            }else if(this.proposta.aceite_voz[this.proposta.aceite_voz.length - 1].status === "Recusado"){
                this.btn_aceite_voz = new BtnConfig( {
                    title: "Aceite de voz recusado",
                    has_class: true,
                    is_icon : true,
                    icon : "cancel",
                    class: "button-page-large button-page-danger",
                    
                    is_disabled: false
                });
            }
            else{
                this.btn_aceite_voz = new BtnConfig( {
                    title: title_aceite,
                    has_class: true,
                    class: 'button-page-large button-page-default',
                    is_icon:false,
                    is_disabled: false
                });
            }
        }
        if(this.proposta.ficha_visitas.length > 0){
            this.btn_ficha_visita = new BtnConfig({
                title:'Ver Ficha de visitas',
                has_class: true,
                class: 'button-page-large button-page-default',
                is_icon:false
            });
        }else{
            this.btn_ficha_visita = new BtnConfig({
                title:'Cadastrar Ficha de visita',
                has_class: true,
                class: 'button-page-large button-page-default',
                is_icon:false
            });
        }

        if(this.proposta.e_conferida){
            this.response.emit({
                update_proposta : true,
            });
        }
        if(this.proposta.comprovante || this.proposta.e_assinatura_presencial == 1){
            title_comprovante = "Alterar Assinatura";
        }
        this.btn_assinatura_create = new BtnConfig( {
            title: title_comprovante,
            has_class: true,
            class: 'button-page-large button-page-default',
            is_icon:false,
            is_disabled: false,		
        });
        if(this.proposta.status === "Aprovado"){
            let btn_proposta = this.btn_proposta;
            btn_proposta.is_icon = true;
            btn_proposta.icon = "done";
            btn_proposta.title = "Proposta autorizada";
            btn_proposta.class = "button-page-large button-page-success";
            this.btn_proposta = btn_proposta;
            this.response.emit({
                saveInTabela : true
            })
        }else{
            let btn_proposta = this.btn_proposta;
            btn_proposta.is_icon = false;
            btn_proposta.title = "Autorizar Proposta";
            btn_proposta.class = 'button-page-large button-page-default';
            this.btn_proposta = btn_proposta;
        }
        if(this.proposta.status === "Recusado"){
            let btn_recusar = this.btn_recusar;
            btn_recusar.is_icon = true;
            btn_recusar.icon = "cancel";
            btn_recusar.title = "Proposta recusada";
            btn_recusar.class = "button-page-large button-page-danger";
            this.btn_recusar = btn_recusar;
        }else{
            let btn_recusar = this.btn_recusar;
            btn_recusar.is_icon = false;
            btn_recusar.title = "Recusar Proposta";
            btn_recusar.class = "button-page-large button-page-default";
            this.btn_recusar = btn_recusar;
        }
        this.cdr.detectChanges();   
    }

    public conferirProposta(){
		this.subs.add(
			this._http.put("proposta-conferir",{id: this.proposta.id,e_conferida:1}).subscribe((resp:any) =>{
				if(resp.success){
					this.functions.printSnackBar("Proposta conferida com sucesso.");
                    this.response.emit({
                        update_proposta : true,
                        show : true
                    });
				}
			},(e) => {
				this.functions.printSnackBar("Não foi possivel conferir a proposta.");
			})
		);
	}

    public openAudio(){
		let matDialogConfig = new MatDialogConfig();
		matDialogConfig.maxWidth = 450;
		matDialogConfig.maxHeight = 225;
		if(this.proposta.aceite_voz.length > 0){
			this.proposta.aceite_voz[this.proposta.aceite_voz.length - 1].is_modal_edit = this.functions.verificarPermissao(['aceite-voz-editar']);
			matDialogConfig.data = this.proposta.aceite_voz;
		}
		matDialogConfig.panelClass = "modal-audio";
		let dialogRef:any = this.functions.openModal(ModalAceiteVozComponent,matDialogConfig);
		this.subs.add(
			dialogRef.componentInstance.response.subscribe((value) =>{
				if(!this.functions.isEmpty(value)){
					this.response.emit({
                        show : true
                    });
				}
			})
		);
	}

	public openRetroactDate(){
		let matDialogConfig = new MatDialogConfig();
		matDialogConfig.maxWidth = 450;
		matDialogConfig.maxHeight = 225;
		matDialogConfig.panelClass = "modal-audio";
		matDialogConfig.data = {
			proposta : this.proposta,
		};
		let dialogRef:any = this.functions.openModal(ModalRegridirDataComponent,matDialogConfig);
		this.subs.add(
			dialogRef.componentInstance.response.subscribe((value) =>{
				if(!this.functions.isEmpty(value)){
					this.response.emit({
                        show : true
                    });
				}
			})
		);

	}

	public openAudioCreate(){
		let matDialogConfig = new MatDialogConfig();
		matDialogConfig.maxWidth = 450;
		matDialogConfig.maxHeight = 225;
		// matDialogConfig.panelClass = "modal-audio";
		matDialogConfig.data = {
			proposta_id : this.proposta.id,
			is_exist_other : this.checkExistFildsExtra() 
		};
		let dialogRef:any = this.functions.openModal(ModalCreateAceiteVozComponent ,matDialogConfig);
		this.subs.add(
			dialogRef.componentInstance.response.subscribe((value) =>{
				if(!this.functions.isEmpty(value)){
					this.response.emit({
                        show : true
                    });
				}
			})
		);
	}

	public showAssinatura(){
		let modal_config :MatDialogConfig = new MatDialogConfig();
		// window.open(this.proposta.comprovante.midia_url);
		modal_config.data = {icon : this.proposta.comprovante.midia_url,is_assinatura:true};
		this.dialog.open(ModalMessageComponent,modal_config);
	}

	public showFichaVisita(){
		let modal_config :MatDialogConfig = new MatDialogConfig();
		// window.open(this.proposta.comprovante.midia_url);
		let proposta:any = {...this.proposta};
		proposta.adesao = this.form.value.adesao;
		proposta.mensalidade = this.form.value.mensalidade;
		modal_config.panelClass = "modal-ficha-visita";
		modal_config.data = {
			proposta_form : proposta,
			ficha_visitas : this.proposta.ficha_visitas,
			is_create : this.proposta.ficha_visitas.length > 0 ? false : true
		};
		let dialogRef:any = this.functions.openModal(ModalFichaVisitaComponent,modal_config);
		this.subs.add(
			dialogRef.componentInstance.response.subscribe((value) =>{
				if(!this.functions.isEmpty(value)){
					this.response.emit({
                        show : true
                    });
				}
			})
		);
	}

	public createAssinatura(){
		let modal_config :MatDialogConfig = new MatDialogConfig();
		// window.open(this.proposta.comprovante.midia_url);
		modal_config.data = {
			proposta_id : this.proposta.id,
			is_exist_other : this.checkExistFildsExtra()
		};
		if(window.innerWidth < 1024){
			// document.body.style.overflow = "hidden";
			document.documentElement.requestFullscreen();
		}
		let dialogRef:any = this.functions.openModal(ModalAssinaturaComponent,modal_config);
		this.subs.add(
			dialogRef.componentInstance.response.subscribe((value) =>{
				
				if(!this.functions.isEmpty(value)){
					this.response.emit({
                        show : true
                    });
				}
			})
		);
		this.subs.add(
			dialogRef._afterClosed.subscribe(()=>{
				if(window.innerWidth < 1024){
					// document.body.style.overflow = "inherit";
					document.exitFullscreen();
				}
			})
		);	
	}

    public checkExistFildsExtra(){
		if(this.proposta.e_assinatura_presencial == 1){
			return true;
		}
		if(this.proposta.aceite_voz.length > 0){
			return true;
		}
		if(!this.functions.isEmpty(this.proposta.comprovante)){
			return true;
		}
		return false;
	}

    public add_pendencia(){
		let bntConfig = new BtnConfig(this.btn_pendencia);
		bntConfig.is_disabled = true;
		this.btn_pendencia = bntConfig;
        this.response.emit({
            show_pendencia : true,
            new_pendencia : true
        });
	}

    public validatyProposta(status){
		let is_valid = true;
		let modal_config:MatDialogConfig = new MatDialogConfig();
		modal_config.panelClass = "modal-audio";
		if(this.disable_btn_without_value && status != 'Recusado'){
			this.functions.printSnackBar("Produto não cadastrado no subcontrato. Favor entrar em contato com o Cadastro para adequação.");
			return;
		}

		if(status == "Aprovado"){
			this.proposta.pendencias.map(el => {
				if(el.status === "Pendente"){
					is_valid = false;
					return;
				}
			})
			if(this.proposta.aceite_voz.length > 0 && (this.proposta.aceite_voz[this.proposta.aceite_voz.length - 1].status === "Pendente" || this.proposta.aceite_voz[this.proposta.aceite_voz.length - 1].status === "Recusado")){
				is_valid = false;
			}
		}else{
			is_valid = true;
		}
		

		if(is_valid){
			modal_config.data = {
				status : status,
				proposta : this.proposta,
				draft : false
			};
			let modal_ref:any = this.dialog.open(ModalValidatePropostaComponent,modal_config);
			modal_ref.componentInstance.response.subscribe((dados:any) =>{
				this.dialog.closeAll();
				this.response.emit({
                    show: true
                })
			});
		}else{
			this.functions.printSnackBar("Essa proposta ainda existem pendência não resolvida.");
		}
	}

    public show(){
        this.response.emit({
            show: true
        })
    }

    public retirarRascunho(){
		if(this.disable_btn_without_value){
			this.functions.printSnackBar("Produto não cadastrado no subcontrato. Favor entrar em contato com o Cadastro para adequação.");
			return;
		}
		let modal_config:MatDialogConfig = new MatDialogConfig();
		modal_config.panelClass = "modal-audio";
		modal_config.data = {
			status : status,
			proposta : this.proposta,
			draft : true
		};
		let modal_ref:any = this.dialog.open(ModalValidatePropostaComponent,modal_config);
		modal_ref.componentInstance.response.subscribe((dados:any) =>{
			this.dialog.closeAll();
			this.response.emit({
                show: true
            })
		});
	}

	public getDownload(anexo){
		window.open(anexo.midia_url,"_blank");
	}

	public addFileUniversitario(event){
		// this.isLoading = true;
		if(event.target.files && event.target.files){
			// this.anexos = event.target.files;
			let midias = new FormData();
			if(event.target.files.length > 0){
				for(let i= 0; i < event.target.files.length; i++){
					midias.append("media[]",event.target.files[i]);
				}
				midias.append("proposta_id",this.proposta.id.toString());
				midias.append("is_anexo","0");
				midias.append("is_comprovante_universitario","1");
				this._http.post("comprovante",midias).subscribe((resp:any) =>{
					this.functions.printSnackBar("Comprovantes anexados com sucesso.");
					this.show();
				
					this.cdr.detectChanges();
				},(e:any)=>{
				
					this.functions.printMsgError(e);
					this.cdr.detectChanges();
				})
			}
		}
	}

	public deleteFile(anexo:any){
		this._http.delete("comprovante",anexo.id).subscribe((resp:any)=>{
			this.functions.printSnackBar(resp.message);
			this.show();
		},(e) =>{
			this.functions.printMsgError(e);
		})
	}

    public ngOnDestroy():void{
        this.subs.unsubscribe();
    }
}