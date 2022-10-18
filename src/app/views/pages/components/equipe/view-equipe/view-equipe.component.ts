import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { Equipe } from './../../../../../core/_base/crud/models/class/equipe.model';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MetaUsuario } from './../../../../../core/_base/crud/models/class/meta_usuario.model';
import { MetaEquipe } from './../../../../../core/_base/crud/models/class/meta_equipe.model';
import {
	trigger,
	state,
	style,
	animate,
	transition,
  } from '@angular/animations';
  
@Component({
    selector: 'kt-view-equipe',
	templateUrl : './view-equipe.component.html',
    styleUrls : ['./view-equipe.component.scss'],
    animations: [
		trigger('hide',[
		transition(':enter', [
			style({
					'height': '0',
					overflow:'hidden',
				}),  // initial
			animate('350ms',
				style({
					'height': '*'
				}))  // final
			]),
			transition(':leave', [
			style({
				'height': '*',
				overflow:'hidden'
			}),  // initial
			animate('350ms',
				style({
					'height': '0',
					overflow:'hidden'
				}))  // final
			]),
		]),
	]
})
export class ViewEquipeComponent implements OnInit{
    public equipe:Equipe;
    public is_loading:boolean = false;
    public is_edit:boolean = false;
    public usuarios_table:MatTableDataSource<any>;
    public usuarios:FormArray;
    public displayedColumns:string[] = ["vendedores","meta_individual","meta_data_inicio","meta_data_final","rating","view"];
    public is_filter:boolean = false;

    public form:FormGroup;
    constructor(
        private fb:FormBuilder,
        private _http:HttpService,
        private functions:FunctionsService,
        private cdr:ChangeDetectorRef,
        private route:ActivatedRoute
    ){}
    ngOnInit(){
        this.route.params.subscribe((params:any) =>{
            if(params.id){
                this.show(params.id);
            }
        })
    }

    public show(id?:any){
        this.is_loading = true;
        id = id ? id : this.equipe.id;
        this._http.show("equipe",id).subscribe((response:any) =>{
            this.equipe = response.equipe;
            this.prepareForm();
            this.is_loading = false;
            this.cdr.detectChanges();
        },(erro:any) =>{
            this.functions.printMsgError(erro);
            this.is_loading = false;
            this.cdr.detectChanges();
        })
    }

    public update(){
        if(this.form.status !== "INVALID"){
            let equipe = this.getForm();
            this._http.put("meta",equipe).subscribe((response)=>{
                this.functions.printSnackBar(response.message);
                this.is_edit = false;
                this.show();
                this.cdr.detectChanges();
            },(erro:any) =>{
                this.functions.printMsgError(erro);
            });
        }else{
            this.functions.printSnackBar("Preencha todos os campos.")
        }
    }
    // FORMULARIO --------------------------------------------------------------------------------------------------------------
    public prepareForm(){
        let meta_equipe = new MetaEquipe({equipe_id:this.equipe.id})
        if(this.equipe.metas_equipe.length > 0){
            meta_equipe.data_inicio = this.equipe.metas_equipe[0].data_inicio;
            meta_equipe.data_fim = this.equipe.metas_equipe[0].data_fim;
            meta_equipe.qtd_vidas = this.equipe.metas_equipe[0].qtd_vidas;
            meta_equipe.id = this.equipe.metas_equipe[0].id;
        }
        this.form = this.fb.group(meta_equipe);
            // Coloca Validacoes na proposta
        let validators_equipe = new MetaEquipe().getValidators();
        validators_equipe.map(el =>{
            el.validators.map(val =>{
                this.form.get(el.key).setValidators(val);
            })
        });
        this.form.addControl("usuarios", this.fb.array([]));
        this.usuarios =  this.form.get("usuarios") as FormArray
        this.usuarios_table = new MatTableDataSource<any>(this.equipe.usuarios);
        this.equipe.usuarios.map(el => {
            if(el.metas_usuario.length > 0){
                this.usuarios.push(this.fb.group(new MetaUsuario(el.metas_usuario[0])));
            }else{
                this.usuarios.push(this.fb.group(new MetaUsuario({usuario_id: el.id})))
            }
            //Validacao do usuario
            // let validators_meta_usuario = new MetaUsuario().getValidators();
            // validators_meta_usuario.map(el => {
            //     el.validators.map(val =>{
            //         this.usuarios.controls[this.usuarios.controls.length - 1].get(el.key).setValidators(val);
            //     });
            // })
        });
    }

    // GET FORM
    public getForm(){
        let equipe = new Equipe({id:this.equipe.id});
        equipe.metas_equipe = [];
        equipe.metas_equipe.push(new MetaEquipe({
            equipe_id : this.equipe.id, 
            qtd_vidas : this.form.get("qtd_vidas").value,
            data_inicio : this.functions.formatData(new Date(this.form.get("data_inicio").value),"YYYY-mm-dd"),
            data_fim : this.functions.formatData(new Date(this.form.get("data_fim").value),"YYYY-mm-dd")
        }));
        if(!this.functions.isEmpty(this.form.get("id").value)){
            equipe.metas_equipe[0].id =this.form.get("id").value;
        }
        equipe.metas_usuarios = this.usuarios.value;
        equipe.metas_usuarios.map(el => {
            if(!this.functions.isEmpty(el.data_inicio)){
                el.data_inicio = this.functions.formatData(new Date(el.data_inicio),"YYYY-mm-dd");
            }
            if(!this.functions.isEmpty(el.data_fim)){
                el.data_fim = this.functions.formatData(new Date(el.data_fim),"YYYY-mm-dd");
            }
        });
        return equipe;
    }

    public edit(){
        this.is_edit = !this.is_edit;
    }

    public toggleMobile(element:any){
		element.is_mobile_dropdown = !element.is_mobile_dropdown;
		this.cdr.detectChanges();
	}
	public toggleMoreMobile(){
		this.is_filter  = !this.is_filter;
		this.cdr.detectChanges();
	}

}