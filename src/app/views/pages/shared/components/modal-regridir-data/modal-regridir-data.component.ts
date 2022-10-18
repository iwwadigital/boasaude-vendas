import { Component, OnInit ,Inject, ChangeDetectorRef, Output , EventEmitter, OnDestroy, Input} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FunctionsService } from "./../../../../../core/_base/crud/utils/functions.service";
import { HttpService } from "./../../../../../core/_base/crud/services/http.service";

@Component({
    selector: 'm-modal-regridir-data',
    templateUrl: './modal-regridir-data.component.html',
    styleUrls: ['./modal-regridir-data.component.scss'],
})
export class ModalRegridirDataComponent implements OnInit, OnDestroy{
    @Output() response = new EventEmitter();
    private subs:Subscription = new Subscription();
    public proposta_id:number;
    public date:FormControl = new FormControl(null);
    public dataMaxima:Date;
    public dataMinima:Date;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private functions:FunctionsService,
        private http:HttpService,
        private dialogRef:MatDialogRef<ModalRegridirDataComponent>,
    ){}

    ngOnInit(){
        this.handleWithProposta();
    }

    private handleWithProposta(){
        if(this.data && this.data.proposta){
            this.date.setValue(this.data.proposta.proposta_data)
            this.dataMaxima = new Date(this.data.proposta.proposta_data);
            this.dataMinima = new Date(this.data.proposta.proposta_data);
            this.dataMinima.setDate(this.dataMinima.getDate() - 5);
            this.proposta_id = this.data.proposta.id;
        }
    }

    public changeDate(){
        if(this.date.status == "INVALID"){
            let dataMinima = this.functions.formatData(this.dataMinima,"dd/mm/YYYY");
            let dataMaxima = this.functions.formatData(this.dataMaxima,"dd/mm/YYYY");
            this.functions.printSnackBar(`Insira uma data entre ${dataMinima} e ${dataMaxima}`);
            return;
        }
        
        let data = this.returnData();
        this.subs.add(
            this.http.put("proposta/retroagir-data",data).subscribe((resp:any) => {
                this.outputFichaVisita();
                this.functions.printSnackBar(resp.message)
            },(e:any) => {
                this.functions.printMsgError(e);
            })
        );
    }

    public returnData(){
        let data = {
            proposta_data : this.date.value,
            id : this.proposta_id
        }
        let horario = this.functions.formatData(this.data.proposta.proposta_data,"hh:MM")
        data.proposta_data = this.functions.formatData(data.proposta_data,"YYYY-mm-dd");
        data.proposta_data += " "+horario;
        return data;
    }

    public outputFichaVisita(){
		this.response.emit({show:true});
        this.dialogRef.close(true);
	}

    onNoClick(){
		this.dialogRef.close();
	}

    ngOnDestroy(){
        this.subs.unsubscribe();
    }
}