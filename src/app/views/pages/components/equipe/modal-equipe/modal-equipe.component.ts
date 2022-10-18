import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, Inject } from "@angular/core";
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Equipe } from './../../../../../core/_base/crud/models/class/equipe.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'kt-modal-equipe',
	templateUrl : './modal-equipe.component.html',
    styleUrls: ['./modal-equipe.component.scss'],
})
export class ModalEquipeComponent implements OnInit{
    @Output() response = new EventEmitter();
    public is_block:boolean = false;
    public is_loading:boolean = false;
    public is_edit:boolean = false;
    public form:FormGroup = new FormGroup({
        id: new FormControl(null),
        nome : new FormControl(null,[Validators.required]),
        cidade : new FormControl(null)
    });

    constructor(
        @Inject(MAT_DIALOG_DATA) public data:any,
        private dialogRef:MatDialogRef<ModalEquipeComponent>,
        private functions:FunctionsService,
        private _http:HttpService,
        private cdr:ChangeDetectorRef
    ){}
    ngOnInit(){
          // Show Edit
        if(!this.functions.isEmpty(this.data) && !this.functions.isEmptyObj(this.data)){
			this.is_loading = true;
			this._http.show("equipe",this.data.id).subscribe((response:any) =>{
				this.setForm(response.equipe);
				this.is_edit = true;
				this.is_loading = false;
			},(e:any) =>{
				this.is_loading = false;
			})
		}
    }

    public create(){
		if(this.form.status !== 'INVALID'){
			this.is_block = true;
			this.is_loading = true;
			let equipe = this.getForm();
			this._http.post("equipe",equipe).subscribe((response:any) =>{
				this.functions.printSnackBar(response.message);
				this.is_loading = false;
				this.setResponse(response);
				this.is_block = false;
				this.cdr.detectChanges();
			},(erro:any)=>{
				this.functions.printMsgError(erro);
				this.setResponse(erro.erro);
				this.is_loading = false;
				this.is_block = false;
				this.cdr.detectChanges();
			});
		}else{
			this.functions.printSnackBar("Preencha todos os campos do formulário");
		}
	}

	public update(){
		if(this.form.status !== 'INVALID'){
			this.is_block = true;
			let equipe = this.getForm();
			// this.is_loading = true;
			this._http.put(`equipe`,equipe).subscribe((response:any) =>{
				this.functions.printSnackBar(response.message);
				this.setResponse(response);
				// this.is_loading = false;
				this.is_block = false;
				this.cdr.detectChanges();
			},(erro:any)=>{
				this.functions.printMsgError(erro);
				this.setResponse(erro.erro);
				// this.is_loading = false;
				this.is_block = false;
				this.cdr.detectChanges();
			});
		}else{
			this.functions.printSnackBar("Preencha todos os campos do formulário");
		}
    }


    public getForm(){
		let equipe = new Equipe(this.form.value);
		equipe.cidade = localStorage.getItem("filial");
        return equipe; 
    }

    public setForm(equipe){
        this.form.patchValue(equipe);
    }

    public setResponse(response){
		this.response.emit(response);
	}
	onNoClick(){
		this.dialogRef.close(true);
	}
}