import { Component, OnInit, Output,EventEmitter, Inject, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormControl, Validators, Form, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { Filial } from "./../../../../../core/_base/crud/models/class/filial.model";
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
    selector: 'kt-modal-filial',
    templateUrl: 'modal-filial.component.html',
    styleUrls: ['modal-filial.component.scss']
})
export class ModalFilialComponent implements OnInit{
    @Output() response = new EventEmitter();
    private subs:Subscription = new Subscription();
    public is_block:boolean = false;
    public is_loading:boolean = false;
    public is_edit:boolean = false;
    public filial:Filial;
    public file_name:string;
    //File
    public media:any ;
    //Preview IMG
    public base64_img:string;
    //FOrmulario
    public form:FormGroup;
    public editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: 'auto',
        minHeight: '0',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        enableToolbar: true,
        showToolbar: true,
        defaultParagraphSeparator: '',
        defaultFontName: 'Calibri',
        defaultFontSize: '2',
        fonts: [
            {class: 'arial', name: 'Arial'},
            {class: 'times-new-roman', name: 'Times New Roman'},
            {class: 'calibri', name: 'Calibri'},
            {class: 'comic-sans-ms', name: 'Comic Sans MS'}
        ],
        sanitize: true,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [
            ['fontName'],
            [ 
                'fontSize',
                'textColor',
                'backgroundColor',
                'insertImage',
                'insertVideo',
                'customClasses',
            ]
        ]
    };
    constructor(
        @Inject(MAT_DIALOG_DATA) public data:any,
        private fb:FormBuilder,
        private dialogRef:MatDialogRef<ModalFilialComponent>,
        private functions:FunctionsService,
        private _http:HttpService,
        private cdr:ChangeDetectorRef
    ){}
    ngOnInit(){
        this.form = this.fb.group(new Filial());
        let validators = new Filial().getValidators();

		validators.map(el =>{
			el.validators.map(val =>{
				this.form.get(el.key).setValidators(val);
			})
		});
        this.subs.add(
            this.form.get('nome').valueChanges.subscribe((value:any) =>{
                if(!this.is_edit){
                    let slug:string = value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // replace accents
                    slug = slug.split(" ").join("-");
                    slug = slug.toLowerCase();
                    this.form.patchValue({
                        slug : slug
                    })
                }
            })
        );

        

        if(!this.functions.isEmpty(this.data) && !this.functions.isEmptyObj(this.data)){
            this.is_loading = true;
            this.subs.add(
                this._http.show("filial",this.data.id).subscribe((response:any) =>{
                    this.setForm(response.filial);
                    this.filial = response.filial;
                    this.is_edit = true;
                    this.is_loading = false;
                },(e:any) => {
                    this.is_loading = false;
                })
            );
		}
    }
    
    public displayFn(data?:any){
		return data ? data.nome : undefined;
    }
    //FORMULARIO ------------------------------------------------------------------------------------------
    public create(){
        if(this.form.status !== "INVALID" ){
            let filial = this.getForm();
            this.subs.add(
                this._http.post(`filial`,filial).subscribe((response:any) =>{
                    this.functions.printSnackBar(response.message);
                    this.setResponse(response);
                    this.is_block = false;
                    this.cdr.detectChanges();
                },(erro:any)=>{
                    this.functions.printMsgError(erro);
                    this.setResponse(erro.erro);
                    this.is_loading = false;
                    this.is_block = false;
                    this.cdr.detectChanges();
                })
            );
        }else{
            this.functions.printSnackBar("Preencha todos os campos.")
        }
    }
    
    public update(){
        if(this.form.status !== "INVALID"){
            let filial = this.getForm();
            let id = filial.get("id");
            this.subs.add(
                this._http.post(`filial/${id}`,filial).subscribe((response:any) =>{
                    this.functions.printSnackBar(response.message);
                    this.setResponse(response);
                    this.is_block = false;
                    this.cdr.detectChanges();
                },(erro:any)=>{
                    this.functions.printMsgError(erro);
                    this.setResponse(erro.erro);
                    this.is_block = false;
                    this.cdr.detectChanges();
                })
            );
        }else{
            this.functions.printSnackBar("Preencha todos os campos.")
        }
    }

    private returnFormDataWithouObj(formData,form){
        let naoPodeSerNull = ["id"];
        let formComponentArr = ["logo","endereco","regraNegocio","metodoPagamento"]; // Array dos itens que tem componente
        let includeFormComponentArr = {};
        includeFormComponentArr = {...new Filial().getEndereco(),...includeFormComponentArr};
        includeFormComponentArr = {...new Filial().getRegraNegocio(),...includeFormComponentArr};
        includeFormComponentArr = {...new Filial().getPagamento(),...includeFormComponentArr};
        for(let key in includeFormComponentArr){
            formComponentArr.push(key);
        }
        for(let key in form){
            if(
                formComponentArr.indexOf(key) == -1 && 
                (
                    naoPodeSerNull.indexOf(key) == -1 ||
                    naoPodeSerNull.indexOf(key) >= 0 && !this.functions.isEmpty(form[key])
                )
            ){
                let value = form[key] || form[key] == 0 ? form[key] : "";
                formData.append(key,value);
            }
        }
        return formData;
    }

    private returnFormDataObj(formData,obj){
        for(let key in obj){
            let value = obj[key] ? obj[key] : "";
            formData.append(key,value);
        }
        return formData;
    }

    public getForm(){
        let filial:FormData = new FormData();
        let form = {...this.form.value};
        if(!this.functions.isEmpty(form.tipo_servico_universitario)){
            form.tipo_servico_universitario_id = form.tipo_servico_universitario.id;
            delete form.tipo_servico_universitario;
        }else{
            form.tipo_servico_universitario_id = "";
        }
        if(!this.functions.isEmpty(form.tipo_servico_telemedicina)){
            form.tipo_servico_telemedicina_id = form.tipo_servico_telemedicina.id;
            delete form.tipo_servico_telemedicina;
        }else{
            form.tipo_servico_telemedicina_id = "";
        }
        
        filial = this.returnFormDataWithouObj(filial,form);
        filial = this.returnFormDataObj(filial,form.endereco);
        filial = this.returnFormDataObj(filial,form.regraNegocio);
        filial = this.returnFormDataObj(filial,form.metodoPagamento);
        

        if(!this.functions.isEmpty(this.media)){
            filial.append("logo", this.media);
        }
        
        return filial;
    }
    
    public setForm(filial){
        let filialObj = new Filial(filial);
        filial.endereco = filialObj.getEndereco();
        filial.regraNegocio = filialObj.getRegraNegocio();
        filial.metodoPagamento = filialObj.getPagamento();
        this.base64_img = filial.logo;
        this.form.patchValue(filial);
        this.cdr.detectChanges();
    }
    //FILE ------------------------------------------------------------------------------------------------
    public addFile(event){
		// this.isLoadingFile = true;
		if(event.target.files){
			if(event.target.files.length > 0){
				this.cdr.detectChanges();
                this.media = event.target.files[0];
                this.file_name = event.target.files[0].name;
			}
		}
    }

    public removeFileBD(){
        let filial = new Filial();
        this.subs.add(
            this._http.delete(`filial-logo`,this.filial.id).subscribe((response:any) =>{
                this.functions.printSnackBar(response.message);
                this.filial.logo = null;
            },(erro:any) => {
                this.functions.printMsgError(erro);
            })
        );
    }


    public setResponse(response){
		this.response.emit(response);
    }
    
	onNoClick(){
		this.dialogRef.close(true);
	}

    ngOnDestroy(){
        this.subs.unsubscribe();
    }
}