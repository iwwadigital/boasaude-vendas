import { Component, Input } from "@angular/core";

@Component({
	selector: 'kt-status-proposta',
	templateUrl : './status-proposta.component.html',
	styleUrls : ['./status-proposta.component.scss'],
})
export class StatusPropostaComponent{

	public class:string;
	public status:string;
	@Input() is_mobile:boolean = false;
	@Input()  set setStatus(value){
		this.status = value;
		switch(value){
			case "Pendente": {
				this.class = "pending";
				break;
			}
			case "Aprovado": {
				this.class = "approved";
				break;
			}
			case "Em aprovação": {
				this.class = "on-approval";
				break;
			}
			case "Recusado": {
				this.class = "refused";
				break;
			}
			case "Rascunho": {
				this.class = "draft";
				break;
			}
		}
	};
}
