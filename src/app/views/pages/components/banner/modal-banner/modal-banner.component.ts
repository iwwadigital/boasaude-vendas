import { Component, OnInit, Output,EventEmitter, Inject, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { Equipe } from './../../../../../core/_base/crud/models/class/equipe.model';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Banner } from './../../../../../core/_base/crud/models/class/banner.model';
import { BANNER_SIZES } from './../../../../../api';

@Component({
    selector: 'kt-modal-banner',
    templateUrl: 'modal-banner.component.html',
    styleUrls: ['modal-banner.component.scss']
})
export class ModalBannerComponent implements OnInit{
    @Output() response = new EventEmitter();
    public is_block:boolean = false;
    public is_loading:boolean = false;
    public is_edit:boolean = false;
    public is_preview_desktop:boolean = false;
    public is_preview_mobile:boolean = false;

    public equipes:Equipe[] = [];
    //File
    public media:any ;
    public media_mobile:any ;
    //Preview IMG
    public base64_img:string;
    public base64_img_mobile:string;
    //FOrmulario
    public form:FormGroup = new FormGroup({
        id: new FormControl(null),
        nome : new FormControl(null,[Validators.required]),
        data_expiracao : new FormControl(null),
        status : new FormControl(true),
        equipe : new FormControl(null,[Validators.required]),
    });
    constructor(
        @Inject(MAT_DIALOG_DATA) public data:any,
        private dialogRef:MatDialogRef<ModalBannerComponent>,
        private functions:FunctionsService,
        private _http:HttpService,
        private cdr:ChangeDetectorRef
    ){}
    ngOnInit(){
        if(!this.functions.isEmpty(this.data) && !this.functions.isEmptyObj(this.data)){
			this._http.show("banner",this.data.id).subscribe((response:any) =>{
                this.setForm(response.banner);
                
				this.is_edit = true;
			})
		}
        this._http.get("equipe",{filial: localStorage.getItem('filial')}).subscribe((response:any) =>{
            this.equipes = response.equipes;
            this.cdr.detectChanges();
        });

        //funcao de autocomplete do produto
		this.form.get("equipe").valueChanges.pipe(
			debounceTime(500),
			switchMap(value =>{
				if(value !== null && typeof value !== 'object'){
					this._http.get("equipe",{q:value,filial: localStorage.getItem('filial')}).pipe(
						catchError((err,caught)=>{
							this.functions.printSnackBar(`Nenhuma equipe encontrada.`);
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
    }
    
    public displayFn(data?:any){
		return data ? data.nome : undefined;
    }
    //FORMULARIO ------------------------------------------------------------------------------------------
    public create(){
        if(this.form.status !== "INVALID" && !this.functions.isEmpty(this.media)){
            this.is_loading = true;
            let banner = this.getForm();
            let id = banner.get("id");
            this._http.post(`banner`,banner).subscribe((response:any) =>{
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
        }else{
            if(this.functions.isEmpty(this.media)){
                this.functions.printSnackBar("Insira uma imagem.")
            }else{
                this.functions.printSnackBar("Preencha todos os campos.")
            }
        }
    }
    
    public update(){
        if(this.form.status !== "INVALID" && (!this.functions.isEmpty(this.media) || !this.functions.isEmpty(this.base64_img))){
            this.is_loading = true;
            let banner = this.getForm();
            let id = banner.get("id");
            this._http.post(`banner/${id}`,banner).subscribe((response:any) =>{
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
        }else{
            if(this.functions.isEmpty(this.media)){
                this.functions.printSnackBar("Insira uma imagem.")
            }else{
                this.functions.printSnackBar("Preencha todos os campos.")
            }
        }
    }

    public getForm(){
        let banner:FormData = new FormData();
        let form = this.form.value;
        if(!this.functions.isEmpty(form.id)){
            banner.append("id",form.id);
        }
        banner.append("nome",form.nome);
        banner.append("status",parseInt(form.status) == 1 ? "Ativo": "Inativo");
        banner.append("equipe_id",form.equipe.id);
        
        if(!this.functions.isEmpty(form.data_expiracao)){
            banner.append("data_expiracao",this.functions.formatData(new Date(form.data_expiracao),"YYYY-mm-dd"));
        }

        if(!this.functions.isEmpty(this.media)){
            banner.append("media", this.media);
        }

        if(!this.functions.isEmpty(this.media_mobile)){
            banner.append("media_mobile", this.media_mobile);
        }

        return banner;
    }
    
    public setForm(banner){
        this.form.patchValue(banner);
        this.form.get("status").patchValue(banner.status == "Ativo" ? '1' : '0');
        this.base64_img = banner.midia_url;
        this.base64_img_mobile = banner.midia_url_mobile;
        this.cdr.detectChanges();
    }
    //FILE ------------------------------------------------------------------------------------------------
    public addFile(event,type_file){
		// this.isLoadingFile = true;
		if(event.target.files){
			if(event.target.files.length > 0){
				this.cdr.detectChanges();
                let file = event.target.files[0];
                let is_size = true;
                this.getInfoImg(file).then((val:any) =>{
                    if(type_file == "desktop"){
                        if(val.width !== BANNER_SIZES.desktop.width || val.height !== BANNER_SIZES.desktop.height){
                            this.functions.printSnackBar(`Insira uma imagem de largura ${BANNER_SIZES.desktop.width} e altura ${BANNER_SIZES.desktop.height}`)
                            is_size = false;
                        }else{
                            this.media = file;
                        }
                    }else{
                        if(val.width !== BANNER_SIZES.mobile.width || val.height !== BANNER_SIZES.mobile.height){
                            this.functions.printSnackBar(`Insira uma imagem de largura ${BANNER_SIZES.mobile.width} e altura ${BANNER_SIZES.mobile.height}`)
                            is_size = false;
                        }else{
                            this.media_mobile = file;
                        }
                    }
                    if(!is_size){
                        return;
                    }
    
                    this.base64(file).then((val:string) =>{
                        if(type_file == "desktop"){
                            this.base64_img = val;
                        }else{
                            this.base64_img_mobile = val;
                        }
                        this.is_loading = false;
                        this.cdr.detectChanges();
                    });
                })
			}
		}
    }

    public removeFile(type_file){
        if(type_file == "desktop"){
            this.base64_img = null;
            this.media = null;
            this.removeFileBD("midia_url","nome_arquivo");
        }else{
            this.base64_img_mobile = null;
            this.media_mobile = null;
            this.removeFileBD("midia_url_mobile","nome_arquivo_mobile");
        }
        this.cdr.detectChanges();
    }

    public removeFileBD(filter,nome_arquivo){
        let banner = new Banner();
        banner[filter] = null;
        banner[nome_arquivo] = null;
        this._http.post(`banner/${this.form.value.id}`,banner).subscribe((response:any) =>{
            this.functions.printSnackBar(response.message);
        },(erro:any) => {
            this.functions.printMsgError(erro);
        });
    }


    //Get info IMG
    public async getInfoImg(file){
        return await new Promise((resolve,reject) =>{
            let url = URL.createObjectURL(file);
            let img = new Image;
            img.onload = function(){
                resolve({width : img.width , height: img.height});
            }
            img.src = url;
        })
    }
    
    //Converti para base64
	public async base64(file){
		return await new Promise((resolve,reject) =>{
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		})
    }

    public setResponse(response){
		this.response.emit(response);
    }
    
    public showPreview(tipo){
        if(tipo == "desktop"){
            this.is_preview_desktop = true;
        }
        if(tipo == "mobile"){
            this.is_preview_mobile = true;
        }
        this.cdr.detectChanges();
    }

    public back(){
        this.is_preview_desktop = false;
        this.is_preview_mobile = false;
        this.cdr.detectChanges();
    }

	onNoClick(){
		this.dialogRef.close(true);
	}
}