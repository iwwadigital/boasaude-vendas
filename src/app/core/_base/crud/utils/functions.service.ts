import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';
import {LISTA_ESTADO} from './../../../../api';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class FunctionsService {
	public timeShowMsg:number = 4000;
	public $filial:Subject<string> = new Subject<string>();
	public $filialModal:Subject<string> = new Subject<string>();
	public $logo:Subject<string> = new Subject<string>();
	constructor(
		private snackBar:MatSnackBar,
		private dialog: MatDialog
	){}
	public isEmpty(param):boolean{
		if(param === null || param === undefined || param === '' || param === false) return true;
		return false;
	}

	public isEmptyObj(obj) {
		for(let prop in obj) {
			if(obj.hasOwnProperty(prop))
				return false;
		}

		return true;
	}
	public printSnackBar(msg){
		msg = this.isEmpty(msg) ? 'Aconteceu um erro inesperado.' : msg;
		this.snackBar.open(msg,'',{duration:this.timeShowMsg});
	}

	public printMsgError(erro){
		let error:string = "";
		if(erro.status === 422){
			let keys = Object.keys(erro.error);
			keys.map((e) =>{
				error += ` ${erro.error[e][0]}`;
			});
		}
		if(erro.status === 400 || erro.status === 404 || erro.status === 406 || erro.status === 401){
			error = erro.error.message;
		}
		error = this.isEmpty(error) ? "Aconteceu um erro inesperado." : error;
		this.snackBar.open(error,'',{duration:this.timeShowMsg});
	}

	openModal(component:any,data?:MatDialogConfig){
		let dialogRef = this.dialog.open(component,data);
		return dialogRef;
	}

	public formatData(data:any,format:string,is_edit?:any){
		if(typeof data === 'string' && data.length < 11){
			data += " 00:00:00";
			data = new Date(data);
		}else{
			data = new Date(data);
		}
		let mes:any = data.getMonth() + 1;
		let dia:any = data.getDate();
		let hora:any = data.getHours();
		let minutos:any = data.getMinutes();
		let ano:any = data.getFullYear();
		dia = dia < 10 ? "0"+dia : dia;
		mes = mes < 10 ? "0"+mes : mes;
		hora = hora < 10 ? "0"+hora : hora;
		minutos = minutos < 10 ? "0"+minutos : minutos;
		
		let allDates:any ={
			'YYYY-mm-dd hh:MM' : ano+'-'+mes+'-'+dia+' '+hora+':'+minutos,
			'YYYY-mm-dd' : ano+'-'+mes+'-'+dia,
			'dd-mm-YYYY' : dia+'-'+mes+'-'+ano,
			'dd/mm/YYYY' : dia+'/'+mes+'/'+ano,
			'dd-mm-YYYY hh:MM' : dia+'-'+mes+'-'+ano+' '+hora+':'+minutos,
			'dd/mm hh:MM' : dia+'/'+mes+' '+hora+':'+minutos,
			'hh:MM' : hora+':'+minutos,
			'mm/yyyy' : mes+' '+hora+':'+minutos,
			'YYYY-mm-01' : ano+'-'+mes+'-'+"01",
		}
		return allDates[format];
	}


	public getUsuario(){
		let usuario = localStorage.getItem("usuario");
		return JSON.parse(usuario);
	}

	public getPermissaoStorage(){
		let permissoesStr = localStorage.getItem('permissoes');
		let permissoesArray = permissoesStr.split('|');
		permissoesArray.splice(permissoesArray.length -1 ,1)
		return permissoesArray;
	}

	public verificarPermissao(itemPermissao){
		let permissoesUsuario = this.getPermissaoStorage();
		let condicao:boolean = false;
		if(Array.isArray(itemPermissao) && itemPermissao.length == 0){
			return true;
		}
		if(typeof itemPermissao === 'string'){
			itemPermissao = [itemPermissao];
		}

		for(let i = 0;i < permissoesUsuario.length; i++){
			for(let y = 0; y < itemPermissao.length; y++){
				if(itemPermissao[y] === permissoesUsuario[i]){
					condicao = true;
					break;
				}
			}
			if(condicao){
				break;
			}
		}
		if(condicao){
			return true;
		}else{
			return false;
		}
	}

	public verificarTipoUsuario(tipos){
		let usuario = this.getUsuario();
		let condicao:boolean = false;
		for(let i = 0;i < tipos.length; i++){
			if(usuario.usuario_tipo_id == tipos[i]){
				condicao = true;
				break;
			}
		}
		return condicao;
	}


	public searchInObj(obj, keys){
		let itens = keys.split(".");
		let object;
		for(let i = 0; i < itens.length; i++){
			object = object[itens[i]] || null;
		}
		return object;
	}
	public searchInArrayObj(arr,key,value){
		return arr.find((v) =>{
			return v[key] === value;
		});
	}
	public searchIndexArrayObj(arr,key,value){
		return arr.findIndex((v) =>{
			return v[key] === value;
		});
	}

	public searchInlistById(element,arr:any[]){
		let index:number = null;
		for(let i=0; i < arr.length; i++){
			if(arr[i].id === element.id){
				index = i;
				break;
			}
		}
		return index;
	}

	public idade(data_nascimento:Date) {
		var d = new Date,
			ano_atual = d.getFullYear(),
			mes_atual = d.getMonth() + 1,
			dia_atual = d.getDate(),
	
			ano_aniversario = data_nascimento.getFullYear(),
			mes_aniversario = data_nascimento.getMonth() + 1,
			dia_aniversario = data_nascimento.getDate(),
	
			quantos_anos = ano_atual - ano_aniversario;
	
		if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
			quantos_anos--;
		}
	
		return quantos_anos < 0 ? 0 : quantos_anos;
	}
	public getEstado(uf){
		let lista = LISTA_ESTADO;
		for(let estado in lista){
			if(estado == uf){
				return lista[estado];
			}
		}
	}
	public getUF(est){
		let lista = LISTA_ESTADO;
		for(let estado in lista){
			if(lista[estado] == est){
				return estado;
			}
		}
	}


	public validarCPF(strCPF) {
		let Soma;
		let Resto;
		Soma = 0;
		if (strCPF == "00000000000" || strCPF ==  "11111111111" || 
			strCPF ==  "22222222222" || strCPF ==  "33333333333" || 
			strCPF ==  "44444444444" || strCPF ==  "555555555555" ||
			strCPF == "666666666666" || strCPF == "77777777777" ||
			strCPF == "88888888888" || strCPF == "99999999999") return false;
			
		for (let i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
		Resto = (Soma * 10) % 11;
		
		if ((Resto == 10) || (Resto == 11))  Resto = 0;
		if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;
		
		Soma = 0;
		for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
		Resto = (Soma * 10) % 11;
		
		if ((Resto == 10) || (Resto == 11))  Resto = 0;
		if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
		return true;
	}

	public validarCNPJ(cnpj){
		cnpj = cnpj.replace(/[^\d]+/g,'');
 
		if(cnpj == '') return false;
		
		if (cnpj.length != 14) return false;
	
		// Elimina CNPJs invalidos conhecidos
		if (cnpj == "00000000000000" || 
			cnpj == "11111111111111" || 
			cnpj == "22222222222222" || 
			cnpj == "33333333333333" || 
			cnpj == "44444444444444" || 
			cnpj == "55555555555555" || 
			cnpj == "66666666666666" || 
			cnpj == "77777777777777" || 
			cnpj == "88888888888888" || 
			cnpj == "99999999999999")
			return false;
			
		// Valida DVs
		let tamanho = cnpj.length - 2
		let numeros = cnpj.substring(0,tamanho);
		let digitos = cnpj.substring(tamanho);
		let soma = 0;
		let pos = tamanho - 7;
		for (let i = tamanho; i >= 1; i--) {
			soma += numeros.charAt(tamanho - i) * pos--;
			if (pos < 2) pos = 9;
		}
		let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		if (resultado != digitos.charAt(0)) return false;
			
		tamanho = tamanho + 1;
		numeros = cnpj.substring(0,tamanho);
		soma = 0;
		pos = tamanho - 7;
		for (let i = tamanho; i >= 1; i--) {
			soma += numeros.charAt(tamanho - i) * pos--;
			if (pos < 2) pos = 9;
		}
		resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		if (resultado != digitos.charAt(1)) return false;
			
		return true;
	}


	downloadFile(data:any){
		window.open(data,'_blank');
	}

	public cutString(str:string,limit:number){
		return str.length > limit ? str.substr(0,limit)+'...' : str;
	}

	public array_column(arr,columnName){
		return arr.map(function(value,index){
			return value[columnName];
		})
	}

	public removeCharacterSpecial(str){
		return str.replace(/[^\w\s]/gi, '');
	}

	public generateAlphaNumeric(length = 25){
		let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",results = "";
		for(let i = length; i > 0; i--){
			results += chars[Math.floor(Math.random() * chars.length)];
		}
		return results;

	}

	public setFilial(value:any){
		this.$filial.next(value)
	}
	
	public setFilialModal(value:any){
		this.$filialModal.next(value)
	}

	public setLogo(value:any){
		localStorage.setItem("logo",value);
		this.$logo.next(value)
	}


}
