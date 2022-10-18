import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit,Inject,ChangeDetectorRef } from "@angular/core";

@Component({
	selector: 'kt-modal-message',
	templateUrl: './modal-message.component.html',
	styleUrls: ['./modal-message.component.scss'],
})
export class ModalMessageComponent implements OnInit{
	public sing_success:string = "./assets/vitalmed/icone-assinatura-cadastrada.svg";
	public voice_accepted_success:string = "./assets/vitalmed/icone-proposta-criada.svg";
	public sing_recused:string = "./assets/vitalmed/icone-proposta-recusada.svg";
	public icon:string = "";
	public message:string = "";
	public is_assinatura:boolean = false;
	constructor(
		@Inject(MAT_DIALOG_DATA) public data:any,
		private dialogRef:MatDialogRef<ModalMessageComponent>,
		private cdr:ChangeDetectorRef
	){}
	ngOnInit(){
		if(this.data.response){
			this.message = this.data.response.message;
		}
		if(this.data.is_assinatura){
			this.is_assinatura = this.data.is_assinatura;
		}
		switch(this.data.tipo){
			case "refused" : {
				this.icon = this.sing_recused;
				break;
			}
			case "sing" :{
				this.icon = this.sing_success;
				break;
			}
			default :{
				this.icon = this.voice_accepted_success;	
				break;
			}
		}
		if(this.data.icon){
			this.icon = this.data.icon;
		}
		
		this.cdr.detectChanges();
	}

	onNoClick(){
		this.dialogRef.close(true);
	}
}
