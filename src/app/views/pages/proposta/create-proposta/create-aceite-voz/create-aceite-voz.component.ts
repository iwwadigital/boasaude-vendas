import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { AceiteVoz } from './../../../../../core/_base/crud/models/class/aceite_voz.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Input } from "@angular/core";
import { ModalMessageComponent } from '../modal-message/modal-message.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';

@Component({
	selector: 'kt-create-aceite-voz',
	templateUrl: './create-aceite-voz.component.html',
	styleUrls: ['./create-aceite-voz.component.scss']
})
export class CreateAceiteVozComponent implements OnInit{
	public has_audio:boolean = false;
	public is_block:boolean = false;
	public media:any = null;
	public duracao:any = 0;
	@Input() public set setProposta_id(id){
		this.proposta_id = id;
		// this.proposta_id = 10;
	}
	public proposta_id:number;
	public form_aceite:FormGroup = new FormGroup({
		data_aceite_voz : new FormControl(null,[Validators.required]),
		hora_aceite_voz : new FormControl(null,[Validators.required]),
		telefone :new FormControl(null,[Validators.required]),
	})
	constructor(
		private router:Router,
		private cdr:ChangeDetectorRef,
		private _http:HttpService,
		private functions:FunctionsService,
		private dialog:MatDialog
	){}
	ngOnInit(){}

	public addFile(event){
		// this.isLoadingFile = true;
		if(event.target.files){
			if(event.target.files.length > 0){
				this.has_audio = true;
				var duration;
				this.cdr.detectChanges();
				let file = event.target.files[0];
				this.media = file;
				let audio:any = document.createElement("audio");
				audio.preload = 'metadata';
				audio.onloadedmetadata = function() {
					window.URL.revokeObjectURL(audio.src);
					writeHtml(audio.duration);
				}
				audio.src = URL.createObjectURL(file);
				if(audio){
					let tag_audio:any = document.getElementById("audio");
					tag_audio.src = audio.src;
					this.cdr.detectChanges();
				}

			}
		}
		var writeHtml = function(duration){
			document.getElementById("audio").setAttribute("data-tempo",duration);
		}
	}


	public removeFile(){
		this.has_audio = false;
		let audio:any = document.createElement("audio");
		audio.src = null;
		this.cdr.detectChanges();
	}

	public create(){
		let aceite_voz = new AceiteVoz(this.form_aceite.value);
		let modal_config:MatDialogConfig = new MatDialogConfig();
		modal_config.panelClass = 'modal-proposta-criada';
		modal_config.data = {
			tipo : "voice_accepted"
		};
		this.is_block = true;
		if(this.functions.isEmpty(this.proposta_id)){
			this.functions.printSnackBar("Identificador da proposta não foi passado.");
			this.is_block = false;
			return;
		}
		if(this.form_aceite.status === "INVALID"){
			this.functions.printSnackBar("Preencha todos os campos.");
			this.is_block = false;
			return;
		}
		let horas = this.form_aceite.value.hora_aceite_voz;
		aceite_voz.data_aceite_voz = this.functions.formatData(new Date(this.form_aceite.value.data_aceite_voz),"YYYY-mm-dd")+" "+horas.hour+":"+horas.minute;
		aceite_voz.proposta_id = this.proposta_id;
		// if(document.getElementById("audio") !== null){
		// 	this.duracao = document.getElementById("audio").getAttribute("data-tempo");
		// }
		
		// if(this.functions.isEmpty(this.media)){
		// 	aceite_voz = new AceiteVoz(this.form_aceite.value);
		// 	aceite_voz.proposta_id = this.proposta_id;
		// }else{
		// 	aceite_voz = new FormData();
		// 	aceite_voz.append("proposta_id", String(this.proposta_id));
		// 	aceite_voz.append("media", this.media);
		// 	aceite_voz.append("tempo", this.duracao);
		// }
		this._http.post("aceite-voz",aceite_voz).subscribe((resp:any)=>{
			modal_config.data.response = resp;
			this.router.navigate(['/']);
			this.dialog.open(ModalMessageComponent,modal_config);
			this.is_block = false;
			// this.functions.printSnackBar(resp.message);
			this.cdr.detectChanges();
		},(erro:any) => {
			modal_config.data.response = erro.error;
			this.dialog.open(ModalMessageComponent,modal_config);
			this.is_block = false;
			// this.functions.printMsgError(erro);
		})
	}
}
