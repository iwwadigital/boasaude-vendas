import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';

@Component({
  selector: 'kt-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.scss']
})
export class ModalDeleteComponent implements OnInit {
	@Output() response = new EventEmitter();
	private subs:Subscription = new Subscription();
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<ModalDeleteComponent>,
		private _http:HttpService
		) { }

	ngOnInit() {}
	public delete(){
		if(this.data !== undefined){
			this.subs.add(
				this._http.delete(this.data.tabela,this.data.id)
				.subscribe((res:any)=>{
					this.setDelete(res);
				},
				(erro:any) =>{
					this.setDelete(erro.error);
				})
			);
		}
	}
	onNoClick(){
		this.dialogRef.close();
	}
	setDelete(response){
		this.response.emit(response);
	}

}
