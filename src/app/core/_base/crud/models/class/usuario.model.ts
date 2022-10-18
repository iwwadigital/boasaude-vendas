import { Validators } from '@angular/forms';
import { Equipe } from './equipe.model';
import { MetaUsuario } from './meta_usuario.model';
import { UsuarioFilial } from './usuario_filiais.model';

export class Usuario{
	public id:number = null;
	public nome:string = null;
	public email:string = null;
	public login:string = null;
	public senha:string = null;
	public telefone:string = null;
	public inscricao:string = null;
	public canal_venda:string = null;
	public usuario_tipo_id:number = null;
	public e_corretora:any = 0;
	public equipe_id:number;
	public status:any = 1;
	public pode_retroagir_data:any = 0;
	public url_foto:string = null;
	public equipe:Equipe = null;
	public equipes:Equipe[] = [];
	public equipes_id:number[] = [];
	public metas_usuario:MetaUsuario[];
	public is_perfil:boolean = false;
	public usuario_filial:UsuarioFilial[] = [];

	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
	}
	public getValidators(){
		return [
			{
				key: "nome",
				validators : [
					Validators.required
				]
			},
			{
				key: "email",
				validators : [
					Validators.required,
					Validators.email
				]
			},
			{
				key : "login",
				validators : [
					Validators.required
				]
			},
			{
				key : "senha",
				validators : [
					Validators.required
				]
			},
			{
				key : "equipes_id",
				validators : [
					Validators.required
				]
			},
			{
				key : "usuario_tipo_id",
				validators : [
					Validators.required
				]
			},
		]
	}
}
