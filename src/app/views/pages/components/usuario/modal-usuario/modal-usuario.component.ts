import { debounceTime, switchMap, catchError, takeUntil } from 'rxjs/operators';
import { Equipe } from './../../../../../core/_base/crud/models/class/equipe.model';
import { UsuarioTipo } from './../../../../../core/_base/crud/models/class/usuario_tipo.model';
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { MatDialogRef, 
	MAT_DIALOG_DATA, 
	// MatChipInputEvent, 
	// MatAutocompleteSelectedEvent, 
	// MatAutocomplete
 } from '@angular/material';
import { Usuario } from './../../../../../core/_base/crud/models/class/usuario.model';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, Output,EventEmitter,Inject, ChangeDetectorRef, ElementRef, ViewChild, OnDestroy } from "@angular/core";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { of, ReplaySubject, Subject, Subscription } from 'rxjs';
import { UsuarioFilial } from './../../../../../core/_base/crud/models/class/usuario_filiais.model';

@Component({
	selector: 'kt-modal-usuario',
	templateUrl: './modal-usuario.component.html',
	styleUrls: ['./modal-usuario.component.scss']
})
export class ModalUsuario implements OnInit, OnDestroy{
	private subs:Subscription = new Subscription();
	public form:FormGroup;
	public is_block:boolean = false;
	public is_loading:boolean = false;
	public is_edit:boolean = false;
	//Open aba de delete do usuario
	public is_delete:boolean = false;
	public usuario:Usuario;
	public usuarios_tipos:UsuarioTipo[];
	public equipes:Equipe[] = [];
	public select_equipes:any[] = [];
	public usuario_filiais:FormArray;
	separatorKeysCodes: number[] = [ENTER, COMMA];
	@Output() response = new EventEmitter();
	public filiais:string[] = [];
	public is_perfil:boolean = false;

	private _onDestroy = new Subject<void>();

	/** list of banks filtered by search keyword for multi-selection */
	public filteredEquipeMulti: ReplaySubject<Equipe[]> = new ReplaySubject<Equipe[]>(1);

	public class_filiais:any = {
		"one" : [
			{
				filial: "item item-radius-tl-all  item-radius-bl-sm-min item-radius-tr-xs-max col-sm-6",
				inscricao: "item item-radius-bl-xs-max item-radius-tr-sm-min item-radius-br-all  item-border-sm col-sm-6 block-remove"
			}
		],
		"two": [
			{
				filial: "item item-radius-tl-all item-radius-tr-xs-max col-sm-6",
				inscricao: "item   item-radius-tr-sm-min  item-border-sm col-sm-6 block-remove"
			},
			{
				filial: "item item-margin-xs-min  item-radius-bl-sm-min col-sm-6",
				inscricao: "item item-radius-bl-xs-max item-margin-xs-min  item-radius-br-all  item-border-sm col-sm-6 block-remove"
			}
		],
		"tree": [
			{
				filial: "item item-radius-tl-all  item-radius-tr-xs-max col-sm-6",
				inscricao: "item item-radius-tr-sm-min  item-border-sm col-sm-6 block-remove"
			},
			{
				filial: "item item-margin-xs-min col-sm-6",
				inscricao: "item item-margin-xs-min item-border-sm col-sm-6 block-remove"
			},
			{
				filial: "item item-margin-xs-min  item-radius-bl-sm-min col-sm-6",
				inscricao: "item item-radius-bl-xs-max item-margin-xs-min  item-radius-br-all  item-border-sm col-sm-6 block-remove"
			},
		],
	}

