import { Component, OnInit, ChangeDetectorRef, Inject,EventEmitter, Output, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpService } from '../../../../../core/_base/crud/services/http.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FunctionsService } from '../../../../../core/_base/crud/utils/functions.service';
import { TipoServico } from '../../../../../core/_base/crud/models/class/tipo_servico.model';
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { of, Subscription } from "rxjs";
import { Usuario } from "../../../../../core/_base/crud/models/class/usuario.model";
import { debounceTime, switchMap } from "rxjs/operators";

@Component({
    selector: 'kt-modal-tipo-servico',
	templateUrl: './modal-tipo-servico.component.html',
	styleUrls: ['./modal-tipo-servico.component.scss']
})
export class ModalTipoServicoComponent implements OnInit,OnDestroy{
	@Output() response = new EventEmitter();
	private subs:Subscription = new Subscription();
    public form:FormGroup;
    public is_edit:boolean = false;
	public is_loading:boolean = false;
	public is_block:boolean = false;
	public usuarios:Usuario[] = [];
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
		private _http:HttpService,
		private formBuilder:FormBuilder,
		private dialogRef: MatDialogRef<ModalTipoServicoComponent>,
		private functions:FunctionsService,
        private cdr:ChangeDetectorRef
    ){}
    ngOnInit(){
		this.handleForm();
		this.getUsuario();
        this.handleEdit();
        
    }

	private handleForm(){
		this.form = this.formBuilder.group(new TipoServico());
        let validators = new TipoServico().getValidators();
		validators.map(el =>{
			this.form.get(el.key).setValidators(el.validators);
		});

		this.subs.add(
			this.form.get("usuario_vendedor").valueChanges.pipe(
				debounceTime(500),
				switchMap(value =>{
					if(value !== null && typeof value !== 'object'){
						let filial = localStorage.getItem("filial");
						let params:any ={q:value,filial: filial};
						this.getUsuario(params);
					}
					return of(null);
				})
			).subscribe()
		);
	}

	private handleEdit(){
		// Show Edit
        if(!this.functions.isEmpty(this.data) && !this.functions.isEmptyObj(this.data)){
			this.subs.add(
				this._http.show("tipo-servico",this.data.id).subscribe((response:any) =>{
					this.setForm(response.tipo_servico);
					this.is_edit = true;
				})
			);
		}
	}

    public getForm(){
		let tipo_servico:TipoServico = new TipoServico(this.form.value);
		tipo_servico.cidade = localStorage.getItem("filial");
		tipo_servico.usuario_vendedor_id = tipo_servico.usuario_vendedor ? tipo_servico.usuario_vendedor.id : null;
		return tipo_servico;
	}

	public setForm(tipo_servico:TipoServico){
		this.form.patchValue(tipo_servico);
    }

    public create(){
		if(this.form.status !== 'INVALID'){
			this.is_block = true;
			this.is_loading = true;
			let tipo_servico = this.getForm();
			this.subs.add(
				this._http.post("tipo-servico",tipo_servico).subscribe((response:any) =>{
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
				})
			);
		}else{
			this.functions.printSnackBar("Preencha todos os campos do formulário");
		}
	}

	public update(){
		if(this.form.status !== 'INVALID'){
			this.is_block = true;
			let tipo_servico = this.getForm();
			this.is_loading = true;
			this.subs.add(
				this._http.put(`tipo-servico`,tipo_servico).subscribe((response:any) =>{
					this.functions.printSnackBar(response.message);
					this.setResponse(response);
					this.is_loading = false;
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
			this.functions.printSnackBar("Preencha todos os campos do formulário");
		}
    }

	public getUsuario(params?:any){
		this.subs.add(
			this._http.get(`usuario`,params).subscribe((resp:any) => {
				this.usuarios = resp.usuarios; 
				this.cdr.detectChanges();
			},(e:any) => {
				this.usuarios = [];
				this.functions.printMsgError(e);
				this.cdr.detectChanges();
			})
		);
	}

    public setResponse(response){
		this.response.emit(response);
	}
	onNoClick(){
		this.dialogRef.close(true);
	}

	displayFn(data?:any){
		return data ? data.nome : undefined;
	}
	ngOnDestroy(): void {
		
	}
}
