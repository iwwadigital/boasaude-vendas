import { OnInit, Component, Input, Inject, ChangeDetectorRef, Output,EventEmitter } from '@angular/core';
import { HttpService } from '../../../../core/_base/crud/services/http.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FunctionsService } from '../../../../core/_base/crud/utils/functions.service';
import { STATUS_PROPOSTAS } from '../../../../api';

@Component({
    selector : 'kt-modal-validade-proposta',
    styleUrls : ['modal-validate-proposta.component.scss'],
    templateUrl : './modal-validate-proposta.component.html'
})
export class ModalValidatePropostaComponent implements OnInit{
    public status:string = "";
    @Output() response = new EventEmitter;
    public is_draft:boolean = false;
    public is_aprove:boolean = false;
    public params:any = {};
    constructor(
        @Inject(MAT_DIALOG_DATA) public data:any,
        private _http:HttpService,
        private dialogRef: MatDialogRef<ModalValidatePropostaComponent>,
		private functions:FunctionsService,
        private cdr:ChangeDetectorRef
    ){}
    ngOnInit(){
        this.is_draft = this.data.draft;
        this.params = {id:this.data.proposta.id,status:this.data.status};
        if( this.data.status == STATUS_PROPOSTAS[1] ){
            this.status = "aprovar";
        }else if(this.data.status == STATUS_PROPOSTAS[4]){
            this.status = "recusar";
        }
        if(this.data.status == STATUS_PROPOSTAS[2]){
            // this.params.data_proposta_aprovacao = null;
            this.params.is_exportado = 0;
            this.is_aprove = true;
        }
    }
    
    public validateProposta(){
        let url  = !this.is_draft ? "proposta-status" :"proposta-draft";
        this._http.put(url,this.params).subscribe((response:any) =>{
            if(!this.is_draft && !this.is_aprove){
                this.functions.printSnackBar(`Proposta ${this.data.status == 'Aprovado'? "aprovada" : "recusada"} com sucesso`);
            }else{
                this.functions.printSnackBar("Proposta atualizada com sucesso");
            }
            this.setResponse(response);
            this.cdr.detectChanges();
        },(erro:any) =>{
            this.functions.printMsgError(erro)
            this.setResponse(erro);
        })
    }

    
    public setResponse(response){
		this.response.emit(response);
	}
	onNoClick(){
		this.dialogRef.close(true);
	}
}