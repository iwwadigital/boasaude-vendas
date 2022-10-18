import { Component,OnInit, Input } from "@angular/core";
import { FunctionsService } from './../../../../../../core/_base/crud/utils/functions.service';

@Component({
	selector: 'kt-column',
	templateUrl : './column.component.html',
	// styleUrls : ['./column.component.scss'],
})
export class ColumnComponent implements OnInit {
	@Input() obj;
	@Input() linha;
	@Input() is_progress_bar:boolean = false;

	public is_valor:boolean = false;
	constructor(
		private functions:FunctionsService
	){}
	ngOnInit() {}

	public getValorColuna(element,linha){
		let itens = linha.split(".");
		let objeto = element;
		for(let i =0; i < itens.length; i++){
			if(!this.functions.isEmpty(itens[i]) && !this.functions.isEmpty(objeto)){
				objeto = objeto[itens[i]];
			}else{
				objeto = '';
			}
		}
		if(linha == "valor" || linha == "valor_total"){
			this.is_valor = true;
		}
		return objeto;
	}
}