	// @ViewChild('equipeInput',{static: true}) equipeInput: ElementRef<HTMLInputElement>;
	// @ViewChild('auto',{static: true}) matAutocomplete: MatAutocomplete;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data:any,
		private _http:HttpService,
		private formBuilder:FormBuilder,
		private dialogRef: MatDialogRef<ModalUsuario>,
		public functions:FunctionsService,
		private cdr:ChangeDetectorRef
	){}

	ngOnInit(){
		this.getFiliais();
		let usuario_logado = this.functions.getUsuario();
		let _params_usuario:any = {};
		let _params_equipe:any = {limit : 999};
		this.form = this.formBuilder.group(new Usuario());


		// this.form.addControl("equipes", new FormControl())
		let validators = new Usuario().getValidators();
		validators.map(el =>{
			el.validators.map(val =>{
				this.form.get(el.key).setValidators(val);
			})
		});
		if(usuario_logado.usuario_tipo_id == 2){
			_params_usuario = {permission: 1};
			_params_equipe = {equipe_id: usuario_logado.equipe_id,limit : 999};
		}
		this.subs.add(
			this._http.get("usuario-tipo",_params_usuario).subscribe((response:any) =>{
				this.usuarios_tipos = response.usuarios_tipos;
			})
		)
		this.subs.add(
			this._http.get("equipe",_params_equipe).subscribe((response:any) =>{
				this.equipes = response.equipes;
				this.filteredEquipeMulti.next(this.equipes.slice());
			})
		);

		// this.form.get("equipe").valueChanges.pipe(
		// 	debounceTime(500),
		// 	switchMap(value =>{
		// 		if(value !== null && typeof value !== 'object'){
		// 			this._http.get("equipe",{q:value}).pipe(
		// 				catchError((err,caught)=>{
		// 					this.functions.printSnackBar(`Não tem equipe cadastrado com esse nome.`);
		// 					return of(err);
		// 				})
		// 			).subscribe((resp:any)=>{
		// 				this.equipes = resp.equipes;
		// 				this.cdr.detectChanges();
		// 			},(erro:any)=>{
		// 				this.equipes = [];
		// 			})
		// 		}
		// 		return of(null);
		// 	})
		// ).subscribe();

		this.form.get("equipe").valueChanges
			.pipe(takeUntil(this._onDestroy))
			.subscribe(() => {
				this.filterEquipesMulti();
			});

		if(!this.functions.isEmpty(this.data) && !this.functions.isEmptyObj(this.data)){
			if(!this.functions.isEmpty(this.data.is_perfil)){
				this.is_perfil = this.data.is_perfil;
			}
			this.is_loading = true;
			this.cdr.detectChanges();
			if(!this.is_perfil){
				this.subs.add(
					this._http.show("usuario",this.data.id).subscribe((response:any) =>{
						this.form.get('senha').clearValidators();
						this.form.get('senha').updateValueAndValidity();
						this.setForm(response.usuario);
						this.form.addControl("usuario_filiais",new FormArray([]));
						this.usuario_filiais = this.form.get("usuario_filiais") as FormArray;
						if(response.usuario.usuario_filial && response.usuario.usuario_filial.length > 0){
							let validators_usuario = new UsuarioFilial().getValidators();
							response.usuario.usuario_filial.map((el) =>{
								this.usuario_filiais.push(this.formBuilder.group(new UsuarioFilial(el)));
								validators_usuario.map(el => {
									this.usuario_filiais.controls[this.usuario_filiais.length - 1].get(el.key).setValidators(el.validators);
								})
							});							
							
						}else{
							this.usuario_filiais.push(this.formBuilder.group(new UsuarioFilial()));
						}
						this.usuario = new Usuario(response.usuario);
						this.is_edit = true;
						this.is_loading = false;
						this.cdr.detectChanges();
					},(e:any) =>{
						this.functions.printMsgError(e);
						this.is_loading = false;
						this.cdr.detectChanges();
					})
				);
			}else{
				this.subs.add(
					this._http.get("usuario/profile/view").subscribe((response:any) =>{
						this.form.get('senha').clearValidators();
						this.form.get('senha').updateValueAndValidity();
						this.setForm(response.usuario);
						this.usuario = new Usuario(response.usuario);
						this.is_edit = true;
						this.cdr.detectChanges();
						this.is_loading = false;
					},(erro:any)=>{
						this.functions.printMsgError(erro);
						this.is_loading = false;
						this.cdr.detectChanges();
					})
				);
			}
		}
	}

	ngOnDestroy(){
		this._onDestroy.next();
		this._onDestroy.complete();
		this.subs.unsubscribe();
	}

	public getFiliais(){
		this.subs.add(
			this._http.get("filial").subscribe((resp:any) => {
				this.filiais = resp.filiais;
			})
		);
	}

	public compareObjectSelect(a, b){
		if(typeof b == "string"){
			return a.nome == b;
		}
		return a.nome == b.nome;
	}

	public checkClassNameFilial(index,type){
		let class_name = "";
		if(this.usuario_filiais.length == 1){
			class_name = this.class_filiais["one"][index][type];
		}else if(this.usuario_filiais.length == 2){
			class_name = this.class_filiais["two"][index][type];
		}else{
			if(index > 0 && index < (this.usuario_filiais.length - 1)){
				index = 1;
			}else if((this.usuario_filiais.length - 1) == index){
				index = 2;
			}
			
			class_name = this.class_filiais["tree"][index][type];
		}
		return class_name;
	}
	
	public addUsuarioFilial(){
		let validators_usuario = new UsuarioFilial().getValidators();
		this.usuario_filiais.push(this.formBuilder.group(new UsuarioFilial()));
		validators_usuario.map(el => {
			this.usuario_filiais.controls[this.usuario_filiais.length - 1].get(el.key).setValidators(el.validators);
		})
		this.cdr.detectChanges();
	}

	public removeUsuarioFilial(index){
		if(this.usuario_filiais.controls[index].value.id){
			this.subs.add(
				this._http.delete("usuario/filial",this.usuario_filiais.controls[index].value.id).subscribe((resp) => {
					this.usuario_filiais.removeAt(index);
				})
			);			
		}else{
			this.usuario_filiais.removeAt(index);
		}
	}

	public getForm(){
		let usuario:Usuario = new Usuario(this.form.value);
		if(this.functions.isEmpty(usuario.senha)){
			delete usuario.senha;
		}
		if(this.usuario_filiais){
			this.usuario_filiais.value.map((el:any) =>{
				el.cidade = el.filial.nome;
				el.filial_id = el.filial.id;
			})
		}
		// usuario.equipe_id = this.form.value.equipe.id;
		usuario.canal_venda = "presencial";
		return usuario;
	}

	public setForm(usuario:Usuario){
		usuario.status = parseInt(usuario.status);
		if(this.functions.isEmpty(usuario.senha)){
			delete usuario.senha;
		}
		this.form.patchValue(usuario);
		let equipes_id = this.functions.array_column(usuario.equipes,"id");
		this.form.get("equipes_id").setValue(equipes_id);
	}



	public create(){
		if(this.form.status !== 'INVALID'){
			this.is_loading = true;
			let usuario = this.getForm();
			this._http.post("usuario",usuario).subscribe((response:any) =>{
				this.functions.printSnackBar(response.message);
				this.is_loading = false;
				this.setResponse(response);
				this.cdr.detectChanges();
			},(erro:any)=>{
				this.functions.printMsgError(erro);
				this.setResponse(erro.erro);
				this.is_loading = false;
				this.cdr.detectChanges();
			});
		}else{
			this.functions.printSnackBar("Preencha todos os campos do formulário");
		}
	}

	public update(){
		if(this.form.status !== 'INVALID'){
			let usuario = this.getForm();
			let path = !this.is_perfil ? `usuario` : 'usuario/profile/edit';
			this.is_loading = true;
			this._http.put(path,usuario).subscribe((response:any) => {
				this.functions.printSnackBar(response.message);
				this.setResponse(response);
				this.is_loading = false;
				this.cdr.detectChanges();
			},(erro:any)=>{
				this.functions.printMsgError(erro);
				this.setResponse(erro.erro);
				this.is_loading = false;
				this.cdr.detectChanges();
			});
		}else{
			this.functions.printSnackBar("Preencha todos os campos do formulário");
		}
	}


	displayFn(data?:any){
		return data ? data.nome : undefined;
	}

	public setResponse(response){
		this.response.emit(response);
	}
	onNoClick(){
		this.dialogRef.close(true);
	}

	public openDelete(){
		this.is_delete = !this.is_delete;
	}

	public delete(){
		this._http.delete("usuario",this.usuario.id).subscribe((resp:any)=>{
			this.functions.printSnackBar(resp.message);
			this.onNoClick();
			this.setResponse(resp);
		},(erro:any)=>{
			this.functions.printMsgError(erro);
		})
	}


	
	
	public filterEquipesMulti() {
		if (!this.equipes) {
		  return;
		}
		// get the search keyword
		let search = this.form.get("equipe").value;
		
		
		if (!search) {
		  this.filteredEquipeMulti.next(this.equipes.slice());
		  return;
		} else {
		  search = search.toLowerCase();
		}
		this.filteredEquipeMulti.next(
		//   this.equipes.filter(equipe => equipe.nome.toLowerCase().indexOf(search) > -1)
		  this.equipes.filter(equipe => equipe.nome.toLowerCase().indexOf(search) > -1 || (!this.functions.isEmpty(this.form.get("equipes_id").value) && this.form.get("equipes_id").value.indexOf(equipe.id) > -1))
		);
	}

}
