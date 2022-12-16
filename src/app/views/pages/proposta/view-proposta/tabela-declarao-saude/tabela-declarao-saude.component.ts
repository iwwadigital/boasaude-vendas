import { Component,OnInit,OnDestroy,Input, ChangeDetectorRef } from "@angular/core";
import { Subscription } from "rxjs";
import { HttpService } from "./../../../../../core/_base/crud/services/http.service";
import { FunctionsService } from "./../../../../../core/_base/crud/utils/functions.service";
import { API_URL, DADOS_CLINICOS_URL } from "./../../../../../api";
import { Vida } from "./../../../../../core/_base/crud/models/class/vida.model";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ModalConfirmacaoComponent } from "../../../shared/components/modal-confirmacao/modal-confirmacao.component";

@Component({
    selector : "m-tabela-declaracao-saude",
    templateUrl : "./tabela-declarao-saude.component.html",
    styleUrls : ["./tabela-declarao-saude.component.scss"]
})

export class TabelaDeclaracaoSaudeComponent implements OnInit, OnDestroy{
    @Input() set dependentes(value:any){
        this._dependentes = value;
    }
    private subs:Subscription = new Subscription();
    public titulo:string = "Declaracao de Saúde";
    public loading:boolean = false;
    public _dependentes:Vida[] = [];
    public colunas:string[] = ["tipo","nome","enviar_whatsapp","enviar_email","baixar_pdf","status"]
    constructor(
        public functions:FunctionsService,
        private http:HttpService,
        private dialog:MatDialog,
        private cdr:ChangeDetectorRef
    ){}

    ngOnInit(): void {
        
    }

    public enviarWhatsApp(dependente:Vida){
        let link = `${DADOS_CLINICOS_URL}/${dependente.id}`;
        let msg = `Falta pouco para você completar a sua adesão à BoaSaúde. Acesse o link para realizar o preenchimento dos seus dados clinicos: ${link}`;
        let url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}&phone=+55${dependente.tel_celular}`
        window.open(url, '_blank');
    }

    public btnEnviarEmail(dependente:Vida){
        let link = `dados-clinicos/enviar-email/${dependente.id}`;
        let modal_config:MatDialogConfig = new MatDialogConfig();
        // modal_config.panelClass = "modal-custom";
        modal_config.data = {
            title: "Enviar E-mail",
            msg: `Deseja enviar email para o cliente <b>${dependente.nome}</b>`
        };
        let dialogRef = this.dialog.open(ModalConfirmacaoComponent,modal_config);
        this.subs.add(
            dialogRef.componentInstance.response.subscribe((resp:any) =>{
                this.dialog.closeAll();
                if(resp.success){
                    this.loading = true;
                    this.cdr.detectChanges();
                    this.enviarEmail(link);
                }
            })
        );
    }

    private enviarEmail(link:string){
        this.subs.add(
            this.http.get(link).subscribe((resp:any) => {
                this.functions.printSnackBar(resp.message);
                this.loading = false;
                this.cdr.detectChanges();
            },(e:any) => {
                this.functions.printMsgError(e);
                this.loading = false;
                this.cdr.detectChanges();
            })
        )
    }

    public baixarPdf(dependente:Vida){
        let token = localStorage.getItem("accessToken");
		let href = `${DADOS_CLINICOS_URL}/${dependente.id}?print=1`;
		href = encodeURIComponent(href);
		let url = "https://iwwapdf.iwwadigital.com.br/?url="+href+"&filename=dados_clinicos.pdf";
		window.open(url,"blank");
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}